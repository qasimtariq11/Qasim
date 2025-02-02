const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const authRoutes = require('./routes/authRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const profileRoutes = require('./routes/profileRoutes'); 
const billingRoutes = require('./routes/billingRoutes'); 
const reportsRoutes = require('./routes/reportsRoutes'); 

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/profile', profileRoutes); 
app.use('/api/billing', billingRoutes); 
app.use('/api/reports', reportsRoutes); 

app.get('/', (req, res) => {
    res.send('Welcome to AP Remind App Backend!');
});

app.listen(process.env.PORT || 5000, () => console.log('✅ Server running...'));
