const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  passengerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // will be used later when auth is added
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: false // can be null until a driver accepts
  },
  pickupLocation: {
    type: Object,
    required: true
  },
  dropLocation: {
    type: Object,
    required: true
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'in-progress', 'completed', 'cancelled'],
    default: 'requested'
  },
  fare: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: false // optional for now; coming from frontend
  },
  time: {
    type: String,
    required: true // optional for now; coming from frontend
  },
  seats: {
    type: Number,
    required: false // optional field from booking form
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
});

module.exports = mongoose.model('Ride', rideSchema);