const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
  },
});

async function run() {
  try {
    // await client.connect();

    // DB and Collections
    const posts = client.db("posts");
    const users = client.db("users");
    const postCollection = posts.collection("postCollection");
    const userCollection = users.collection("userCollection");

    // handle posts
    // Upload a post
    app.post("/posts", async (req, res) => {
      const postsData = req.body;
      const result = await postCollection.insertOne(postsData);
      res.send(result);
    });

    // get all posts
    app.get("/posts", async (req, res) => {
      const postsData = postCollection.find();
      const result = await postsData.toArray();
      res.send(result.reverse());
    });

    // get single post
    app.get("/posts/:id", async (req, res) => {
      const id = req.params.id;
      const postsData = await postCollection.findOne({ _id: new ObjectId(id) });
      res.send(postsData);
    });

    // update a post
    app.patch("/posts/:id", async (req, res) => {
      const id = req.params.id;
      const updatedDoc = req.body;
      const postsData = await postCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedDoc }
      );
      res.send(postsData);
    });

    // delete a post
    app.delete("/posts/:id", async (req, res) => {
      const id = req.params.id;
      const result = await postCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // Handle Users
    // Add user
    app.post("/user", async (req, res) => {
      const user = req.body;
      const isExist = await userCollection.findOne({email: user?.email})
      if(isExist?._id){
        return res.send("User data already in DB")
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    console.log("Successfully connected to MongoDB");
  } finally {
  }
}
run().catch(console.LOG);

app.get("/", (req, res) => {
  res.send("traveLLer Server!");
});

app.listen(port, () => {
  console.log(`Rraveller Server is running on ${port}`);
});
