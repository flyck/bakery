import { DynamoDB } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import { SQSEvent } from "aws-lambda"
import { z } from "zod";
// doesnt build 👇 https://github.com/oven-sh/bun/issues?q=is%3Aissue+is%3Aopen+child_process
// import { fromNodeProviderChain } from "@aws-sdk/credential-providers"

// doesnt build but works in test 👇 https://github.com/oven-sh/bun/issues?q=is%3Aissue+is%3Aopen+child_process
import { defaultProvider } from "@aws-sdk/credential-provider-node"


// ✅ builds and works in lambda runtime
// import { fromEnv } from "@aws-sdk/credential-provider-env"



const table = process.env["TABLE_NAME"]

const messageItem = z.object({
  id: z.optional(z.number()),
  name: z.string(),
}).array();

type DynamoDbItem = z.infer<typeof dynamoDbItem>
const dynamoDbItem = z.object({
  id: z.number(),
  name: z.string(),
});


async function handler(event: SQSEvent) {
  console.info("Received Events: ", JSON.stringify(event))

  let items: DynamoDbItem[] = []
  event.Records.forEach((record) => {
    const message = messageItem.parse(JSON.parse(record.body))

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
