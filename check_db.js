import mongoose from 'mongoose';
import connectDB from './backend/config/db.js';
import Product from './backend/models/productModel.js';

const checkData = async () => {
    await connectDB();
    const count = await Product.countDocuments();
    console.log(`Product count: ${count}`);
    mongoose.connection.close();
};

checkData();
