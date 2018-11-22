"use strict"

const checkPool = require(".")

checkPool()
  .then((app) => app.listen(3000))
  .catch(console.error)
