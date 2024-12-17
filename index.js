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
        
        app.get('/studyRooms', async(req, res) => {
            const db = client.db("book-a-bunk");
            const studyRoomsCollection = db.collection("study room");
            const studyRooms = await studyRoomsCollection.find().toArray();
            res.json(studyRooms);
          })
        app.get('/payments', async(req, res) => {
            const db = client.db("book-a-bunk");
            const paymentsCollection = db.collection("payments");
            const payments = await paymentsCollection.find().toArray();
            res.json(payments);
          })
        app.get('/bookings', async(req, res) => {
            const db = client.db("book-a-bunk");
            const bookingsCollection = db.collection("bookingHistory");
            const bookings = await bookingsCollection.find().toArray();
            res.json(bookings);
          })

          app.post('/bookings', async (req, res) => {
            const newBooking = req.body;
            const db = client.db("book-a-bunk");
            const bookingCollection = db.collection("bookingHistory");
        
            try {
                const result = await bookingCollection.insertOne(newBooking);
                console.log('New booking added:', result);
                res.send(result);
            } catch (error) {
                console.error('Error adding booking:', error);
                res.status(500).send({ success: false, message: 'Failed to save booking' });
            }
        });
        
        // Payment History Endpoint
        app.post('/payments', async (req, res) => {
            const newPayment = req.body;
            const db = client.db("book-a-bunk");
            const paymentCollection = db.collection("payments");
        
            try {
                const result = await paymentCollection.insertOne(newPayment);
                console.log('New payment added:', result);
                res.send(result);
            } catch (error) {
                console.error('Error adding payment:', error);
                res.status(500).send({ success: false, message: 'Failed to save payment' });
            }
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

