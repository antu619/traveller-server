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
    const subscribers = client.db("subscribers");
    const postCollection = posts.collection("postCollection");
    const userCollection = users.collection("userCollection");
    const subscriberCollection = subscribers.collection("subscriberCollection");

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
    // get all users
    app.get("/users", async (req, res) => {
      const users = userCollection.find();
      const result = await users.toArray();
      res.send(result);
    });

    // Add user
    app.post("/user", async (req, res) => {
      const user = req.body;
      const isExist = await userCollection.findOne({ email: user?.email });
      if (isExist?._id) {
        return res.send("User data already in DB");
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // get single user
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const result = await userCollection.findOne({ email });
      res.send(result);
    });

    // get single user
    app.get("/user/profile/:id", async (req, res) => {
      const id = req.params.id;
      const result = await userCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // update user info
    app.patch("/users/:email", async (req, res) => {
      const email = req.params.email;
      const updateDoc = req.body;
      const result = await userCollection.updateOne(
        { email },
        {
          $set: updateDoc,
        },
        { upsert: true }
      );
      res.send(result);
    });

    // Subscribe
    app.post("/subscribers", async (req, res) => {
      const subscribe = req.body;
      const result = await subscriberCollection.insertOne(subscribe);
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
