import { Context, Middleware } from 'koa'

type Page = (context: Context) => string

export const pageHandler = (renderPage: Page): Middleware => (context) => {
    context.body = renderPage(context)
    context.status = 200
}
