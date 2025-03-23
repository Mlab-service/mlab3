import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import cloudinary from '@/app/lib/cloudinary';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const name = formData.get('name') as string;
        const category = formData.get('category') as string;
        const description = formData.get('description') as string;
        const price = Number(formData.get('price'));
        const image = formData.get('image') as File;
        const specifications = JSON.parse(formData.get('specifications') as string);

        // 将图片转换为 base64
        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
        const dataURI = `data:${image.type};base64,${base64Image}`;

        // 上传图片到 Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
            folder: 'mlab-products',
        });

        // 将产品数据保存到 Supabase
        const { data, error } = await supabase
            .from('products')
            .insert([
                {
                    name,
                    category,
                    description,
                    price,
                    image_url: uploadResponse.secure_url,
                    specifications,
                    created_at: new Date().toISOString(),
                }
            ])
            .select();

        if (error) throw error;

        return NextResponse.json({ success: true, product: data[0] });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create product' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ success: true, products: data });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
} 