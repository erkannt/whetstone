import Koa, { Middleware } from 'koa';
import Router from '@koa/router'

type Page = () => string

const homepage: Page = () => `
    <h1>Whetstone</h1>
    <a href="/login">Login<a>
`;

const pageHandler = (renderPage: Page): Middleware => (context) => {
    context.body = renderPage()
    context.status = 200
}

const router = new Router()

router.get('/',
    pageHandler(homepage))

const app = new Koa()

app.use(router.middleware())

app.listen(8080)
