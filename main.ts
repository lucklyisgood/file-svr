import { Hono } from "https://deno.land/x/hono@v4.1.0/mod.ts"
import { serveStatic, cors, compress, logger } from "https://deno.land/x/hono@v4.1.0/middleware.ts"

const app = new Hono()

app.use(cors())
app.use(compress())
app.use(logger())

app.get('/', (c) => c.text('Hello Deno!'))

app.use('/static/uploads/*', serveStatic({ root: './' }))

app.post('/upload', async (c) => {
  const body = await c.req.parseBody()
  let dist_path = body['path']
  if(typeof dist_path ==='object') {
    dist_path = await dist_path.text()
  }
  const file = body['file']
  const file_data = await file.stream()

  await Deno.mkdir(`./static/uploads/${dist_path}`, { recursive: true })

  const filePath = `./static/uploads/${dist_path}/${file.name}`

  console.log(dist_path, file, filePath)

  await Deno.writeFile(filePath, file_data)

  return c.json({
    status: 0,
    path: filePath
  })
});

Deno.serve(app.fetch)