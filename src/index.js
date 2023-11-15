import express from 'express'
import handlebars from 'express-handlebars'
import { Server} from 'socket.io'
import router from './routes/index.js'
import http from 'http'
import __dirname from './utils.js'

const app = express()
const PORT = 8080

const httpServer = http.Server(app)
const io = new Server(httpServer)

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'))

app.use('/', (req, res, next) => {
  req.io = io
  next()
})

router(app)

app.engine('handlebars', handlebars.engine())
app.set('views', './views')
app.set('view engine', 'handlebars')

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

io.on('connection', socket => {
  console.log('Cliente conectado:', socket.id)

  socket.on('mensajeCliente', message => {
    console.log('Mensaje del cliente:', message)
  })
})