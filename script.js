document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Show loading state
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    const serviceID = 'YOUR_SERVICE_ID'; // 替换为你的 EmailJS 服务 ID
    const templateID = 'YOUR_TEMPLATE_ID'; // 替换为你的 EmailJS 模板 ID

    // 发送邮件
    emailjs.send(serviceID, templateID, {
        name: this.name.value,
        email: this.email.value,
        message: this.message.value,
        to_email: 'sales@mlab-technical.com.au, wscqdcn@hotmail.com' // 添加多个接收邮箱
    })
    .then(() => {
        alert('Message sent successfully!'); // 英文提示
        document.getElementById('contact-form').reset();
    }, (err) => {
        console.error('发送失败:', err);
        alert(JSON.stringify(err));
    })
    .finally(function() {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    });
});

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update active link
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Update active navigation link on scroll
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight/3)) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentSection) {
            link.classList.add('active');
        }
    });
});

// 产品类别切换功能
document.addEventListener('DOMContentLoaded', function() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const categoryContents = document.querySelectorAll('.category-content');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有活动状态
            categoryBtns.forEach(b => b.classList.remove('active'));
            categoryContents.forEach(c => c.classList.remove('active'));

            // 添加新的活动状态
            btn.classList.add('active');
            const targetCategory = document.getElementById(btn.dataset.category);
            targetCategory.classList.add('active');
        });
    });
});

// 检查用户是否是管理员
function isAdmin() {
    // 这里可以添加实际的管理员验证逻辑
    return false; // 默认返回false，表示非管理员
}

// 在页面加载时检查并隐藏删除按钮
window.addEventListener('DOMContentLoaded', function() {
    if (!isAdmin()) {
        const deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => button.style.display = 'none');
    }
});

document.getElementById('add-product-button').addEventListener('click', function() {
    const formContainer = document.getElementById('add-product-form-container');
    formContainer.innerHTML = `
        <form id="add-product-form" class="add-product-form">
            <div class="form-group">
                <label for="product">Product:</label>
                <input type="text" id="product" name="product">
            </div>
            <div class="form-group">
                <label for="code">Code:</label>
                <input type="text" id="code" name="code">
            </div>
            <div class="form-group">
                <label for="specifications">Specifications:</label>
                <textarea id="specifications" name="specifications"></textarea>
            </div>
            <div class="form-group">
                <label for="image">Image:</label>
                <input type="file" id="image" name="image" accept="image/*">
            </div>
            <button type="submit" class="btn">Add Product</button>
        </form>
    `;
});