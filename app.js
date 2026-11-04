// CraftNest - Online Craft Store
// Node.js + MongoDB CRUD operations using the MongoDB Node.js driver

const { MongoClient } = require('mongodb');

// Default local MongoDB connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

async function main() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log('Connected to MongoDB successfully');

        // Select database and collection
        const db = client.db('CraftNestDB');
        const crafts = db.collection('Crafts');

        // Clear old records so the program gives the same output every run
        await crafts.deleteMany({});

        // CREATE - insert three craft documents
        const insertResult = await crafts.insertMany([
            { name: 'Wool Basket',     category: 'Home Decor', price: 450, stock: 10 },
            { name: 'Handmade Candle', category: 'Candles',    price: 250, stock: 25 },
            { name: 'Canvas Painting', category: 'Art',        price: 850, stock: 5 }
        ]);
        console.log('Inserted documents:', insertResult.insertedCount);

        // READ - retrieve all documents
        const allCrafts = await crafts.find({}).toArray();
        console.log('All Crafts:', allCrafts);

        // READ - retrieve crafts costing more than Rs.300
        const costly = await crafts.find({ price: { $gt: 300 } }).toArray();
        console.log('Crafts above Rs.300:', costly);

        // UPDATE - change the price of the Wool Basket
        const updateResult = await crafts.updateOne(
            { name: 'Wool Basket' },
            { $set: { price: 500 } }
        );
        console.log('Updated documents:', updateResult.modifiedCount);

        const updated = await crafts.findOne({ name: 'Wool Basket' });
        console.log('Updated craft:', updated);

        // DELETE - remove the Handmade Candle
        const deleteResult = await crafts.deleteOne({ name: 'Handmade Candle' });
        console.log('Deleted documents:', deleteResult.deletedCount);

        // Remaining crafts
        const remaining = await crafts.countDocuments();
        console.log('Crafts remaining:', remaining);

    } catch (error) {
        console.error('Database error:', error.message);
    } finally {
        // Close the connection
        await client.close();
        console.log('MongoDB connection closed');
    }
}

main();