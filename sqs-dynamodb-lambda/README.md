# sqs-dynamodb-lambda

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Current status

- ✅ works in local test
- ✅ works in lambda
  - lambda layer gives after completion:
```bash
616 |       throw new Error("fetch() did not return a Response");
                ^
error: fetch() did not return a Response
      at /opt/runtime.ts:616:12
```
