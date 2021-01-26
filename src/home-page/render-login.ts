import { constant, pipe } from 'fp-ts/lib/function'
import * as E from 'fp-ts/lib/Either'

export const renderLogin = (user: E.Either<unknown, unknown>): string => pipe(
  user,
  E.fold(
    constant('<a href="/login">Login<a>'),
    constant('<a href="/logout">Logout<a>')
  )
)