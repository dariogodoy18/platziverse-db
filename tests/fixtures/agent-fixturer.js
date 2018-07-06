'use strict'

const agent = {
  id: 1,
  uuid: 'yyy-yyy-yyy',
  name: 'fixture',
  username: 'dario',
  hostname: 'test-host',
  pid: 0,
  connected: true,
  createAt: new Date(),
  updateAt: new Date()
}

const agents = [
  agent,
  extend(agent, {id: 2, uuid: 'yyy-yyy-yyw', connected: false, name: 'test'}),
  extend(agent, {id: 3, uuid: 'yyy-yyy-yyk', connected: false, username: 'redoc', hostname: 'redoc-host'}),
  extend(agent, {id: 4, uuid: 'yyy-yyg-yyy'}),
  extend(agent, {id: 5, uuid: 'yyy-yyl-yyy', username: 'test'})
]

function extend (obj, values) {
  const clone = Object.assign({}, obj)
  return Object.assign(clone, values)
}

module.exports = {
  single: agent,
  all: agents,
  connected: agents.filter(a => a.connected),
  dario: agents.filter(a => a.username === 'dario'),
  byUuid: id => agents.filter(a => a.uuid === id).shift(),
  byId: id => agents.filter(a => a.id === id).shift()
}
