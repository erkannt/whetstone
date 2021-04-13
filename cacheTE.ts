import { httpGet } from './src/infra/http-get'
import * as O from 'fp-ts/Option'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import * as T from 'fp-ts/Task'
import { pipe } from 'fp-ts/function'
import { sequenceS } from 'fp-ts/lib/Apply'

export function cacheTaskEither<E, A>(ma: (key: string) => TE.TaskEither<E, A>): (key: string) =>  TE.TaskEither<E, A> {
  const cache: Record<string, A> = {}

  const cacheAndPassOn = (key: string) => (value: A) => {
    cache[key] = value
    return value
  }

  const fetchAndCacheIfSuccessful = (key: string) => async () => pipe(
    await ma(key)(),
    E.map(cacheAndPassOn(key))
  )

  return (key: string) => () => pipe(
    cache[key],
    O.fromNullable,
    O.fold(
      fetchAndCacheIfSuccessful(key),
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
  {
    a: pipe(ping('foo'), render),
    b: pipe(ping('foo'), render),
  },
  sequenceS(T.task)
)

const pingC = cacheTaskEither(ping)

const cached = pipe(
  {
    a: pipe(pingC('foo'), render),
    b: pipe(pingC('foo'), render),
    c: pipe(pingC('foo'), render),
    d: pipe(pingC('foo'), render),
    e: pipe(pingC('foo'), render),
    f: pipe(pingC('foo'), render),
  },
  sequenceS(T.task)
)

void (async (): Promise<void> => {
  console.time('plain')
  console.timeLog('plain', await vanilla())
  console.time('cached1')
  console.timeLog('cached1', await cached())
  console.time('cached2')
  console.timeLog('cached2', await cached())
})()
