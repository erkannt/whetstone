import Koa from 'koa';
import { router } from './router';
import koaSession from 'koa-session';
import koaPassport from 'koa-passport';
import {Strategy as GitHubStrategy} from 'passport-github2';
import dotenv from 'dotenv';

dotenv.config()

const app = new Koa()
app.keys = ['something-secret']

koaPassport
  .serializeUser((user, done) => done(null, user))
koaPassport
  .deserializeUser((obj: undefined, done) => done(null, obj))
koaPassport
  .use(new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID ?? 'my-key',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? 'my-secret',
      callbackURL: "http://localhost:8080/auth/github/callback"
    },
    (_accessToken: any, _refreshToken: any, profile: any, done: any) => { return done(null, profile.id) }
    )
  );

app
  .use(koaSession({}, app))
  .use(koaPassport.initialize())
  .use(koaPassport.session())
  .use(router().middleware())

app.listen(8080)
