import * as O from 'fp-ts/lib/Option'
import { constant, pipe } from 'fp-ts/lib/function'
import { MyContext } from '../context'
import { renderLogin } from './render-login'
import { renderUser } from './render-user'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import { sequenceS } from 'fp-ts/lib/Apply'


const userFromContext = (ctx: MyContext): TE.TaskEither<string, User> => pipe(
  O.fromNullable(ctx.state.user),
  TE.fromOption(constant('not-logged-in')),
  TE.map(
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
    sequenceS(T.task),
    T.map(
      (m: Homepage) => `
        <h1>Whetstone</h1>
        ${renderUser(m.user)}
        ${renderLogin(m.user)}
        `,
    )
  )
)
