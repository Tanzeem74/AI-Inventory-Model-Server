const express = require('express');
const cors = require('cors');
const admin = require("firebase-admin");
const serviceAccount = require("./service.json");
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = 3000;

app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ox4mfpm.mongodb.net/?appName=Cluster0`;


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const verifyFirebaseToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.send(401).status({ message: 'unauthorized access' });
  }
  const token = req.headers.authorization.split(' ')[1]
  if (!token) {
    return res.send(401).status({ message: 'unauthorized access' });
  }
  try {
    const userinfo = await admin.auth().verifyIdToken(token);
    req.token_email = userinfo.email;
    //console.log(userinfo);
    next();
  }
  catch {
    return res.send(401).status({ message: 'unauthorized access' });
  }
}

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const db = client.db('Model_db');
    const modelCollection = db.collection('model');
    const purchaseCollection = db.collection('purchase');

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
    app.get('/models/:id', verifyFirebaseToken, async (req, res) => {
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

    //addind data on purchase
    app.post('/purchase/:id', async (req, res) => {
      const data = req.body;
      const id = req.params.id;
      const result = await purchaseCollection.insertOne(data);
      const query = { _id: new ObjectId(id) };
      const update = {
        $inc: {
          purchase: 1
        }
      }
      const count = await modelCollection.updateOne(query, update)
      res.send(result, count);
    })

    //updating value
    app.put('/models/:id', verifyFirebaseToken, async (req, res) => {
      const { id } = req.params;
      const data = req.body;
      const objectId = new ObjectId(id);
      const query = { _id: objectId };
      const update = { $set: data }
      const result = await modelCollection.updateOne(query, update);
      res.send(result);
    })

    //deleting
    app.delete('/models/:id', async (req, res) => {
      const { id } = req.params;
      const result = await modelCollection.deleteOne({ _id: new ObjectId(id) })
      res.send(result);
    })

    //geting by email
    app.get('/my-models', verifyFirebaseToken, async (req, res) => {
      const email = req.query.email;
      const result = await modelCollection.find({ createdBy: email }).toArray();
      res.send(result);
    })

    //getting data from purchase by email
    app.get('/purchase', verifyFirebaseToken, async (req, res) => {
      const email = req.query.email;
      const result = await purchaseCollection.find({ purchased_by: email }).toArray();
      res.send(result);
    })

    //for searching
    app.get('/search', async (req, res) => {
      const search_txt = req.query.search;
      const result = await modelCollection.find({ name: { $regex: search_txt, $options: 'i' } }).toArray();
      res.send(result)
    })

    //for filtering
    app.get('/filter', async (req, res) => {
      const framework = req.query.framework;
      let query = {};
      if (framework) {
        query.framework = framework;
      }
      const result = await modelCollection.find(query).toArray();
      res.send(result);
    });




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