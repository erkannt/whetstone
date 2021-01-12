import { Context } from 'koa'

const renderMain = (): string => `
    <h1>Whetstone</h1>
    <a href="/login">Login<a>
`

export const homepage = (_: Context): string => (
    renderMain()
)
