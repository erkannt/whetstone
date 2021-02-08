import * as O from 'fp-ts/lib/Option'
import { constant, flow, pipe } from 'fp-ts/lib/function'
import { MyContext } from '../context'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { sequenceS } from 'fp-ts/lib/Apply'
import { DisplayUser, onlyLogin, onlyLogout, userAndLogout } from './render-navbar'
import { errorMsg, logInCallToAction, orgsList } from './render-orgs'


// NAVBAR

const fetchDisplayableUser = (id: string): TE.TaskEither<string, DisplayUser> => (
  TE.right(
    {
      name: 'erkannt',
      avatarUrl: 'https://avatars.githubusercontent.com/u/19282025?v=4'
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

const fetchOrgs = (id: string) => TE.right(
  ['sciety', 'elife']
)

const yourOrgs = (userId: O.Option<string>): Component => pipe(
  userId,
  TE.fromOption(() => logInCallToAction),
  TE.chain(flow(
    fetchOrgs,
    TE.mapLeft(() => errorMsg)
  )),
  TE.map(orgsList),
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
