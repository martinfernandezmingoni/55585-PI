const socket = io()

socket.on('mensajeServidor', message => {
  console.log(message)
})

socket.emit('mesanjeCliente', 'Hola desde el cliente')