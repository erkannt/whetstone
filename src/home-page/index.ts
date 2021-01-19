import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { MyContext } from '../context'

const renderLogin = (user: O.Option<string>): string => (
    pipe(
        user,
        O.fold(
            () => '<a href="/login">Login<a>',
            (_) => '<a href="/logout">Logout<a>',
        )
    )
)

export const homepage = (ctx: MyContext): string => (
    pipe(
        O.fromNullable(ctx.state.user),
        renderLogin,
        (body) => `
            <h1>Whetstone</h1>
            ${body}
            ${JSON.stringify(ctx.state.user, null, 2)}
            `
    )
)
