'use strict'

const proxyquire = require('proxyquire')
const sinon = require('sinon')
const test = require('ava')

const agentsFixtures = require('./fixtures/agent-fixturer')
const metricFixtures = require('./fixtures/metric-fixtures')

let config = {
  logging: function () {}
}

let uuid = 'yyy-yyy-yyy'
let type = 'CPU'
let AgentStub = null
let MetricStub = null
let db = null
let sandbox = null

let uuidArgs = {
  where: {
    uuid
  }
}

let newMetric = {
  id: 8,
  type: 'CPU',
  value: '60%',
  createAt: new Date(),
  agentId: 2
}

let metricUuidArgs = {
  attributes: [ 'type' ],
  group: [ 'type' ],
  include: [{
    attributes: [],
    model: AgentStub,
    where: {
      uuid
    }
  }],
  row: true
}

let typeUuidArgs = {
  attributes: ['id', 'type', 'value', 'cretedAt'],
  where: {
    type
  },
  limit: 20,
  order: [['createdAt', 'DESC']],
  include: [{
    attributes: [],
    model: AgentStub,
    where: {
      uuid
    },
    row: true
  }]
}

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()

  MetricStub = {
    belongsTo: sandbox.spy()
  }

  AgentStub = {
    hasMany: sandbox.spy()
  }

  // Model create Stub
  AgentStub.findOne = sandbox.stub()
  AgentStub.findOne.withArgs(uuidArgs).returns(Promise.resolve(agentsFixtures.byUuid(uuid)))

  const setupDatabase = proxyquire('../', {
    './models/agent': () => AgentStub,
    './models/metric': () => MetricStub
  })

  db = await setupDatabase(config)
})

test.afterEach(() => {
  if (sandbox) sandbox.restore()
})

test('Metric', t => {
  t.truthy(db.Metric, 'Metric service should exit')
})

test.serial('Setup-Metric', t => {
  t.true(AgentStub.hasMany.called, 'AgenModel.hasMany was executed')
  t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument should be the MetricModel')
  t.true(MetricStub.belongsTo.called, 'MetricStub.hasMany was executed')
  t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument should be the AgentModel')
})

test.serial()
