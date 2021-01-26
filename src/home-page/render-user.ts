import * as O from 'fp-ts/lib/Option'
import { constant, pipe } from 'fp-ts/lib/function'

type User = {
  id: string,
  name: string,
}

export const renderUser = (user: O.Option<User>): string => pipe(
  user,
  O.fold(
    constant(''),
    ((u) => (`
      <img src="https://avatars.githubusercontent.com/u/${u.id}?s=100">
      ${u.name}
    `))
  )
)
