const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS Configuration
const corsOptions = {
  origin: [
    'https://glittering-dasik-fa3034.netlify.app',
    'http://localhost:3000',
    '*'
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};
// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection with specified database name
mongoose.connect('mongodb+srv://saurabhpkadam1998:aLcxSkd27pwK9aZq@aichefmaster.8ljryes.mongodb.net/Subscription?retryWrites=true&w=majority&appName=AIChefMaster', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Email Schema 
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
}, { collection: 'Email' }); 

// Chef Schema 
const chefSchema = new mongoose.Schema({
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
}, { collection: 'ChefEmail' }); 

const Email = mongoose.model('Email', emailSchema);
const ChefEmail = mongoose.model('ChefEmail', chefSchema);

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

app.post('/api/chef', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if email already exists
    const existingEmail = await ChefEmail.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already subscribed' 
      });
    }

    // Create new email subscription
    const newEmail = new ChefEmail({ email });
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



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
