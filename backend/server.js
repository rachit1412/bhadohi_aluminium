const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection with detailed error handling
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => {
    console.log('MongoDB connected successfully to bhadohi_aluminium database');
    // Verify database by listing collections
    mongoose.connection.db.listCollections().toArray((err, collections) => {
      if (err) console.error('Error listing collections:', err.message);
      else console.log('Available collections:', collections.map(c => c.name));
    });
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1); // Exit if connection fails
  });

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { 
    data: { type: Buffer, default: null }, 
    contentType: { type: String, default: '' } 
  },
  cost: {
    material: { type: Number, required: true },
    labour: { type: Number, required: true },
    transport: { type: Number, required: true },
    miscellaneous: { type: Number, required: true },
    total: { type: Number, required: true }
  }
});
const Product = mongoose.model('Product', productSchema);

// Multer setup for image uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(file.originalname.toLowerCase().split('.').pop());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG/PNG images are allowed!'), false);
    }
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to Bhadohi Aluminium Company API');
});

// Admin Authentication
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('admin12345', 10);

app.post('/api/admin/login', async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ message: 'Password is required' });
  if (bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid password' });
  }
});

// Middleware to verify JWT
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') throw new Error('Invalid role');
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    res.status(401).json({ message: 'Unauthorized', error: err.message });
  }
};

// Product Routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    // Map products to include image URL
    const productsWithImageUrl = products.map(product => ({
      ...product._doc,
      image: product.image.data ? `/api/products/${product._id}/image` : ''
    }));
    console.log('Fetched products:', products.length, 'items');
    res.json(productsWithImageUrl);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    // Include image URL
    const productWithImageUrl = {
      ...product._doc,
      image: product.image.data ? `/api/products/${product._id}/image` : ''
    };
    console.log('Fetched product:', product._id);
    res.json(productWithImageUrl);
  } catch (err) {
    console.error('Error fetching product:', err.message);
    res.status(500).json({ message: 'Error fetching product', error: err.message });
  }
});

// Route to serve image
app.get('/api/products/:id/image', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.image.data) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.set('Content-Type', product.image.contentType);
    res.send(product.image.data);
  } catch (err) {
    console.error('Error fetching image:', err.message);
    res.status(500).json({ message: 'Error fetching image', error: err.message });
  }
});

app.post('/api/products', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, cost } = req.body;
    console.log('Received product data:', { name, description, cost, image: req.file });
    
    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    let parsedCost;
    try {
      parsedCost = typeof cost === 'string' ? JSON.parse(cost) : cost;
      if (!parsedCost || typeof parsedCost !== 'object') throw new Error('Invalid cost format');
    } catch (err) {
      return res.status(400).json({ message: 'Invalid cost format', error: err.message });
    }

    const { material, labour, transport, miscellaneous } = parsedCost;
    if (!material || !labour || !transport || !miscellaneous) {
      return res.status(400).json({ message: 'All cost fields are required' });
    }

    const image = req.file ? { data: req.file.buffer, contentType: req.file.mimetype } : { data: null, contentType: '' };
    const total = Number(material) + Number(labour) + Number(transport) + Number(miscellaneous);

    const product = new Product({ 
      name, 
      description, 
      image, 
      cost: { material: Number(material), labour: Number(labour), transport: Number(transport), miscellaneous: Number(miscellaneous), total } 
    });
    await product.save();
    console.log('Product saved successfully:', product._id);
    res.json({
      ...product._doc,
      image: product.image.data ? `/api/products/${product._id}/image` : ''
    });
  } catch (err) {
    console.error('Error adding product:', err.message);
    res.status(500).json({ message: 'Error adding product', error: err.message });
  }
});

app.put('/api/products/:id', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, cost } = req.body;
    console.log('Received update data:', { name, description, cost, image: req.file });
    
    let parsedCost;
    try {
      parsedCost = typeof cost === 'string' ? JSON.parse(cost) : cost;
    } catch (err) {
      return res.status(400).json({ message: 'Invalid cost format', error: err.message });
    }

    const image = req.file ? { data: req.file.buffer, contentType: req.file.mimetype } : undefined;
    const total = Number(parsedCost.material) + Number(parsedCost.labour) + Number(parsedCost.transport) + Number(parsedCost.miscellaneous);

    const updateData = { 
      name, 
      description, 
      cost: { ...parsedCost, total } 
    };
    if (image) updateData.image = image;

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    console.log('Product updated:', product._id);
    res.json({
      ...product._doc,
      image: product.image.data ? `/api/products/${product._id}/image` : ''
    });
  } catch (err) {
    console.error('Error updating product:', err.message);
    res.status(500).json({ message: 'Error updating product', error: err.message });
  }
});

app.delete('/api/products/:id', verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    console.log('Product deleted:', product._id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product:', err.message);
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));