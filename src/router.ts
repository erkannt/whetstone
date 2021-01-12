import Router from '@koa/router'
import { pageHandler } from './page-handler'
import { homepage } from './home-page'

export const router = (): Router => {
    const router = new Router()

    router.get('/',
        pageHandler(homepage))

    return router

}