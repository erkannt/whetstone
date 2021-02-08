export const onlyLogin = '<a href="/login">Login<a>'

export const onlyLogout = '<a href="/logout">Logout<a>'

export type DisplayUser = {
  name: string,
  avatarUrl: string
}

export const userAndLogout = (user: DisplayUser):string => `
  <img src="${user.avatarUrl}" style="height:50px; width:50px">
  ${user.name}
  ${onlyLogout}
`
