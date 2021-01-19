import { DefaultContext, DefaultState, ParameterizedContext } from 'koa';

export type MyContext = ParameterizedContext<DefaultState, DefaultContext>