'use strict'

const debug = require('debug')('platziverse:db:setup')
const db = require('./')

async function setup () {
  const config = {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'aventador',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    logging: s => debug(s),
    setup: true,
    operatorsAliases: false
  }

  await db(config).catch(handleFatalError)

  console.log('success!')
  process.exit(0)
}

function handleFatalError (err) {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

setup()
