import React, { useState } from 'react'

const AdminPanel = () => {
  const [product, setProduct] = useState({
    name: '',
    image: '',
    description: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 获取当前产品列表
    const response = await fetch('https://api.github.com/repos/Mlab-service/mlab4/contents/src/data/products.json')
    const data = await response.json()
    const products = JSON.parse(atob(data.content))
    
    // 添加新产品
    products.push(product)
    
    // 更新文件
    const updateResponse = await fetch(data.url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Add product: ${product.name}`,
        content: btoa(JSON.stringify(products, null, 2)),
        sha: data.sha
      })
    })

    if (updateResponse.ok) {
      alert('Product added successfully!')
      setProduct({
        name: '',
        image: '',
        description: ''
      })
    } else {
      alert('Error adding product')
    }
  }

  return (
    <div className="admin-panel">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={product.name}
          onChange={(e) => setProduct({...product, name: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={product.image}
          onChange={(e) => setProduct({...product, image: e.target.value})}
          required
        />
        <textarea
          placeholder="Description"
          value={product.description}
          onChange={(e) => setProduct({...product, description: e.target.value})}
          required
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  )
}

export default AdminPanel