const express = require('express');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes'); // Dosya adı düzeltildi

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Ayarları
const corsOptions = {
    origin: process.env.CLIENT_URL || '*', // Daha güvenli olması için .env'den okunabilir
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions));
app.use(express.json());

// API Yönlendirmeleri
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);

// Ana Route
app.get('/', (req, res) => {
    res.send('🚀 API Çalışıyor!');
});

// Hata Yakalama Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Server Başlatma
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

