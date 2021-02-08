import axios, { AxiosResponse } from 'axios'
import * as TE from 'fp-ts/lib/TaskEither'

export const httpGet = (url: string): TE.TaskEither<Error, AxiosResponse> => TE.tryCatch(
  () => axios.get(url),
  reason => new Error(String(reason))
)
