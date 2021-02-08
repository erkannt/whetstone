import * as O from 'fp-ts/lib/Option'
import { constant, pipe } from 'fp-ts/lib/function'
import { MyContext } from '../context'
import { renderLogin } from './render-login'
import { renderUser } from './render-user'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import { sequenceS } from 'fp-ts/lib/Apply'
import axios, { AxiosResponse } from 'axios'

const httpGet = (url: string) => TE.tryCatch<Error, AxiosResponse>(
  () => axios.get(url),
  reason => new Error(String(reason))
)

const fetchUsername = (id: string): TE.TaskEither<Error, string> => pipe(
  httpGet(`https://api.github.com/user/${id}`),
  TE.map((r) => r.data),
  TE.map((d) => d.login)
)

const constructUser = (id: string): TE.TaskEither<string, User> => pipe(
  {
    id: TE.right(id),
    name: fetchUsername(id)
  },
  sequenceS(TE.taskEither),
  TE.mapLeft(constant('cant-determine-username'))
)

const userFromContext = (ctx: MyContext): TE.TaskEither<string, User> => pipe(
  O.fromNullable(ctx.state.user),
  TE.fromOption(constant('not-logged-in')),
  TE.chain(constructUser)
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
