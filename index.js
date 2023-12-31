const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tjhl6td.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        client.connect();

        const carCollection = client.db('carDB').collection('car')
        const cartCollection = client.db('carDB').collection('cart')

        // create data on db 
        app.post('/car', async (req, res) => {
            const newCar = req.body;
            console.log(newCar);
            const result = await carCollection.insertOne(newCar);
            res.send(result);
        })

        // read data from db 
        app.get('/car', async (req, res) => {
            const cursor = carCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // car put / update api 
        app.put('/car/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedCar = req.body;
            console.log(updatedCar);
            const car = {
                $set: {
                    name: updatedCar.name,
                    type: updatedCar.type,
                    photo: updatedCar.photo,
                    brand: updatedCar.brand,
                    price: updatedCar.price,
                    ratings: updatedCar.ratings,
                    short_description: updatedCar.short_description,
                }
            }
            const result = await carCollection.updateOne(query, car, options);
            res.send(result);
        })

        // cart post api 
        app.post('/cart', async (req, res) => {

            const cart = req.body;
            console.log(cart);
            const result = await cartCollection.insertOne(cart);
            res.send(result);
        })
        // cart get api 
        app.get('/cart', async (req, res) => {
            const cursor = cartCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        
        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            const email = req.query.email;
            const query = {
                _id: new ObjectId(id),
                email: email
            }
            const result = await cartCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Server is running');
})

app.listen(port, () => {
    console.log(`server running on port ${port}`);
})