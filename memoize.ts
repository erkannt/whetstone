import { httpGet } from './src/infra/http-get'
import * as O from 'fp-ts/Option'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import * as T from 'fp-ts/Task'
import { pipe } from 'fp-ts/function'

export function cacheTaskEither<E, A>(ma: (key: string) => TE.TaskEither<E, A>): (key: string) =>  TE.TaskEither<E, A> {
  const cache: Record<string, A> = {}

  const passthroughCache = (key: string) => (value: A) => {
    cache[key] = value
    return value
  }

  const fetchAndCacheIfRight = (key: string) => async () => {
    const result = await ma(key)()
    return pipe(
      result,
      E.map(passthroughCache(key))
    )
  }

  return (key: string) => () => pipe(
    cache[key],
    O.fromNullable,
    O.fold(
      fetchAndCacheIfRight(key),
      async (a) => E.right(a)
    )
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

const vanilla = pipe(
  T.Do,
  T.apS('a', pipe(ping('foo'), render)),
  T.apS('b', pipe(ping('foo'), render)),
)

const pingC = cacheTaskEither(ping)

const cached = pipe(
  T.Do,
  T.apS('a', pipe(pingC('foo'), render)),
  T.apS('b', pipe(pingC('foo'), render)),
  T.apS('c', pipe(pingC('foo'), render)),
)

void (async (): Promise<void> => {
  console.time('plain')
  console.timeLog('plain', await vanilla())
  console.time('cached1')
  console.timeLog('cached1', await cached())
  console.time('cached2')
  console.timeLog('cached2', await cached())
})()
