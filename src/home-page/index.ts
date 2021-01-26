import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { MyContext } from '../context'
import { renderLogin } from './render-login'
import { renderUser } from './render-user'

const userFromContext = (ctx: MyContext): O.Option<User> => pipe(
  O.fromNullable(ctx.state.user),
  O.map(
    (u) => ({
      id: u,
      name: 'erkannt',
    }))
)

type User = {
  id: string,
  name: string
}

type Homepage = {
  loggedInUser: O.Option<User>
}

export const homepage = (ctx: MyContext): string => (
  pipe(
    {
      loggedInUser: userFromContext(ctx)
    },
    (m: Homepage) => `
      <h1>Whetstone</h1>
      ${renderUser(m.loggedInUser)}
      ${renderLogin(m.loggedInUser)}
      `
  )
)
