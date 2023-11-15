import productsController from '../controllers/controller.products.js'
import rptController from '../controllers/controller.rpt.js'
import homeController from '../controllers/controller.home.js'

const router = app => { 
  app.use('/api/products', productsController)
  app.use('/api/home', homeController)
  app.use('/api/realtimeproducts', rptController)
}

export default router