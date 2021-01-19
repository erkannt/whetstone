import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { MyContext } from '../context'

const renderNavbar = (user: O.Option<string>): string => {
    type ViewModel = {
        login: string,
        username: string,
    }

    return pipe(
        user,
        (u) => (
            {
                login: O.fold(
                    () => '<a href="/login">Login<a>',
                    (_) => '<a href="/logout">Logout<a>'
                )(u),
                username: O.fold(
                    () => '',
                    (u) => `${u}`,
                )(u)
            }
        ),
        (c: ViewModel) => `
            <nav>
                ${c.username}
                ${c.login}
            </nav
        `
    )
}

export const homepage = (ctx: MyContext): string => (
    pipe(
        O.fromNullable(ctx.state.user),
        renderNavbar,
        (navbar) => `
            <h1>Whetstone</h1>
            ${navbar}
            `
    )
)
