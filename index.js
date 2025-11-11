const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
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
  await client.connect();

  const db = client.db("foddie_db");
  const foodsCollection = db.collection("foods");
  const reviewsCollection = db.collection("reviews");

  console.log("Connected to MongoDB!");

  // ------------------- FOODS ROUTES -------------------
  app.get("/foods", async (req, res) => {
    const result = await foodsCollection.find().sort({ rating: -1 }).toArray();
    res.send(result);
  });

  app.get("/foods/:id", async (req, res) => {
    const id = req.params.id;
    const result = await foodsCollection.findOne({ _id: id });
    res.send(result);
  });

  // app.post("/foods", async (req, res) => {
  //   const newFood = req.body;
  //   if (!newFood._id) newFood._id = Date.now().toString(); // string ID
  //   const result = await foodsCollection.insertOne(newFood);
  //   res.send(result);
  // });

  app.post("/foods", async (req, res) => {
    const newFoods = req.body;
    const result = await foodsCollection.insertOne(newFoods);
    res.send(result);
  });

  app.delete("/foods/:id", async (req, res) => {
    const id = req.params.id;
    const result = await foodsCollection.deleteOne({ _id: id });
    res.send(result);
  });

  app.patch("/foods/:id", async (req, res) => {
    const id = req.params.id;
    const { photo } = req.body;
    const result = await foodsCollection.updateOne(
      { _id: id },
      { $set: { photo } }
    );
    res.send(result);
  });

  app.get("/latest-foods", async (req, res) => {
    const result = await foodsCollection
      .find()
      .sort({ rating: -1 })
      .limit(6)
      .toArray();
    res.send(result);
  });

  app.get("/latest-foods/:id", async (req, res) => {
    const id = req.params.id;
    const result = await foodsCollection.findOne({ _id: id });
    res.send(result);
  });

  // ------------------- REVIEWS ROUTES (ObjectId _id) -------------------
  app.get("/reviews", async (req, res) => {
    const result = await reviewsCollection.find().sort({ date: -1 }).toArray();
    res.send(result);
  });

  // Get single review by string id
  app.get("/reviews/:id", async (req, res) => {
    const id = req.params.id;
    const result = await reviewsCollection.findOne({ _id: id });
    res.send(result);
  });

  // Get reviews by user email
  app.get("/reviews/user/:email", async (req, res) => {
    const email = req.params.email;
    const result = await reviewsCollection
      .find({ userEmail: email })
      .sort({ date: -1 })
      .toArray();
    res.send(result);
  });

  // Get reviews by food id
  app.get("/reviews/food/:foodId", async (req, res) => {
    const foodId = req.params.foodId;
    const result = await reviewsCollection
      .find({ foodId })
      .sort({ date: -1 })
      .toArray();
    res.send(result);
  });

  // Add new review
  app.post("/reviews", async (req, res) => {
    const review = req.body;
    if (!review._id) review._id = Date.now().toString(); // string ID
    review.date = new Date();
    const result = await reviewsCollection.insertOne(review);
    res.send({ success: true, message: "Review added successfully!", result });
  });
  // Update review by string id
  app.patch("/reviews/:id", async (req, res) => {
    const id = req.params.id;
    const updatedReview = req.body;

    const result = await reviewsCollection.updateOne(
      { _id: id },
      { $set: updatedReview }
    );

    if (result.modifiedCount > 0) {
      res.send({ success: true, message: "Review updated successfully!" });
    } else {
      res.send({ success: false, message: "No review found with this ID." });
    }
  });

  // Delete review by string id
  app.delete("/reviews/:id", async (req, res) => {
    const id = req.params.id;
    const result = await reviewsCollection.deleteOne({ _id: id });

    if (result.deletedCount > 0) {
      res.send({ success: true, message: "Review deleted successfully!" });
    } else {
      res.send({ success: false, message: "No review found to delete." });
    }
  });
}

run();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
