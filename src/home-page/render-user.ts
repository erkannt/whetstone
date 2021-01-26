import * as E from 'fp-ts/lib/Either'
import { constant, pipe } from 'fp-ts/lib/function'

type User = {
  id: string,
  name: string,
}

export const renderUser = (user: E.Either<string, User>): string => pipe(
  user,
  E.fold(
    constant(''),
    ((u) => (`
      <img src="https://avatars.githubusercontent.com/u/${u.id}?s=100">
      ${u.name}
    `))
  )
)
