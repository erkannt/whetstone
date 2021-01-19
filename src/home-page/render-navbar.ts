import * as O from 'fp-ts/lib/Option'
import { constant, pipe } from 'fp-ts/lib/function'

type ViewModel = {
  login: string,
  username: string,
}

export const renderNavbar = (user: O.Option<string>): string => pipe(
  user,
  (u) => (
    {
      login: pipe(u,
        O.fold(
          constant('<a href="/login">Login<a>'),
          constant('<a href="/logout">Logout<a>')
        )
      ),
      username: pipe(u,
        O.fold(
          constant(''),
          (u) => `${u}`,
        )
      )
    }
  ),
  (c: ViewModel) => `
      <nav>
        ${c.username}
        ${c.login}
      </nav
        `
)
