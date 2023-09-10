import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'

const app = new Hono()

app.get('/', (c) => {
  console.log("I am called (GET /)")
  return c.text('Hono!')
})

app.get('/*', (c) => {
  console.log("I am called (GET /*)")
  return c.text('Hono!')
})


// workaround for current bun lambda layer:
// const event = bunevent["aws"] change this in the handle() source so the event gets unpacked
const handler = handle(app)

export default handler
