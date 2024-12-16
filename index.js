const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri =  `mongodb+srv://book-a-bunk:${process.env.pass}@cluster0.fjfms.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        app.get('/rooms', async(req, res) => {
            const db = client.db("book-a-bunk");
            const roomsCollection = db.collection("rooms");
            const rooms = await roomsCollection.find().toArray();
            res.json(rooms);
          })
        app.get('/feedback', async(req, res) => {
            const db = client.db("book-a-bunk");
            const feedbackCollection = db.collection("feedback");
            const feedback = await feedbackCollection.find().toArray();
            res.json(feedback);
          })
          app.post('/feedback', async (req, res) => {
            const newFeedback = req.body;
            //console.log('creating new feedback', newFeedback);
            const db = client.db("book-a-bunk");
            const feedbackCollection = db.collection("feedback");
            const result =await feedbackCollection.insertOne(newFeedback);
            console.log(result);
            
            res.send(result);
        });





    } finally {
        // Ensures that the client will close when you finish/error
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('HOT HOT HOT COFFEEEEEEE')
})

app.listen(port, () => {
    console.log(`COffee is getting warmer in port: ${port}`);
})

