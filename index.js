"use strict"

// npm
require("dotenv-safe").config()
const Koa = require("koa")
const mount = require("koa-mount")
const bodyParser = require("koa-bodyparser")
const { Pool, Client } = require("pg").native

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

const visitorPool = new Pool({
  user: process.env.SITEVISITOR,
  password: process.env.SITEVISITORPW,
  connectionString: process.env.SITECONN,
})

const app = new Koa()

app.use(bodyParser())

app.use(
  mount("/login", (ctx) => {
    ctx.type = "text/html"
    switch (ctx.method) {
      case "GET":
        return loginForm(ctx)
      case "POST":
        return loginSubmit(ctx)
    }
    ctx.body = `Method ${ctx.method} not supported.`
  }),
)

app.use(
  mount("/", async (ctx) => {
    if (ctx.path !== "/") {
      ctx.status = 404
      return
    }
    const n = Date.now()
    const res = await visitorPool.query("SELECT * from table1")
    ctx.type = "text/html"
    ctx.body = `${JSON.stringify(res.rows)} - ${Date.now() -
      n}; <a href='/login'>login</a>`
  }),
)

module.exports = app
