const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const Product = require('./models/Product');

const app = express();

// 连接数据库
connectDB();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 配置文件上传
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 限制5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

// 初始化管理员密码
const initializeAdmin = async () => {
    try {
        const password = process.env.ADMIN_PASSWORD;
        if (!password) {
            throw new Error('Admin password not set in environment variables');
        }
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        console.log('Admin password hash created successfully');
        return hash;
    } catch (error) {
        console.error('Error initializing admin password:', error);
        process.exit(1);
    }
};

// 确保在应用启动前已经设置好密码哈希
let ADMIN_PASSWORD_HASH;
(async () => {
    ADMIN_PASSWORD_HASH = await initializeAdmin();
    console.log('Admin password initialized');
})();

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET;

// 登录尝试记录
const loginAttempts = new Map();

// 验证JWT中间件
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// 检查登录尝试
const checkLoginAttempts = (ip) => {
    const attempts = loginAttempts.get(ip) || { count: 0, lockUntil: 0 };
    const now = Date.now();

    if (attempts.lockUntil > now) {
        const remainingTime = Math.ceil((attempts.lockUntil - now) / 1000 / 60);
        throw new Error(`Account is locked. Try again in ${remainingTime} minutes`);
    }

    if (attempts.count >= 5 && attempts.lastAttempt > (now - 30 * 60 * 1000)) {
        attempts.lockUntil = now + (30 * 60 * 1000);
        loginAttempts.set(ip, attempts);
        throw new Error('Too many failed attempts. Account is locked for 30 minutes');
    }

    return attempts;
};

// 登录路由
app.post('/api/login', async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        const ip = req.ip;
        const attempts = checkLoginAttempts(ip);

        // 确保密码哈希已经初始化
        if (!ADMIN_PASSWORD_HASH) {
            console.error('Password hash not initialized');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
        console.log('Password validation result:', isValid); // 调试日志

        if (!isValid) {
            attempts.count++;
            attempts.lastAttempt = Date.now();
            loginAttempts.set(ip, attempts);
            
            return res.status(401).json({ 
                error: 'Invalid password',
                remainingAttempts: 5 - attempts.count
            });
        }

        loginAttempts.delete(ip);
        const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '30m' });
        
        res.json({ 
            token,
            message: 'Login successful'
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed: ' + error.message });
    }
});

// 添加产品路由
app.post('/api/products', authenticateToken, upload.array('images', 2), async (req, res) => {
    try {
        const { name, description, features, applications } = req.body;
        const images = req.files.map(file => `/uploads/${file.filename}`);

        const product = new Product({
            name,
            description,
            features: JSON.parse(features),
            applications: JSON.parse(applications),
            images
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 获取产品列表路由
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 删除产品路由
app.delete('/api/products/:id', authenticateToken, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 