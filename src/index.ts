import Koa, { Middleware } from 'koa';
import { router } from './router';

const app = new Koa()

app.use(router().middleware())

app.listen(8080)
