'use strict'

const db = require('./')
const debug = require('debug')('platziverse:db:setup')
const inquirer = require('inquirer')
const chalk = require('chalk')

const prompt = inquirer.createPromptModule()

async function setup () {
  const answer = await prompt([{
    type: 'confirm',
    name: 'setup',
    message: 'This will destroy tour database, are you sure?'
  }])

  if (!answer.setup) {
    return console.log(chalk.cyan(`
    ------------------
     Nothing happened
    ------------------
    `))
  }

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
  console.log(chalk.green(`
  ------------------
  ---- success! ----
  ------------------
  `))
  process.exit(0)
}

function handleFatalError (err) {
  console.error(`${chalk.red('[ERROR FATAL]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

setup()
