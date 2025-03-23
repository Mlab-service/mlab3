require('dotenv').config();
const bcrypt = require('bcrypt');

async function testPassword() {
    try {
        const password = process.env.ADMIN_PASSWORD;
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        console.log('Password:', password);
        console.log('Generated hash:', hash);
        
        // 测试验证
        const isValid = await bcrypt.compare(password, hash);
        console.log('Validation test:', isValid);
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testPassword(); 