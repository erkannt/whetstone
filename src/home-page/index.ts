import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { MyContext } from '../context'
import { renderNavbar } from './render-navbar'

export const homepage = (ctx: MyContext): string => (
  pipe(
    O.fromNullable(ctx.state.user),
    renderNavbar,
    (navbar) => `
      <h1>Whetstone</h1>
      ${navbar}
      `
  )
)
