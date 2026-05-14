const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://studymate-client-seven.vercel.app"
    ],
    credentials: true,
  }),
);

const cookieParser = require("cookie-parser"); 
app.use(cookieParser());
app.use(express.json());

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));


const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.atbpap4.mongodb.net/?appName=Cluster0`;

const jwt = require("jsonwebtoken");

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});





const verifyJWTToken = async (req, res, next) => {
  console.log("jwt middleware", req.headers);

  if (!req.cookies.token) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  const token = req.cookies.token;
  console.log("lol ", token);
  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "unauthorized access" });
    }

    // console.log("after decoded ", decoded);
    req.token_email = decoded.email;
    console.log("after decoded ", decoded);
    next();
  });
};



// app.use(cors());

const logger = (req, res, next) => {
  console.log("logging");
  next();
};
//Must remove "/" from your production URL


const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};

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

    // jwt related apis
    // app.post("/getToken", (req, res) => {
    //   const loggedUser = req.body;
    //   const token = jwt.sign(loggedUser, process.env.JWT_SECRET, {
    //     expiresIn: "1h",
    //   });
    //   res.send({ token: token });
    // });

    app.post("/jwt", logger, async (req, res) => {
      const user = req.body;
      console.log("user for token", user);
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

      res.cookie("token", token, cookieOptions).send({ success: true });
    });

    app.get("/users", async (req, res) => {
      const cursor = usersColl.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/studyprofiles", async (req, res) => {
      const email = req.query.email;

      const query = {};

      if (email) {
        query.email = { $ne: email };
      }

      const cursor = studyProfiles.find(query);
      const result = await cursor.toArray();

      res.send(result);
    });
    app.get("/mystudyprofile", async (req, res) => {
      const email = req.query.email;
      const id = req.query.id;
      const query = {};

      if (email) {
        query.email = email;
      }
      if (id) {
        query.profileId = id;
      }

      const result = await studyProfiles.findOne(query);
      // const result = await cursor.toArray();

      res.send(result);
    });

    app.get("/hightolow", async (req, res) => {
      const email = req.query.email;
      const query = {};

      if (email) {
        query.email = { $ne: email };
      }

      const result = await studyProfiles
        .aggregate([
          {
            $match: query,
          },
          {
            $addFields: {
              rank: {
                $indexOfArray: [
                  ["Expert", "Intermediate", "Beginner"],
                  "$experienceLevel",
                ],
              },
            },
          },
          { $sort: { rank: 1 } },
          { $unset: "rank" },
        ])
        .toArray();

      res.send(result);
    });

    app.get("/lowtohigh", async (req, res) => {
      const email = req.query.email;
      const query = {};

      if (email) {
        query.email = { $ne: email };
      }

      const result = await studyProfiles
        .aggregate([
          {
            $match: query,
          },
          {
            $addFields: {
              rank: {
                $indexOfArray: [
                  ["Expert", "Intermediate", "Beginner"],
                  "$experienceLevel",
                ],
              },
            },
          },
          { $sort: { rank: -1 } },
          { $unset: "rank" },
        ])
        .toArray();

      res.send(result);
    });

    app.get("/banner", async (req, res) => {
      const cursor = bannerColl.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/topstudypartners", async (req, res) => {
      const cursor = usersColl.find({}).sort({ rating: -1 }).limit(3);
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
      const query = { _id: new ObjectId(id) };
      const result = await usersColl.findOne(query);
      res.send(result);
    });

    app.get("/connections", verifyJWTToken, async (req, res) => {
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

    app.patch("/specificuser", verifyJWTToken, async (req, res) => {
      const email = req.query.email;
      const updatedData = req.body;
      const query = {};

      if (email) {
        query.email = email;
      }
      const { partnerCount } = req.body;

      const updateDoc = {
        $set: updatedData,
      };

      const result = await usersColl.updateOne(query, updateDoc);
      res.send(result);
    });

    app.patch("/connections", verifyJWTToken, async (req, res) => {
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
    app.delete("/users/:id", verifyJWTToken, async (req, res) => {
      const id = req.params.id;

      const query = { _id: id };
      const result = await usersColl.deleteOne(query);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };

      const exists = await usersColl.findOne(query);
      if (exists) {
        return res.status(409).send({ message: "User already exists" });
      }

      const result = await usersColl.insertOne(user);
      res.send(result);
    });

    app.post("/studyprofiles", verifyJWTToken, async (req, res) => {
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

    app.post("/connections", verifyJWTToken, async (req, res) => {
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

    app.delete("/connections", verifyJWTToken, async (req, res) => {
      const id = req.query.id;
      const query = {};
      if (id) {
        query._id = new ObjectId(id);
      }
      // const query = { id: new ObjectId(id) };

      const result = await connections.deleteOne(query);
      res.send(result);
    });



    app.post("/logout", async (req, res) => {
      const user = req.body;
      console.log("logging out", user);
      res
        .clearCookie("token", { ...cookieOptions, maxAge: 0 })
        .send({ success: true });
    });



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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
