import { DynamoDB } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import { SQSEvent } from "aws-lambda"
// doesnt build 👇 https://github.com/oven-sh/bun/issues?q=is%3Aissue+is%3Aopen+child_process
// import { fromNodeProviderChain } from "@aws-sdk/credential-providers"

// doesnt build but works in test 👇 https://github.com/oven-sh/bun/issues?q=is%3Aissue+is%3Aopen+child_process
import { defaultProvider } from "@aws-sdk/credential-provider-node"


// ✅ builds and works in lambda runtime
// import { fromEnv } from "@aws-sdk/credential-provider-env"



const table = process.env["TABLE_NAME"]

async function handler(event: SQSEvent) {
  console.info("Received Event: ", JSON.stringify(event))

  const client = new DynamoDB({
    region: "eu-central-1",
    credentials: defaultProvider()
  })
  const docClient = DynamoDBDocumentClient.from(client);
  const putCommand = new PutCommand({
    TableName: table,
    Item: {
      id: 123,
      CommonName: "Shiba Inu",
    },
  });

  console.info("Adding item to table...")
  await docClient.send(putCommand)
  console.info("Operation complete");

  return {
    status: 200,
    message: "success"
  }
}

export { handler }
export default handler
