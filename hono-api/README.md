# hono-api

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Dev Notes

ExpressJs didnt initially work with bun, which is one of the reasons hono was created
[docs](https://hono.dev/concepts/motivation).

Came across it through Fireships [shoutout](https://www.youtube.com/watch?v=dWqNgzZwVJQ).

## Current status

- result breaks with http 500, probably because of issues with the lambda layer
- hono handler needs to be modified after install, also because of lambda layer
