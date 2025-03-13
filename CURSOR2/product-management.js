document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminPanel = document.getElementById('adminPanel');
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductModal = document.getElementById('addProductModal');
    const addProductForm = document.getElementById('addProductForm');
    const productList = document.getElementById('productList');

    // 检查必要的元素是否存在
    if (!adminLoginBtn || !adminPanel || !addProductBtn || !addProductModal || !addProductForm || !productList) {
        console.error('Required elements not found');
        return;
    }

    // 管理员状态
    let isAdmin = false;

    // 修改初始化事件监听器函数
    function initializeEventListeners() {
        console.log('Initializing event listeners...'); // 调试日志

        // 显示登录对话框
        if (adminLoginBtn) {
            adminLoginBtn.addEventListener('click', handleAdminLogin);
            console.log('Admin login button listener added');
        }
        
        // 处理添加产品按钮点击
        if (addProductBtn) {
            addProductBtn.addEventListener('click', handleAddProductClick);
            console.log('Add product button listener added');
        }
        
        // 关闭模态框
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', handleModalClose);
            console.log('Close modal button listener added');
        });
        
        // 点击模态框外部关闭
        window.addEventListener('click', handleOutsideClick);
        
        // 处理产品表单提交
        if (addProductForm) {
            console.log('Found product form');
            addProductForm.onsubmit = async function(e) {
                e.preventDefault();
                console.log('Form submitted');

                if (!isAdmin) {
                    alert('Admin access required');
                    return;
                }

                try {
                    const formData = new FormData(this);
                    const product = {
                        name: formData.get('productName'),
                        specs: formData.get('productSpecs'),
                        description: formData.get('productDescription'),
                        features: Array.from(formData.getAll('features[]')).filter(f => f.trim() !== '')
                    };

                    // 处理图片
                    const mainImageFile = formData.get('mainImage');
                    const secondaryImageFile = formData.get('secondaryImage');

                    // 转换图片
                    const mainImageData = await convertImageToBase64(mainImageFile);
                    const secondaryImageData = await convertImageToBase64(secondaryImageFile);

                    // 创建产品 HTML
                    const productHTML = `
                        <div class="product-item">
                            ${isAdmin ? `
                                <div class="product-actions">
                                    <button class="delete-btn" title="Delete Product">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            ` : ''}
                            <div class="product-content">
                                <div class="product-text">
                                    <h2>${product.name}</h2>
                                    <div class="product-specs">
                                        <h3>Specifications:</h3>
                                        <p>${product.specs}</p>
                                    </div>
                                    <div class="product-description">
                                        <h3>Description:</h3>
                                        <p>${product.description}</p>
                                    </div>
                                    <div class="product-features">
                                        <h3>Key Features:</h3>
                                        <ul>
                                            ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                                        </ul>
                                    </div>
                                </div>
                                <div class="product-images">
                                    ${mainImageData ? `<img src="${mainImageData}" alt="${product.name}">` : ''}
                                    ${secondaryImageData ? `<img src="${secondaryImageData}" alt="${product.name} Additional">` : ''}
                                </div>
                            </div>
                        </div>
                    `;

                    // 添加到产品列表
                    productList.insertAdjacentHTML('beforeend', productHTML);
                    
                    // 保存到 localStorage
                    saveProducts();

                    // 重新绑定删除按钮事件
                    setupDeleteButtons();

                    // 重置表单和关闭模态框
                    addProductModal.style.display = 'none';
                    this.reset();
                    document.querySelectorAll('.image-preview').forEach(preview => {
                        preview.innerHTML = '';
                    });
                    alert('Product added successfully!');

                } catch (error) {
                    console.error('Error adding product:', error);
                    alert('Error adding product. Please try again.');
                }
            };
        } else {
            console.error('Product form not found');
        }
        
        // 初始化图片预览
        initializeImagePreviews();
        
        // 初始化动态列表
        initializeDynamicLists();
    }

    // 处理管理员登录
    function handleAdminLogin() {
        const code = prompt('Please enter admin code:', '');
        if (code === '0030') {
            isAdmin = true;
            adminLoginBtn.style.display = 'none';
            adminPanel.style.display = 'flex';
            setupDeleteButtons();
            alert('Admin access granted!');
        } else if (code !== null) {
            alert('Invalid code!');
        }
    }

    // 处理添加产品按钮点击
    function handleAddProductClick() {
        if (!isAdmin) {
            alert('Admin access required');
            return;
        }
        addProductModal.style.display = 'block';
    }

    // 处理模态框关闭
    function handleModalClose() {
        addProductModal.style.display = 'none';
        addProductForm.reset();
        document.querySelectorAll('.image-preview').forEach(preview => {
            preview.innerHTML = '';
        });
    }

    // 处理点击模态框外部
    function handleOutsideClick(e) {
        if (e.target === addProductModal) {
            handleModalClose();
        }
    }

    // 处理图片预览
    function handleImagePreview(input, previewDiv) {
        input.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewDiv.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 初始化图片预览
    function initializeImagePreviews() {
        const mainImage = document.getElementById('mainImage');
        const secondaryImage = document.getElementById('secondaryImage');
        const mainImagePreview = document.getElementById('mainImagePreview');
        const secondaryImagePreview = document.getElementById('secondaryImagePreview');

        if (mainImage && mainImagePreview) {
            handleImagePreview(mainImage, mainImagePreview);
        }
        if (secondaryImage && secondaryImagePreview) {
            handleImagePreview(secondaryImage, secondaryImagePreview);
        }
    }

    // 处理动态列表的添加功能
    function initializeDynamicLists() {
        document.querySelectorAll('.add-item-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const listItem = this.parentElement;
                const newItem = listItem.cloneNode(true);
                newItem.querySelector('input').value = '';
                
                newItem.querySelector('.add-item-btn').addEventListener('click', function() {
                    const parentList = this.parentElement.parentElement;
                    const newListItem = listItem.cloneNode(true);
                    newListItem.querySelector('input').value = '';
                    parentList.appendChild(newListItem);
                });

                listItem.parentElement.appendChild(newItem);
            });
        });
    }

    // 添加删除功能的事件监听器
    function setupDeleteButtons() {
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (!isAdmin) {
                    alert('Admin access required');
                    return;
                }
                
                if (confirm('Are you sure you want to delete this product?')) {
                    const productItem = this.closest('.product-item');
                    productItem.remove();
                    saveProducts(); // 保存更改到 localStorage
                }
            });
        });
    }

    // 在保存和加载产品时使用不同的键
    function getStorageKey() {
        if (window.location.pathname.includes('lab-consumables')) {
            return 'lab-products';
        } else if (window.location.pathname.includes('geological-consumables')) {
            return 'geological-products';
        } else if (window.location.pathname.includes('safety-consumables')) {
            return 'safety-products';
        }
        return 'products';
    }

    // 修改保存函数
    function saveProducts() {
        const key = getStorageKey();
        localStorage.setItem(key, productList.innerHTML);
    }

    // 修改加载函数
    function loadProducts() {
        const key = getStorageKey();
        const savedProducts = localStorage.getItem(key);
        if (savedProducts) {
            productList.innerHTML = savedProducts;
            if (isAdmin) {
                document.querySelectorAll('.product-item').forEach(item => {
                    if (!item.querySelector('.product-actions')) {
                        item.insertAdjacentHTML('afterbegin', `
                            <div class="product-actions">
                                <button class="delete-btn" title="Delete Product">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `);
                    }
                });
                setupDeleteButtons();
            }
        }
    }

    // 确保图片转换函数正确定义
    function convertImageToBase64(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                resolve(null);
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                resolve(e.target.result);
            };
            reader.onerror = function(error) {
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    }

    // 初始化应用
    console.log('Starting application initialization...'); // 调试日志
    initializeEventListeners();
    loadProducts();
    console.log('Application initialization completed'); // 调试日志
}); 