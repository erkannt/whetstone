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
    constant(`
      <img src="https://avatars.githubusercontent.com/u/19282025?s=100">
      erkannt
    `)
  )
)

type Fragments = {
  login: string,
  user: string
}

export type Navbar = {
  user: O.Option<string>
}

export const renderNavbar = (model: Navbar): string => pipe(
  {
    login: authLink(model.user),
    user: currentUserDisplay(model.user),
  },
  (e: Fragments) => `
      <nav>
        ${e.user}
        ${e.login}
      </nav
        `
)
