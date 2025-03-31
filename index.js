const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.Admin_DB}:${process.env.Admin_PASS}@cluster0.r5e76.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const usersCollection = client.db("CoffeeStore").collection("users");
    const coffeesCollection = client.db("CoffeeStore").collection("coffees");

    //For coffees CRUD Operation
    app.get("/coffees", async (req, res) => {
      const cursor = coffeesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/coffees/:id", async (req, res) => {
      const coffeeId = req.params.id;
      const query = { _id: new ObjectId(coffeeId) };
      const result = await coffeesCollection.findOne(query);
      res.send(result);
    });

    app.post("/coffees", async (req, res) => {
      const newcoffee = req.body;
      const result = await coffeesCollection.insertOne(newcoffee);
      res.send(result);
    });

    app.put("/coffees/:id", async (req, res) => {
      const coffeeId = req.params.id;
      const updatedCoffee = req.body;
      const filter = { _id: new ObjectId(coffeeId) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedCoffee.name,
          chef: updatedCoffee.chef,
          supplier: updatedCoffee.supplier,
          taste: updatedCoffee.taste,
          category: updatedCoffee.category,
          details: updatedCoffee.details,
          photoURL: updatedCoffee.photoURL,
        },
      };
      const result = await coffeesCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.delete("/coffees/:id", async (req, res) => {
      const coffeeId = req.params.id;
      const query = { _id: new ObjectId(coffeeId) };
      const result = await coffeesCollection.deleteOne(query);
      res.send(result);
    });

    //For users CRUD Operation
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/users/:id", async (req, res) => {
      const userId = req.params.id;
      const query = { _id: new ObjectId(userId) };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.put("/users", async (req, res) => {
      const signInUserData = req.body;
      const UserName = signInUserData?.name;
      const UserEmail = signInUserData.email;
      const UserPassword = signInUserData?.password;
      const UserLastSignIn = signInUserData.UserLastSignIn;
      const filter = { email: UserEmail };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: UserName,
          email: UserEmail,
          password: UserPassword,
          userLastSignIn: UserLastSignIn,
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.patch("/users/:id", async (req, res) => {
      const userId = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: new ObjectId(userId) };
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
          password: updatedUser.password,
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const userId = req.params.id;
      const query = { _id: new ObjectId(userId) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello ,Welcome to Coffee server");
});

app.listen(port);
