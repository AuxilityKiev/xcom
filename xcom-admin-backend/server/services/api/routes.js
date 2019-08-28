import Router from 'koa-router'
import AuthRoutes from './auth/routes'
import BannerRoutes from './banner/routes'
import BlockRoutes from './block/routes'

const router = new Router()

AuthRoutes.init(router)
BannerRoutes.init(router)
BlockRoutes.init(router)

router.get('/admin-api/', async (ctx) => {
  ctx.body = {
    status: 'available',
    message: 'api@xcom-2018',
  }
})

export default router
