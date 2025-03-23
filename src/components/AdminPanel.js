import React, { useState } from 'react'
import simpleGit from 'simple-git'
import fs from 'fs'
import path from 'path'

const AdminPanel = () => {
  const [product, setProduct] = useState({
    name: '',
    image: '',
    description: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 保存到本地文件
    const productsPath = path.join(process.cwd(), 'src', 'data', 'products.json')
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'))
    products.push(product)
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2))

    // 自动Git操作
    const git = simpleGit()
    await git.add('.')
    await git.commit(`Add product: ${product.name}`)
    await git.push()

    alert('Product added and changes pushed successfully!')
    setProduct({
      name: '',
      image: '',
      description: ''
    })
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