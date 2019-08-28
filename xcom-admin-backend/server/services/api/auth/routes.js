import auth from './controller'

export default {
  init: function (router) {
    router.post('/admin-api/auth', auth.auth)
  }
}
