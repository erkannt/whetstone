import * as A from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/pipeable'
export const logInCallToAction = 'Log in to see your orgs'

export const errorMsg = 'Sorry. I can\'t find your orgs'

const toList = (list: Array<string>): string => pipe(
  list,
  A.map((l) => `<li>${l}</li>`),
  A.reduce('', (b, a) => `${b}\n${a}`),
  (l) => `
  <ul>
    ${l}
  </ul>
  `
)

export const orgsList = (orgs: Array<string>): string => `
  <h2>Your Orgs</h2>
  ${toList(orgs)}
`
