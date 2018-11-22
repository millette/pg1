"use strict"

// npm
require("dotenv-safe").config()
const Koa = require("koa")
const mount = require("koa-mount")
const bodyParser = require("koa-bodyparser")
const { Pool } = require("pg").native

// self
const { login, front } = require("./lib")

const app = new Koa()

const pool = new Pool({
  user: process.env.SITEVISITOR,
  password: process.env.SITEVISITORPW,
  connectionString: process.env.SITECONN,
})

const checkPool = () =>
  pool
    .connect()
    .then((client) => client.release())
    .then(() => {
      app.context.visitorPool = pool
      app.use(bodyParser())
      app.use(mount("/login", login))
      app.use(mount(front))
      return app
    })

module.exports = checkPool
