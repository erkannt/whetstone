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

export const homepage = (_: MyContext): string => (
    pipe(
        O.none,
        renderLogin,
        (body) => `
            <h1>Whetstone</h1>
            ${body}
            `
    )
)
