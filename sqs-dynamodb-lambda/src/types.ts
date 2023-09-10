import { z } from "zod";

export type messageItems = z.infer<typeof messageItems>
export const messageItems = z.object({
  id: z.optional(z.number()),
  name: z.string(),
}).array();

export type DynamoDbItem = z.infer<typeof dynamoDbItem>
export const dynamoDbItem = z.object({
  id: z.number(),
  name: z.string(),
});
