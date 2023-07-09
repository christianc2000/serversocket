const WebSocket = require('ws');

// Creamos un nuevo servidor WebSocket
const wss = new WebSocket.Server({ port: 8080 });

// Almacenamos las conexiones de los clientes
const clients = new Map();

// Función para enviar un mensaje a un cliente específico
const messageOne = (clientId, message) => {
  const client = clients.get(clientId);
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(message);
  }
};

// Evento que se ejecuta cuando un cliente se conecta al servidor WebSocket
wss.on('connection', (ws) => {
  // Agregamos el cliente a la lista de clientes conectados
  console.log("Cliente agregado correctamente...");
  clients.set(ws, ws);

  // Evento que se ejecuta cuando se recibe un mensaje del cliente
  ws.on('message', (message) => {
    try {
      const { type, data, clientId } = JSON.parse(message);

      if (type === "register") {
        // Asignar datos al cliente
        const client = clients.get(ws);
        if (client) {
          clients.set(ws, { id: clientId, data });
        }
      } else if (type === "message") {
        // Enviar mensaje al cliente de destino
        messageOne(clientId, data);
      }
    } catch (error) {
      console.error('Error al analizar el mensaje:', error);
    }
  });

  // Evento que se ejecuta cuando el cliente se desconecta
  ws.on('close', () => {
    // Removemos al cliente de la lista de clientes conectados
    clients.delete(ws);
  });
});

console.log('Servidor WebSocket iniciado en el puerto 8080');
