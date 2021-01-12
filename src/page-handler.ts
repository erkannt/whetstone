import { Middleware } from 'koa'

type Page = () => string

export const pageHandler = (renderPage: Page): Middleware => (context) => {
    context.body = renderPage()
    context.status = 200
}
