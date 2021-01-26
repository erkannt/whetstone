import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { MyContext } from '../context'
import { renderLogin } from './render-login'

const loggedInUser = (ctx: MyContext): O.Option<string> => (
  O.fromNullable(ctx.state.user)
)


type Homepage = {
  user: string
  loginToggle: string
}

export const homepage = (ctx: MyContext): string => (
  pipe(
    {
      user: 'erkannt',
      loginToggle: pipe(ctx, loggedInUser, renderLogin)
    },
    (e: Homepage) => `
      <h1>Whetstone</h1>
      ${e.user}
      ${e.loginToggle}
      `
  )
)
