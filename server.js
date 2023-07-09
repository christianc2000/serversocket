const WebSocket = require('ws');

// Creamos un nuevo servidor WebSocket
const wss = new WebSocket.Server({ port: 8080 });

// Almacenamos las conexiones de los clientes
const clients = new Set();

// Función para enviar un mensaje a todos los clientes conectados
const broadcast = (message) => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

// Evento que se ejecuta cuando un cliente se conecta al servidor WebSocket
wss.on('connection', (ws) => {
  // Agregamos el cliente a la lista de clientes conectados
  console.log("cliente agregado correctamente...");
  clients.add(ws);

  // Evento que se ejecuta cuando se recibe un mensaje del cliente
  ws.on('message', (message) => {
    // Enviamos el mensaje a todos los demás clientes conectados
    broadcast(message);
  });

  // Evento que se ejecuta cuando el cliente se desconecta
  ws.on('close', () => {
    // Removemos al cliente de la lista de clientes conectados
    clients.delete(ws);
  });
});

console.log('Servidor WebSocket iniciado en el puerto 8080');
