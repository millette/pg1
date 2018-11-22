"use strict"

// npm
const { Client } = require("pg").native

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

const login = (ctx) => {
  ctx.type = "text/html"
  switch (ctx.method) {
    case "GET":
      return loginForm(ctx)
    case "POST":
      return loginSubmit(ctx)
  }
  ctx.body = `Method ${ctx.method} not supported.`
}

module.exports = { login }