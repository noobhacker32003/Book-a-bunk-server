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
          app.post('/rooms', async (req, res) => {
            const db = client.db("book-a-bunk");
            const roomsCollection = db.collection("rooms");
            const result = await roomsCollection.insertOne(req.body);
            console.log(result);
            
            res.json(result);
        });
        
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

          app.post('/studyRooms', async (req, res) => {
            const db = client.db("book-a-bunk");
            const roomsCollection = db.collection("study room");
            const result = await roomsCollection.insertOne(req.body);
            console.log(result);
            
            res.json(result);
        });
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
        

        // POST: Add a new user
        app.post('/users', async (req, res) => {
            const db = client.db("book-a-bunk");
            const usersCollection = db.collection("users");
            const newUser = req.body;
            try {
                const result = await usersCollection.insertOne(newUser);
                console.log('New user added:', result);
                res.status(201).send(result);
            } catch (error) {
                console.error('Error adding user:', error);
                res.status(500).send({ success: false, message: 'Failed to add user' });
            }
        });

        // GET: Retrieve all users
        app.get('/users', async (req, res) => {
            const db = client.db("book-a-bunk");
        const usersCollection = db.collection("users");
            try {
                const users = await usersCollection.find().toArray();
                res.send(users);
            } catch (error) {
                console.error('Error retrieving users:', error);
                res.status(500).send({ success: false, message: 'Failed to retrieve users' });
            }
        });

        // GET: Retrieve a single user by ID
        app.get('/users/:uid', async (req, res) => {
            const db = client.db("book-a-bunk");
            const usersCollection = db.collection("users");
            const { uid } = req.params; // Extract `uid` from the route parameter
        
            try {
                // Query the collection using `uid`
                const user = await usersCollection.findOne({ uid: uid });
                
                if (user) {
                    res.send(user);
                } else {
                    res.status(404).send({ success: false, message: 'User not found' });
                }
            } catch (error) {
                console.error('Error retrieving user:', error);
                res.status(500).send({ success: false, message: 'Failed to retrieve user' });
            }
        });

        // PUT: Update a user by ID
        app.put('/users/:uid', async (req, res) => {
            const db = client.db("book-a-bunk");
            const usersCollection = db.collection("users");
            const { uid } = req.params;  // Use uid to find the user
            const updatedUser = req.body;  // The updated data
        
            try {
                // Use the uid instead of _id for the update query
                const result = await usersCollection.updateOne(
                    { uid: uid },  // Match by uid
                    { $set: updatedUser }  // Set the updated data
                );
        
                if (result.modifiedCount > 0) {
                    res.send({ success: true, message: 'User updated successfully' });
                } else {
                    res.status(404).send({ success: false, message: 'User not found or no changes made' });
                }
            } catch (error) {
                console.error('Error updating user:', error);
                res.status(500).send({ success: false, message: 'Failed to update user' });
            }
        });
        

        // DELETE: Remove a user by ID
        app.delete('/users/:id', async (req, res) => {
            const db = client.db("book-a-bunk");
        const usersCollection = db.collection("users");
            const { id } = req.params;
            try {
                const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
                if (result.deletedCount > 0) {
                    res.send({ success: true, message: 'User deleted successfully' });
                } else {
                    res.status(404).send({ success: false, message: 'User not found' });
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                res.status(500).send({ success: false, message: 'Failed to delete user' });
            }
        });





    } finally {
        // Ensures that the client will close when you finish/error
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Its working')
})

app.listen(port, () => {
    console.log(`server working in port: ${port}`);
})

