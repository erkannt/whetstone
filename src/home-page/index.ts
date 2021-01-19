import * as O from 'fp-ts/lib/Option'
import { constant, pipe } from 'fp-ts/lib/function'
import { MyContext } from '../context'
import { cons } from 'fp-ts/lib/ReadonlyArray'

const renderNavbar = (user: O.Option<string>): string => {
  type ViewModel = {
    login: string,
    username: string,
  }

  return pipe(
    user,
    (u) => (
      {
        login: pipe(u,
          O.fold(
            constant('<a href="/login">Login<a>'),
            constant('<a href="/logout">Logout<a>')
          )
        ),
        username: pipe(u,
          O.fold(
            constant(''),
            (u) => `${u}`,
          )
        )
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
