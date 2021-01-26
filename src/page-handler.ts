import { Middleware } from 'koa'
import { MyContext } from './context'
import * as T from 'fp-ts/lib/Task'

type Page = (context: MyContext) => T.Task<string>

export const pageHandler = (renderPage: Page): Middleware => async (context) => {
  context.body = await renderPage(context)()
  context.status = 200
}
