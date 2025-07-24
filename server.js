// Load environment variables from .env file
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');

// ✅ For opening browser
const open = (...args) => import('open').then(m => m.default(...args));

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files from ../cab-client
app.use(express.static(path.join(__dirname, '../cab-client')));

// ✅ Serve home.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../cab-client', 'home.html'));
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Routes
// If you have auth routes, uncomment below line
 app.use('/api/auth', require('./routes/auth'));
app.use('/api/rides', require('./routes/rides'));

// ✅ Socket.IO - Real-time ride handling
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  socket.on('requestRide', (ride) => {
    console.log('📡 New ride request received via socket:', ride);
    socket.broadcast.emit('newRideRequest', ride);
  });

  socket.on('acceptRide', (data) => {
    console.log('✅ Ride accepted:', data);
    socket.broadcast.emit('rideAccepted', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// ✅ Start Server and open browser
const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`🌐 Open in browser: ${url}\n`);
  await open(url);
});
