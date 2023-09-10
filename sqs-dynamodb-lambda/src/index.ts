import { DynamoDB } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import { SQSEvent } from "aws-lambda"
import { defaultProvider } from "@aws-sdk/credential-provider-node"
import { DynamoDbItem, messageItems } from "./types"

// doesnt build 👇 https://github.com/oven-sh/bun/issues?q=is%3Aissue+is%3Aopen+child_process
// import { fromNodeProviderChain } from "@aws-sdk/credential-providers"

const table = process.env["TABLE_NAME"]

async function handler(event: SQSEvent) {
  console.info("Received Events: ", JSON.stringify(event))

  // work-around for something weird the bun lambda layer does currently
  const bunEvent = event as unknown as any
  if (bunEvent["aws"] != undefined) {
    console.info("unpacking aws event in runtime...")
    event = bunEvent["aws"]
  }

  let items: DynamoDbItem[] = []
  event.Records.forEach((record) => {
    let message: messageItems
    try {
      message = messageItems.parse(JSON.parse(record.body))
    } catch (err) {
      throw new Error("Couldnt parse message payload: " + err)
    }

    message.forEach((item) => {
      if (!item.id) {
        item.id = Math.floor(Math.random() * 100000) + 1
      }

      items.push({
        id: item.id,
        name: item.name
      })
    })
  })

  await save(items)

  return {
    status: 200,
    message: "success"
  }
}

async function save(items: DynamoDbItem[]) {
  console.log("Saving items")

  const client = new DynamoDB({
    region: "eu-central-1",
    credentials: defaultProvider()
  })
  const docClient = DynamoDBDocumentClient.from(client)

  console.info("Adding items to table...")

  await Promise.all(items.map(async (item) => {
    const putCommand = new PutCommand({
      TableName: table,
      Item: item,
    })
    await docClient.send(putCommand)
    console.log("Saved: ", JSON.stringify(item))
  }))

  console.info("Operation complete")
}

export { handler }
export default handler
