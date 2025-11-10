const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running");
});

const uri =
  "mongodb+srv://foodiedbUser:VG82YsiJI21cSyrN@cluster0.kailwc7.mongodb.net/?appName=Cluster0";

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

    const db = client.db("foddie_db");
    const foodsCollection = db.collection("foods");

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // GET all foods

    app.get("/foods", async (req, res) => {
      const cursor = foodsCollection.find().sort({ rating: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });
    // GET single food by id

    app.get("/foods/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await foodsCollection.findOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
