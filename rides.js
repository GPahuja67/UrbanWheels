const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');

// 📌 Book/Request a ride
router.post('/request', async (req, res) => {
  try {
    const { pickup, drop, fare, seats, date, time, userId } = req.body;

    if (!pickup || !drop || !fare || !seats || !date || !time || !userId) {
      return res.status(400).json({ message: 'All fields including userId are required.' });
    }

    const [hours, minutes] = time.split(':');
    const rideDate = new Date(date);
    rideDate.setHours(hours);
    rideDate.setMinutes(minutes);

    const ride = new Ride({
      pickupLocation: pickup,
      dropLocation: drop,
      fare,
      seats,
      date,
      time,
      userId,
      status: 'requested',
      requestedAt: new Date()
    });

    await ride.save();
    res.status(201).json({ message: 'Ride booked successfully!', ride });
  } catch (err) {
    console.error('❌ Ride request failed:', err.message);
    res.status(500).json({ message: 'Ride request failed', error: err.message });
  }
});


// 📌 Get all rides (Admin Dashboard)
router.get('/all', async (req, res) => {
  try {
    const rides = await Ride.find().sort({ requestedAt: -1 });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch rides' });
  }
});

// ✅ 📌 Get rides by User ID (for Booking History)
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const rides = await Ride.find({ userId }).sort({ requestedAt: -1 });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user rides' });
  }
});

module.exports = router;
