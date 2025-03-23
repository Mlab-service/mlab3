require('dotenv').config();
const connectDB = require('./config/database');

async function testConnection() {
    try {
        await connectDB();
        console.log('Database connection test successful!');
        process.exit(0);
    } catch (error) {
        console.error('Database connection test failed:', error);
        process.exit(1);
    }
}

testConnection(); 