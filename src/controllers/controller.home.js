import fs from 'fs'
import {Router} from 'express'

const router = Router()

router.get('/', async (req,res) => {
  const data = await fs.promises.readFile('./files/products.json')
  const products = JSON.parse(data)
  
  res.render( 'home', {products})
})

export default router