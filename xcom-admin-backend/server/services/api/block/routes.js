import block from './controller'
import auth from '../auth/controller'

export default {
  init: function (router) {
    router.get('/admin-api/block', block.getBlocks),
    router.get('/admin-api/block/:id', auth.userGuard, block.getBlock),
    router.post('/admin-api/block', auth.userGuard, block.createBlock),
    router.put('/admin-api/block/:id', auth.userGuard, block.updateBlock),
    router.delete('/admin-api/block/:id', auth.userGuard, block.deleteBlock)
  }
}
