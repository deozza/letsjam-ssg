import type { Context, Middleware } from '@nuxt/types'

declare module '@nuxt/types' {
  interface Context {
    authenticated?: string
  }
}

const authenticatedMiddleware: Middleware = (context: Context) => {
  if(!context.store.getters['user/isLoggedIn']){
    return context.redirect('/login')
  }
}

export default authenticatedMiddleware
