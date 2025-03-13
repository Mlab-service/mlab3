# MLab Technical 网站设置指南

## 1. Cloudinary 设置
### 第一步：注册
1. 访问 https://cloudinary.com/users/register/free
2. 填写注册信息：
   - 电子邮件
   - 姓名
   - 密码
   - 公司名称（可选）

### 第二步：获取密钥
1. 登录后，在 Dashboard 页面右上角找到 "Account Details"
2. 记录以下信息：
   - Cloud name（例如：your-cloud-name）
   - API Key（例如：123456789012345）
   - API Secret（例如：abcdefghijklmnopqrstuvwxyz）

## 2. Supabase 设置
### 第一步：注册
1. 访问 https://supabase.com
2. 点击右上角 "Start your project"
3. 使用 GitHub 账号登录

### 第二步：创建项目
1. 点击 "New project"
2. 填写项目信息：
   - Name: mlab-technical
   - Database Password: 设置一个强密码
   - Region: Southeast Asia (Singapore)
   - Pricing Plan: Free Tier

### 第三步：创建数据表
1. 在左侧菜单找到 "SQL Editor"
2. 点击 "New Query"
3. 复制粘贴以下代码：
```sql
create table products (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    category text not null,
    description text not null,
    price numeric not null,
    image_url text not null,
    specifications text[] default '{}',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```
4. 点击 "Run" 执行

### 第四步：获取项目密钥
1. 在左侧菜单点击 "Project Settings"
2. 找到 "API" 标签
3. 记录以下信息：
   - Project URL（例如：https://xxxxxxxxxxxx.supabase.co）
   - anon/public key（以 eyJ... 开头的长字符串）

## 3. Vercel 部署
### 第一步：准备
1. 确保你的代码已经推送到 GitHub
2. 访问 https://vercel.com
3. 使用 GitHub 账号登录

### 第二步：导入项目
1. 点击 "New Project"
2. 从列表中选择你的 GitHub 仓库
3. 在配置页面：
   - Framework Preset: Next.js
   - Root Directory: ./

### 第三步：设置环境变量
1. 展开 "Environment Variables" 部分
2. 添加以下变量：
```
NEXT_PUBLIC_SUPABASE_URL=你的_Supabase_项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_Supabase_anon_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=你的_Cloudinary_cloud_name
CLOUDINARY_API_KEY=你的_Cloudinary_api_key
CLOUDINARY_API_SECRET=你的_Cloudinary_api_secret
```

### 第四步：部署
1. 点击 "Deploy"
2. 等待部署完成
3. 点击生成的域名访问你的网站

## 4. 验证设置
### 测试产品管理
1. 访问 `你的域名/admin/products`
2. 尝试添加一个新产品：
   - 填写产品信息
   - 上传图片
   - 点击提交

### 测试产品展示
1. 访问 `你的域名/products`
2. 确认刚才添加的产品显示正常
   - 图片是否显示
   - 信息是否完整

## 常见问题解决
1. 图片上传失败
   - 检查 Cloudinary 配置是否正确
   - 确认图片大小是否超过限制（10MB）

2. 数据保存失败
   - 检查 Supabase 连接是否正确
   - 确认数据表是否创建成功

3. 部署失败
   - 检查环境变量是否都已正确设置
   - 查看 Vercel 部署日志了解具体错误

## 需要帮助？
如果遇到问题，可以：
1. 检查各个服务的仪表板
2. 查看浏览器控制台错误信息
3. 确认所有环境变量都已正确设置 