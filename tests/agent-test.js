'use strict'

const test = require('ava')

let config = {
  logging: function () {}
}
let db = null

test.beforeEach(async () => {
  const setupDatabase = require('../')
  db = await setupDatabase(config)
})

test('Agent#Exist', t => {
  t.truthy(db.Agent, 'Agent service should exist')
})
