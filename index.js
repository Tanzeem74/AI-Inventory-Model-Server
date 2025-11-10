const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = 3000;

app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ox4mfpm.mongodb.net/?appName=Cluster0`;

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
    const db = client.db('Model_db');
    const modelCollection = db.collection('model');

    //getting all
    app.get('/models', async (req, res) => {
      const result = await modelCollection.find().toArray();
      res.send(result);
    })
    //latest six data
    app.get('/latest-model', async (req, res) => {
      const result = await modelCollection.find().sort({ createdAt: 'desc' }).limit(6).toArray();
      res.send(result);
    })
    //catching single data
    app.get('/models/:id', async (req, res) => {
      const { id } = req.params;
      const result = await modelCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);

    })

    //adding data by post
    app.post('/models', async (req, res) => {
      const data = req.body;
      //console.log(data);
      const result = await modelCollection.insertOne(data);
      res.send(result);
    })

    //updating value
    app.put('/models/:id', async (req, res) => {
      const { id } = req.params;
      const data = req.body;
      const objectId = new ObjectId(id);
      const query = { _id: objectId };
      const update={$set:data}
      const result = await modelCollection.updateOne(query,update);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('hello');
})

app.listen(port, () => {
  console.log(`listen on port ${port}`);
})