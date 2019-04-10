// handler.js
const { serverless } = require('@probot/serverless-gcf')
const appFn = require('./index')

module.exports.probot = serverless(appFn)
