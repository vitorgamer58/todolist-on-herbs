const { Ok, Err, usecase, step } = require('buchu')
const { TodoList } = require('../entities/todoList')

const dependency = {
  ListRepository: require('../../infra/repositories/listRepository'),
}

module.exports.createList = injection =>
  usecase('Create List', {
    request: { name: String },

    response: TodoList,

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    authorize: user => (user.canCreateList ? Ok() : Err()),

    'Create list': step(
      ctx =>
      (ctx.list = TodoList.fromJSON({
        id: Math.floor(Math.random() * 100000),
        name: ctx.req.name,
      }))
    ),

    'Check if it is valid list': step(ctx =>
      ctx.list.isValid() ? Ok() : Err(ctx.list.errors)
    ),

    'Save list': step(async ctx => {
      const listRepo = new ctx.di.ListRepository(injection)
      return (ctx.ret = await listRepo.save(ctx.list))
    }),
  })
