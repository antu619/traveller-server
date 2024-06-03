const express = require('express');
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.cueijln.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();
    console.log("Successfully connected to MongoDB");
  } finally {

  }
}
run().catch(console.LOG);


app.get('/', (req, res) => {
  res.send('traveLLer Server!')
})

app.listen(port, () => {
  console.log(`Rraveller Server is running on ${port}`)
})