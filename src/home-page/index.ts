import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { MyContext } from '../context'
import { Navbar, renderNavbar } from './render-navbar'

const navbarModel = (ctx: MyContext): Navbar => (
  {
    user: O.fromNullable(ctx.state.user)
  }
)

type Elements = {
  navbar: string
}

export const homepage = (ctx: MyContext): string => (
  pipe(
    {
      navbar: pipe(ctx, navbarModel, renderNavbar)
    },
    (e: Elements) => `
      <h1>Whetstone</h1>
      ${e.navbar}
      `
  )
)
