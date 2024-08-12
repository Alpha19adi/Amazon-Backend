const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const userRoutes = require('./routes/user');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart'); 


app.use('/api/auth', userRoutes); 
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));