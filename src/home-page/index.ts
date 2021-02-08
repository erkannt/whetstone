import * as O from 'fp-ts/lib/Option'
import { constant, flow, pipe } from 'fp-ts/lib/function'
import { MyContext } from '../context'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { sequenceS } from 'fp-ts/lib/Apply'


// NAVBAR

type DisplayUser = {
  name: string,
  avatarUrl: string
}

const onlyLogin = '<a href="/login">Login<a>'

const onlyLogout = '<a href="/logout">Logout<a>'

const userAndLogout = (user: DisplayUser) => `
  <img src="${user.avatarUrl}">
  ${user.name}
  ${onlyLogout}
`

const fetchDisplayableUser = (id: string): TE.TaskEither<string, DisplayUser> => (
  TE.right(
    {
      name: 'no name',
      avatarUrl: 'bad url'
    }
  )
)

const navbar = (userId: O.Option<string>): Component => pipe(
  userId,
  TE.fromOption(constant(onlyLogin)),
  TE.chain(flow(
    fetchDisplayableUser,
    TE.mapLeft(constant(onlyLogout))
  )),
  TE.map(
    userAndLogout
  ),
  TE.fold(T.of, T.of)
)

// ORGS

const orgsList = `
  <h2>Your Orgs</h2>
  <ul>
    <li>foo</li>
  </ul>
`

const fetchOrgs = (id: string) => TE.right(
  ['foo']
)
const yourOrgs = (userId: O.Option<string>): Component => pipe(
  userId,
  TE.fromOption(constant('Log in to see your orgs')),
  TE.chainW(fetchOrgs),
  TE.bimap(
    constant('Sorry. I can\'t find your orgs'),
    constant(orgsList)
  ),
  TE.fold(T.of, T.of)
)

// MAIN

type Component = T.Task<string>

export const homepage = (ctx: MyContext): T.Task<string> => pipe(
  ctx.state.user,
  O.fromNullable,
  (u) => ({
    navbar: navbar(u),
    orgs: yourOrgs(u)
  }),
  sequenceS(T.task),
  T.map(
    (m) => `
        <h1>Whetstone</h1>
        ${m.navbar}
        <main>
          ${m.orgs}
        </main>
        `,
  )
)
