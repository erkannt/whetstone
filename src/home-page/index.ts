import * as O from 'fp-ts/lib/Option'
import { constant, flow, pipe } from 'fp-ts/lib/function'
import { MyContext } from '../context'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import * as A from 'fp-ts/lib/Array'
import { sequenceS } from 'fp-ts/lib/Apply'
import axios, { AxiosResponse } from 'axios'

// MISC

const httpGet = (url: string) => TE.tryCatch<Error, AxiosResponse>(
  () => axios.get(url),
  reason => new Error(String(reason))
)

// MODEL

type User = {
  id: string,
  name: string
}

type Homepage = {
  user: E.Either<string, User>,
  orgs: Array<string>
}

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


// VIEW

const renderLogin = (user: E.Either<unknown, unknown>): string => pipe(
  user,
  E.fold(
    constant('<a href="/login">Login<a>'),
    constant('<a href="/logout">Logout<a>')
  )
)

const renderUser = (user: E.Either<string, User>): string => pipe(
  user,
  E.fold(
    constant(''),
    ((u) => (`
      <img src="https://avatars.githubusercontent.com/u/${u.id}?s=100">
      ${u.name}
    `))
  )
)

const renderOrgs = (orgs: Array<string>): string => `
  <ul>
    ${A.map((o) => `<li>${o}</li>`)(orgs)}
  </ul>
`

// MAIN

export const homepage = (ctx: MyContext): T.Task<string> => (
  pipe(
    {
      user: userFromContext(ctx),
      orgs: T.of(['foobar'])
    },
    sequenceS(T.task),
    T.map(
      (m: Homepage) => `
        <h1>Whetstone</h1>
        ${renderUser(m.user)}
        ${renderLogin(m.user)}
        <main>
          <h2>Your orgs</h2>
          ${renderOrgs(m.orgs)}
        </main>
        `,
    )
  )
)
