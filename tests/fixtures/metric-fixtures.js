'use strict'

const agentFixture = require('./agent-fixturer')

const metric = {
  id: 1,
  type: 'CPU',
  value: '18%',
  createAt: new Date(),
  agentId: agentFixture.byId(1)
}

const metrics = [
  metric,
  extend(metric, {id: 2, type: 'MEMORY', value: '253Mb'}),
  extend(metric, {id: 3, type: 'RAM', value: '100Mb'}),
  extend(metric, {id: 4, type: 'CPU', value: '35%', agentId: agentFixture.byId(2)}),
  extend(metric, {id: 5, type: 'RAM', value: '500Mb', agentId: agentFixture.byId(2)}),
  extend(metric, {id: 6, type: 'CPU', value: '33%', agentId: agentFixture.byId(3)})
]

function extend (obj, values) {
  const clone = Object.assign({}, obj)
  return Object.assign(clone, values)
}

function findMetricForUuid (uuid) {
  const actualMetric = metrics.filter(m => m.agentId === agentFixture.byUuid(uuid))

  return actualMetric.map(ma => {
    const clon = Object.assign({}, ma)
    clon.agentId = clon.agentId.id
    return clon
  })
}

function findTypeAgentUuid (type, uuid) {
  const actualMetric = metrics.filter(m => m.type === type && m.agentId === agentFixture.byUuid(uuid))

  return actualMetric.map(ma => {
    const clon = Object.assign({}, ma)
    clon.agentId = clon.agentId.id
    return clon
  })
}

module.exports = {
  single: metric,
  all: metrics,
  findMetricForUuid,
  findTypeAgentUuid
}