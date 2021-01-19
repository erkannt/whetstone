import { Middleware } from 'koa'
import { MyContext } from './context'

type Page = (context: MyContext) => string

export const pageHandler = (renderPage: Page): Middleware => (context) => {
  context.body = renderPage(context)
  context.status = 200
}
