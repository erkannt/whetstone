import * as O from 'fp-ts/lib/Option'
import { constant, pipe } from 'fp-ts/lib/function'
import { MyContext } from '../context'
import { renderLogin } from './render-login'
import { renderUser } from './render-user'
import * as T from 'fp-ts/lib/Task'
import * as E from 'fp-ts/lib/Either'


const userFromContext = (ctx: MyContext): E.Either<string, User> => pipe(
  O.fromNullable(ctx.state.user),
  E.fromOption(constant('not-logged-in')),
  E.map(
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
  user: E.Either<string, User>
}

export const homepage = (ctx: MyContext): T.Task<string> => (
  pipe(
    {
      user: userFromContext(ctx)
    },
    (m: Homepage) => `
      <h1>Whetstone</h1>
      ${renderUser(m.user)}
      ${renderLogin(m.user)}
      `,
    T.of,
  )
)
