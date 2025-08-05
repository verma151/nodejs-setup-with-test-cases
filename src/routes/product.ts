import express from 'express'
const router = express.Router()
import { productController } from '../controller/product'
import { Auth } from '../middleware/auth'

const productManager = new productController()

router.use(Auth)

router.get('/', productManager.getProducts)
router.get('/:id', productManager.getProduct)
router.post('/', productManager.createProduct)
router.put('/:id', productManager.updateProduct)
router.delete('/:id', productManager.deleteProduct)

export default router