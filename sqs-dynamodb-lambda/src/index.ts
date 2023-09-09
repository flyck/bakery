import { DynamoDB } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import { SQSEvent } from "aws-lambda"
// doesnt compile 👇 https://github.com/oven-sh/bun/issues?q=is%3Aissue+is%3Aopen+child_process
// import { fromNodeProviderChain, fromEnv } from "@aws-sdk/credential-providers"
// import { defaultProvider } from "@aws-sdk/credential-provider-node"
import { fromEnv } from "@aws-sdk/credential-provider-env"



const table = process.env["TABLE_NAME"]

async function handler(event: SQSEvent) {
  console.info("Received Event: ", JSON.stringify(event))

  const client = new DynamoDB({
    region: "eu-central-1",
    credentials: fromEnv()
  })
  const docClient = DynamoDBDocumentClient.from(client);
  const putCommand = new PutCommand({
    TableName: table,
    Item: {
      CommonName: "Shiba Inu",
    },
  });

  console.info("Adding item to table...")
  await docClient.send(putCommand)
  console.info("Operation complete");
}

export default handler
