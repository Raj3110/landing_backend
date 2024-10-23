const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow all origins
app.use(express.json());

// MongoDB connection with specified database name
mongoose.connect('mongodb+srv://saurabhpkadam1998:aLcxSkd27pwK9aZq@aichefmaster.8ljryes.mongodb.net/Subscription?retryWrites=true&w=majority&appName=AIChefMaster', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Email Schema with specified collection name
const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'Email' }); // Explicitly set collection name

const Email = mongoose.model('Email', emailSchema);

// Add connection error handling
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB database: Subscription');
});

// Routes
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if email already exists
    const existingEmail = await Email.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already subscribed' 
      });
    }

    // Create new email subscription
    const newEmail = new Email({ email });
    await newEmail.save();

    res.status(201).json({ 
      success: true, 
      message: 'Subscription successful' 
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Add a GET route to check all subscribed emails (for testing purposes)
app.get('/api/subscriptions', async (req, res) => {
  try {
    const emails = await Email.find({}, { email: 1, createdAt: 1, _id: 0 });
    res.json({ 
      success: true, 
      data: emails 
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});