"use strict"

// npm
require("dotenv").config()
if (
  !process.env.SITEVISITOR ||
  !process.env.SITEVISITORPW ||
  !process.env.SITECONN
) {
  console.error("missing config")
  process.exit(1)
}
const Koa = require("koa")
const mount = require("koa-mount")
const bodyParser = require("koa-bodyparser")
const { Pool, Client } = require("pg").native

const visitorPool = new Pool({
  user: process.env.SITEVISITOR,
  password: process.env.SITEVISITORPW,
  connectionString: process.env.SITECONN,
})

const app = new Koa()

app.use(bodyParser())

app.use(
  mount("/bo", async (ctx) => {
    const n = Date.now()
    const res = await visitorPool.query("SELECT * from table1")
    ctx.body = `${JSON.stringify(res.rows)} - ${Date.now() - n}`
  }),
)

const loginForm = (ctx) => {
  ctx.body = `<form method='post'>
  name: <input type='text' name='user'><br>
  password: <input type='text' name='password'><br>
  <input type='submit'>
  `
}

const loginSubmit = async (ctx) => {
  if (!ctx.request.body.user || !ctx.request.body.password) {
    ctx.body = "Missing username or password."
    return
  }
  try {
    const n = Date.now()
    const client = new Client({
      ...ctx.request.body,
      connectionString: process.env.SITECONN,
    })
    await client.connect()
    const res = await client.query("SELECT current_user, session_user")
    ctx.body = `${JSON.stringify(res.rows)} - ${Date.now() - n}`
    await client.end()
  } catch (e) {
    ctx.body = e.toString()
  }
}

app.use(
  mount("/foo", (ctx) => {
    switch (ctx.method) {
      case "GET":
        return loginForm(ctx)
      case "POST":
        return loginSubmit(ctx)
    }
    ctx.body = `Method ${ctx.method} not supported.`
  }),
)

module.exports = app
