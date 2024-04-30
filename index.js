const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mwqipy1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const craftItemCollection = client.db('craftItemDB').collection('craftItem');
    const userCollection = client.db('craftItemDB').collection('user');
    const categoryCollection = client.db('craftItemDB').collection('category');

    app.get('/craftItem', async (req, res) => {
      const cursor = craftItemCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  })

  app.get('/craftItem/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await craftItemCollection.findOne(query);
    res.send(result);
})

    app.post('/craftItem', async (req, res) => {
      const newCraftItem = req.body;
      console.log(newCraftItem);
      const result = await craftItemCollection.insertOne(newCraftItem);
      res.send(result);
  })

  // category

  app.get('/craftItem', async (req, res) => {
    const cursor = categoryCollection.find();
    const result = await cursor.toArray();
    res.send(result);
})


  app.post('/category', async (req, res) => {
    const newCategory = req.body;
    console.log(newCategory);
    const result = await categoryCollection.insertOne(newCategory);
    res.send(result);
  })

  app.put('/craftItem/:id', async(req, res) => {
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)}
    const options = { upsert: true };
    const updatedCraftItem = req.body;

    const craftItem = {
        $set: {
            craftName: updatedCraftItem.craftName, 
            price: updatedCraftItem.price, 
            subCategory: updatedCraftItem.subCategory, 
            description: updatedCraftItem.description, 
            processingTime: updatedCraftItem.processingTime, 
            stockStatus: updatedCraftItem.stockStatus, 
            customization: updatedCraftItem.customization, 
            rating: updatedCraftItem.rating, 
            photo: updatedCraftItem.photo
        }
    }
    const result = await craftItemCollection.updateOne(filter, craftItem, options);
    res.send(result);
})


// User related Api
app.post('/user', async (req, res) => {
  const user = req.body;
  console.log(user);
  const result = await userCollection.insertOne(user);
  res.send(result);
})

app.get('/myCraftList/:email', async(req, res) => {

  const cursor = craftItemCollection.find();
      const result = await cursor.toArray();
      res.send(result);
})

// Delete
app.delete('/delete/:id', async(req, res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await craftItemCollection.deleteOne(query);
  console.log(result)
  res.send(result);
})


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Coffee making server is running');
})

app.listen(port, () => {
    console.log(`Coffee server is running on port : ${port}`)
})