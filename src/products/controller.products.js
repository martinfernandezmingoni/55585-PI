const fs = require('fs')
const { Router } = require('express')
const uploader = require('../utils/multer.utils')
const ProductManager = require('../dao/ProductsManager.dao')
const ProductsDao = require('../dao/Products.dao')

const router = Router()
const productManager = new ProductManager()
const Products = new ProductsDao()

router.get('/loadItems', async (req,res) =>{
  try {
    const products = await productManager.loadItems()

    const newProducts = await Products.createMany(products)

    res.json({message: newProducts})
  } catch (error) {
    res.json({error})
  }
})

router.get('/',async (req,res) =>{
  try {
    const products = await Products.findAll()
    res.json({message: products})
  } catch (error) {
    res.json({error})
  }
})

router.post('/', uploader.single('file'),  async(req, res) => {
  try {
    const {title,description,price, code, stock} = req.body
    const newProductInfo = {
      title,
      description,
      price,
      thumbnail: req.file.filename,
      code,
      stock
    }
    const newProduct = await Products.create(newProductInfo)
    res.json({message: newProduct})
    
  } catch (error) {
    return error
  }
})

router.delete('/deleteAll' , async (req,res) =>{
  await Products.deleteAll()
  res.json({message : 'Deleted All'})
  
})

module.exports = router