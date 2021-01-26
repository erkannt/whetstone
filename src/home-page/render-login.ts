import { constant, pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'

export const renderLogin = (user: O.Option<unknown>): string => pipe(
  user,
  O.fold(
    constant('<a href="/login">Login<a>'),
    constant('<a href="/logout">Logout<a>')
  )
)