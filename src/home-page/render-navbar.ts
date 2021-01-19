import * as O from 'fp-ts/lib/Option'
import { constant, pipe } from 'fp-ts/lib/function'

const authLink = (user: O.Option<string>): string => pipe(
  user,
  O.fold(
    constant('<a href="/login">Login<a>'),
    constant('<a href="/logout">Logout<a>')
  )
)

const currentUserDisplay = (user: O.Option<string>): string => pipe(
  user,
  O.fold(
    constant(''),
    (u) => `${u}`,
  )
)

type ViewModel = {
  login: string,
  username: string,
}

export const renderNavbar = (user: O.Option<string>): string => pipe(
  {
    login: authLink(user),
    username: currentUserDisplay(user),
  },
  (c: ViewModel) => `
      <nav>
        ${c.username}
        ${c.login}
      </nav
        `
)
