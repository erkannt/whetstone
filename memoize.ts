import { httpGet } from './src/infra/http-get'
import * as IO from 'fp-ts/IO'
import * as O from 'fp-ts/Option'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import { pipe } from 'fp-ts/function'

export function memoize<A>(ma: (key: string) => IO.IO<A>): (key: string) => IO.IO<A> {
  const cache: Record<string, A> = {}
  const addToCache = (key: string) => () => {
    cache[key] = ma(key)()
    return cache[key]
  }

  return (key: string) => pipe(
    cache[key],
    O.fromNullable,
    O.getOrElse(addToCache(key)),
    IO.of,
  )
}

const ping = (msg: string) => pipe(
  httpGet('http://localhost:8080/breakingping'),
  TE.map(() => `${msg}: ok`),
  TE.mapLeft(() => `${msg}: failed`),
)

const render = (model: TE.TaskEither<string, string>): T.Task<string> => pipe(
  model,
  TE.fold(
    (e) => T.of(e),
    (a) => T.of(a),
  )
)

const multiFoo = pipe(
  T.Do,
  T.apS('a', pipe(ping('foo'), render)),
  T.apS('b', pipe(ping('foo'), render)),
)


const pingM = memoize(ping)

const multiFooM = pipe(
  T.Do,
  T.apS('a', pipe(pingM('foo'), render)),
  T.apS('b', pipe(pingM('foo'), render)),
  T.apS('c', pipe(pingM('foo'), render)),
)

const multiFooM2 = pipe(
  T.Do,
  T.apS('a', pipe(pingM('foo'), render)),
  T.apS('b', pipe(pingM('foo'), render)),
  T.apS('c', pipe(pingM('foo'), render)),
)


void (async (): Promise<void> => {
  console.time('plain')
  console.timeLog('plain', await multiFoo())
  console.time('memoized')
  console.timeLog('memoized', await multiFooM())
  console.time('memoized2')
  console.timeLog('memoized2', await multiFooM2())
})()
