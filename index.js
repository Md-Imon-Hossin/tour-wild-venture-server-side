const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4wajp.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

  try {
    const orderCollections = client.db("orders");
    const orderCollection = orderCollections.collection("order")
    const tourism_services = client.db("tourism_services");
    const tourism_service = tourism_services.collection("tourism_service");

    // Service GET API
    app.get('/services', async (req, res) => {
      const cursor = tourism_service.find({});
      const users = await cursor.toArray();
      res.send(users);
    })

    // specific get find single service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await tourism_service.findOne(query);
      res.send(service);
    })

    // Service POST API
    app.post('/services', async (req, res) => {
      const newService = req.body;
      const result = await tourism_service.insertOne(newService);
      console.log("got new user", req.body);
      console.log("added user", result);
      res.send(result);
    })

    // add orders api
    app.post('/orders', async (req, res) => {
      const order = req.body;
      console.log('order', order);
      const result = await orderCollection.insertOne(order);
      res.json(result)
    })

    app.get('/orders/:email', async (req, res) => {
      const cursor = await orderCollection.find({email : req.params.email}).toArray();
      // const result = await cursor.toArray();
      res.send(cursor);
    })

    // Delete API
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      // console.log("deleting order with id", result);
      res.json(result);;
    })

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('This is node server');
})

app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
})
