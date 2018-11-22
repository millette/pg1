"use strict"

// npm
require("dotenv-safe").config()
const Koa = require("koa")
const mount = require("koa-mount")
const bodyParser = require("koa-bodyparser")
const { Pool } = require("pg").native

// self
const { login } = require("./lib")

const visitorPool = new Pool({
  user: process.env.SITEVISITOR,
  password: process.env.SITEVISITORPW,
  connectionString: process.env.SITECONN,
})

const front = async (ctx) => {
  if (ctx.path !== "/") {
    ctx.status = 404
    return
  }
  const n = Date.now()
  const res = await visitorPool.query("SELECT * from table1")
  ctx.type = "text/html"
  ctx.body = `
    ${JSON.stringify(res.rows)} -
    ${Date.now() - n};
    <a href='/login'>login</a>
  `
}

const app = new Koa()

app.use(bodyParser())
app.use(mount("/login", login))
app.use(mount("/", front))

module.exports = app
