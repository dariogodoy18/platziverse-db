'use strict'

const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const agentsFixteres = require('./fixtures/agent-fixturer')

let config = {
  logging: function () {}
}

let MetricStub = {
  belongsTo: sinon.spy()
}

let single = Object.assign({}, agentsFixteres.single)
let id = 1
let uuid = 'yyy-yyy-yyy'
let AgentStub = null
let db = null
let sandbox = null

const uuidArgs = {
  where: {
    uuid
  }
}

let newAgent = {
  uuid: '123-123-123',
  name: 'test',
  useername: 'test',
  hostname: 'test',
  pid: 0,
  connected: false
}

let connectedArgs = {
  where: { connected: true }
}

let usernameArgs = {
  where: { username: 'dario', connected: true }
}

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()

  AgentStub = {
    hasMany: sandbox.spy()
  }

  // Model findOne stub from Agent createOrUpdate
  AgentStub.findOne = sandbox.stub()
  AgentStub.findOne.withArgs(uuidArgs).returns(Promise.resolve(agentsFixteres.byUuid(uuid)))

  // Model findbyId Stup
  AgentStub.findById = sandbox.stub()
  AgentStub.findById.withArgs(id).returns(Promise.resolve(agentsFixteres.byId(id)))

  // Model findByUuid Stup
  AgentStub.findByUuid = sandbox.stub()
  AgentStub.findByUuid.withArgs(uuid).returns(Promise.resolve(agentsFixteres.byUuid(uuid)))

  // Model create Stub
  AgentStub.create = sandbox.stub()
  AgentStub.create.withArgs(newAgent).returns(Promise.resolve({
    toJSON () { return newAgent }
  }))

  // Model update Stub
  AgentStub.update = sandbox.stub()
  AgentStub.update.withArgs(single, uuidArgs).returns(Promise.resolve(single))

  // Model findAll
  AgentStub.findAll = sandbox.stub()
  AgentStub.findAll.withArgs().returns(Promise.resolve(agentsFixteres.all))
  AgentStub.findAll.withArgs(connectedArgs).returns(Promise.resolve(agentsFixteres.connected))
  AgentStub.findAll.withArgs(usernameArgs).returns(Promise.resolve(agentsFixteres.dario))

  const setupDatabase = proxyquire('../', {
    './models/agent': () => AgentStub,
    './models/metric': () => MetricStub
  })
  db = await setupDatabase(config)
})

test.afterEach(() => {
  if (sandbox) sandbox.restore()
})

// Existence test agent
test('Agent#Exist', t => {
  t.truthy(db.Agent, 'Agent service should exist')
})

// Test of setup Database
test.serial('Setup#of#database', t => {
  t.true(AgentStub.hasMany.called, 'AgentModel.hasMany was executed')
  t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument should be the Model')
  t.true(MetricStub.belongsTo.called, 'MetricStub.belongsTo was executed')
  t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument should be the Model')
})

// Test agent findById
test.serial('Agent#findById', async t => {
  let agent = await db.Agent.findById(id)

  t.true(AgentStub.findById.called, 'findbyId should be called on model')
  t.true(AgentStub.findById.calledOnce, 'finByid should be called once')
  t.true(AgentStub.findById.calledWith(id), 'findById should be called with specified id')

  t.deepEqual(agent, agentsFixteres.byId(id), 'Should be the same')
})

// Test of agent findByUuid
test.serial('agent#findByUuid', async t => {
  let agent = await db.Agent.findByUuid(uuid)

  t.true(AgentStub.findOne.called, 'findByUuid shouls be called on model')
  t.true(AgentStub.findOne.calledOnce, 'findByUuid should be called once')
  t.true(AgentStub.findOne.calledWith(uuidArgs), 'findByUuid should be called with spacified uuidArgs')

  t.deepEqual(agent, agentsFixteres.byUuid(uuid), 'Should be the same')
})

// Test of agent create new
test.serial('Agent#createOrUpdate - new', async t => {
  let agent = await db.Agent.createOrUpdate(newAgent)

  t.true(AgentStub.findOne.called, 'findOne should be called on model')
  t.true(AgentStub.findOne.calledOnce, 'findOne should e colled once')
  t.true(AgentStub.findOne.calledWith({
    where: { uuid: newAgent.uuid }
  }), 'fildOne should be called with uuid args')

  t.true(AgentStub.create.called, 'create should be called no model')
  t.true(AgentStub.create.calledOnce, 'create should be called coce')
  t.true(AgentStub.create.calledWith(newAgent), 'create should be called newAgent')

  t.deepEqual(agent, newAgent, 'agent should be ehr same')
})

// Test agent Agent createOrUpdate
test.serial('Agent#createOrUpdate - exists', async t => {
  const agent = await db.Agent.createOrUpdate(single)

  t.true(AgentStub.findOne.called, 'findOne should be called on model')
  t.true(AgentStub.findOne.calledTwice, 'findOne should be called twice')
  t.true(AgentStub.update.calledOnce, 'update should be called once')

  t.deepEqual(agent, single, 'agent should be the same')
})

// test findAll
test.serial('Agent#findAll', async t => {
  let agent = await db.Agent.findAll()

  t.true(AgentStub.findAll.called, 'FindAll should be called on model')
  t.true(AgentStub.findAll.calledOnce, 'fildAll should be called once')

  t.deepEqual(agent, agentsFixteres.all, 'agents should be the some all')
})

// Test of agent connected
test.serial('Agent#findConnected', async t => {
  let agent = await db.Agent.findConnected()

  t.true(AgentStub.findAll.called, 'FindAll should be called on model')
  t.true(AgentStub.findAll.calledOnce, 'fildAll should be called once')
  t.true(AgentStub.findAll.calledWith(connectedArgs), 'fildOne should be called with connedtedArgs')

  t.is(agent.length, agentsFixteres.connected.length, 'agents should be the model connected')
  t.deepEqual(agent, agentsFixteres.connected, 'agents shoulds be the same')
})

// Test of agent search for UserName
test.serial('Agent#findByUsername', async t => {
  let agent = await db.Agent.findByUsername('dario')

  t.true(AgentStub.findAll.called, 'FindAll should be called on model')
  t.true(AgentStub.findAll.calledOnce, 'fildAll should be called once')
  t.true(AgentStub.findAll.calledWith(usernameArgs), 'fildOne should be called with usernameArgs')

  t.is(agent.length, agentsFixteres.dario.length, 'agents should be the model connected')
  t.deepEqual(agent, agentsFixteres.dario, 'agents shoulds be the same')
})
