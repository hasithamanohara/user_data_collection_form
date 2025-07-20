require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
      console.error("Error: MONGODB_URI environment variable is not set.");
      console.error("Please ensure you have a .env file with MONGODB_URI or set it in your deployment environment.");
      process.exit(1);
}

mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
})
      .then(() => console.log('MongoDB connected successfully!'))
      .catch(err => {
            console.error('MongoDB connection error:', err.message);
            process.exit(1);
      });

const userSchema = new mongoose.Schema({

      preferred_cuisine: { type: String, required: true },
      price_sensitivity: { type: Number, required: true, min: 1, max: 5 },
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
      proximity_weight: { type: Number, required: true, min: 0, max: 1 },
      timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
      const { cuisine, price_sense, lat, lon, prox_weight } = req.body;


      if (!cuisine || price_sense === undefined || lat === undefined || lon === undefined || prox_weight === undefined) {
            return res.status(400).json({ status: 'error', message: 'All fields are required.' });
      }

      try {
            const newUser = new User({
                  preferred_cuisine: cuisine,
                  price_sensitivity: parseInt(price_sense), 
                  lat: parseFloat(lat),                   
                  lon: parseFloat(lon),                    
                  proximity_weight: parseFloat(prox_weight)
            });

            const savedUser = await newUser.save();

            console.log(`Registered new user: ${savedUser._id}`);
            res.status(200).json({ status: 'success', user_id: savedUser._id, message: 'User registered successfully!' });

      } catch (error) {
            console.error('Error registering user to MongoDB:', error);
            res.status(500).json({ status: 'error', message: 'Failed to register user.', details: error.message });
      }
});

app.get('/users', async (req, res) => {
      try {
            const users = await User.find({}).sort({ timestamp: -1 });
            res.status(200).json(users);
      } catch (error) {
            console.error('Error fetching users from MongoDB:', error);
            res.status(500).json({ status: 'error', message: 'Failed to fetch users.', details: error.message });
      }
});

app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Connecting to MongoDB...`);
});
