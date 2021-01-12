import Koa from 'koa';

const mainContent = `
    <h1>Whetstone</h1>
    <a href="/login">Login<a>
`;
const app = new Koa()

app.use(async context => {
    context.body = mainContent;
})

app.listen(8080);
