import express from 'express'
const router = express.Router()
import { userController } from '../controller/users'

const userManager = new userController()




router.post('/signup', userManager.signup)
router.post('/login', userManager.login)

export default router