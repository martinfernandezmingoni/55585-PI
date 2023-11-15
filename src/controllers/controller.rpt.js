import fs from 'fs'
import {Router} from 'express'

const router = Router()

let id = 0
const path = './files/products.json'
const format = 'utf-8'

async function generateId() {
  try {
    const data =  await fs.promises.readFile(path, format)
    const producst = JSON.parse(data)

    if(producst.length > 0) {
      id = Math.max(...producst.map(p => p.id))
    }
    return producst
  } catch (error) {
    console.log(error)
    return[]
  }
}

router.get('/', async (req, res) => {
  try {
    const data = await fs.promises.readFile(path, format)
    const products = JSON.parse(data)

    res.render('realTimeProducts', { products })
  } catch (error) {
    console.log(error)
    res.status(500).json({error: 'Error al obtener los productos'})
  }
})

router.post('/', async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } = req.body

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' })
    }

    const products = await generateId()

    const codeExists = products.some(product => product.code === code);
    if (codeExists) {
      return res.status(400).json({ error: 'El código de producto ya existe' });
    }
    
    const newProduct = {
      id: id + 1 ,
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: thumbnails || []
    }

    products.push(newProduct)

    await fs.promises.writeFile(path, JSON.stringify(products, null, 2), format)

    id = newProduct.id
    const {io} = req

    io.emit('newProduct', newProduct)
    io.emit('message', `Producto ${newProduct.id} creado con éxito`)

    res.status(201).json(newProduct)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al agregar el producto' })
  }
})

router.delete('/:id', async (req,res) => {
  try {
    const {params: {id}, io} = req
    const data = await fs.promises.readFile(path, format)
    const producst = JSON.parse(data)

    const updatedProducts = producst.filter(p => p.id !== id)

    await fs.promises.writeFile(path, JSON.stringify(updatedProducts, null, 2), format)

    io.emit('deleteProduct', id)
    io.emit('message', `Producto ${id} eliminado con éxito`)

    res.status(200).json({message: 'Producto eliminado correctamente'})
  } catch (error) {
    console.log("the error", error)
    res.status(500).json({error:'Error al eliminar producto'})
  }
})

export default router