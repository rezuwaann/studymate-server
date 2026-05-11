const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.atbpap4.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const mydb = client.db("studymate");
    const usersColl = mydb.collection("users");
    const bannerColl = mydb.collection("carousel");
    const connections = mydb.collection("connections");
    const studyProfiles = mydb.collection("studyProfiles");

    app.get("/users", async (req, res) => {
      const cursor = usersColl.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/studyprofiles", async (req, res) => {
      const email = req.query.email;
      const query = {};

      if (email) {
        query.email = email;
      }

      const cursor = studyProfiles.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/specificuser", async (req, res) => {
      const email = req.query.email;
      const query = {};

      if (email) {
        query.email = email;
      }
      const cursor = usersColl.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await usersColl.findOne(query);
      res.send(result);
    });

    app.get("/banner", async (req, res) => {
      const cursor = bannerColl.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/connections", async (req, res) => {
      const email = req.query.email;
      const query = {};

      if (email) {
        {
          query.connectorEmail = email;
        }
      }
      const cursor = connections.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.patch("/specificuser", async (req, res) => {
      const email = req.query.email;
      const updatedData = req.body;
      const query = {};

      if (email) {
        query.email = email;
      }

      const updateDoc = {
        $set: updatedData,
      };

      const result = await usersColl.updateOne(query, updateDoc);
      res.send(result);
    });

    app.patch("/connections", async (req, res) => {
      const id = req.query.id;
      const updatedData = req.body;
      const query = {};
      if (id) {
        query._id = new ObjectId(id);
      }

      const result = await connections.updateOne(query, { $set: updatedData });
      res.send(result);
    });

    // app.patch('/connections')
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await usersColl.deleteOne(query);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;

      const result = await usersColl.insertOne(user);
      res.send(result);
    });

    app.post("/studyprofiles", async (req, res) => {
      const user = req.body;

      const query = {
        studyMode: user?.studyMode,
        availabilityTime: user?.availabilityTime,
        subject: user?.subject,
        experienceLevel: user?.experienceLevel,
        location: user?.location,
      };
      console.log(query);
      // const query = {
      //   connectorNmae: user?.name,
      //   connectedName: partner?.name,
      //   connectorEmail: user?.email,
      //   connectedEmail: partner?.email,
      //   studyMode: user?.studyMode,
      //   availabilityTime: user?.availabilityTime,
      //   subject: user?.subject,
      //   experienceLevel: user?.experienceLevel,
      //   location: user?.location,
      // };

      const exists = await studyProfiles.findOne(query);

      if (exists) {
        res.send({
          insertedId: false,
        });
        return;
      }

      const result = await studyProfiles.insertOne(user);
      res.send(result);
    });

    app.post("/connections", async (req, res) => {
      const newConnection = req.body;

      const query = {
        connectorName: newConnection.connectorName,
        connectedName: newConnection.connectedName,
      };

      const alreadyExists = await connections.findOne(query);

      if (alreadyExists) {
        res.send({ insertedId: false });
        return;
      }
      const result = await connections.insertOne(newConnection);
      res.send(result);
    });

    app.delete("/connections", async (req, res) => {
      const id = req.query.id;
      const query={}
      if(id){
        query._id=new ObjectId(id);
      }
      // const query = { id: new ObjectId(id) };

      const result = await connections.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
