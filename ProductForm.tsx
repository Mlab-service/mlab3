import { useState } from 'react';

export default function ProductForm() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const formData = new FormData(e.currentTarget);

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setMessage('产品添加成功！');
                (e.target as HTMLFormElement).reset();
            } else {
                setMessage('添加失败：' + data.error);
            }
        } catch (error) {
            setMessage('添加失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block mb-2">产品名称</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full p-2 border rounded"
                />
            </div>
            
            <div>
                <label htmlFor="category" className="block mb-2">类别</label>
                <select
                    id="category"
                    name="category"
                    required
                    className="w-full p-2 border rounded"
                >
                    <option value="Laboratory">实验室耗材</option>
                    <option value="Geological">地质耗材</option>
                    <option value="Safety">安全用品</option>
                    <option value="Technical">技术服务</option>
                </select>
            </div>

            <div>
                <label htmlFor="description" className="block mb-2">描述</label>
                <textarea
                    id="description"
                    name="description"
                    required
                    className="w-full p-2 border rounded"
                />
            </div>

            <div>
                <label htmlFor="price" className="block mb-2">价格</label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    className="w-full p-2 border rounded"
                />
            </div>

            <div>
                <label htmlFor="image" className="block mb-2">产品图片</label>
                <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    required
                    className="w-full p-2 border rounded"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
                {loading ? '添加中...' : '添加产品'}
            </button>

            {message && (
                <div className={`p-2 rounded ${message.includes('成功') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}
        </form>
    );
} 