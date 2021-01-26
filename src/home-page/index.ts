import * as O from 'fp-ts/lib/Option'
import { constant, pipe } from 'fp-ts/lib/function'
import { MyContext } from '../context'

const loggedInUser = (ctx: MyContext): O.Option<string> => (
  O.fromNullable(ctx.state.user)
)

const renderLoginToggle = (user: O.Option<unknown>): string => pipe(
  user,
  O.fold(
    constant('<a href="/login">Login<a>'),
    constant('<a href="/logout">Logout<a>')
  )
)

type Homepage = {
  user: string
  loginToggle: string
}

export const homepage = (ctx: MyContext): string => (
  pipe(
    {
      user: 'erkannt',
      loginToggle: pipe(ctx, loggedInUser, renderLoginToggle)
    },
    (e: Homepage) => `
      <h1>Whetstone</h1>
      ${e.user}
      ${e.loginToggle}
      `
  )
)
