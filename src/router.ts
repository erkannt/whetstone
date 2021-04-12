import Router from '@koa/router'
import { pageHandler } from './page-handler'
import { homepage } from './home-page'
import koaPassport from 'koa-passport'
import { Context, DefaultState } from 'koa'

export const router = (): Router<DefaultState, Context> => {
  const router = new Router<DefaultState, Context>()

  router.get('/',
    pageHandler(homepage))

  router.get('/login',
    koaPassport.authenticate('github')
  )

  router.get('/logout',
    async (context, next) => {
      context.logout()
      context.redirect('back')
      await next()
    }
  )

  router.get('/auth/github/callback',
    koaPassport.authenticate('github', {failureRedirect: '/login'}),
    async (context, next) => {
      context.redirect('/')
      await next()
    }
  )

  let broken = false
  router.get('/breakingping',
    async (context, next) => {
      if (broken) {
        console.log('404')
        context.status = 404
        broken = false
      } else {
        broken = true
        console.log('pong')
        context.body = 'pong'
        context.status = 200
      }
      await next()
    }
  )

  return router

}