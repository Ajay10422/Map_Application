// Import
const express = require("express");
const cors = require("cors");
const neo4j = require("neo4j-driver");
const https = require("https");
const fs = require("fs");
const path = require("path");

// Create a new express app
const app = express();
const port = 3000;

const corsOptions = {
  origin: "https://localhost:3000", // Replace with your React app's URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
  secure: true, // Set to true for HTTPS
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("../mapmap/build"));

// Reference to the Neo4j driver
let driver = undefined;

/**
 * Serve the index.html file.
 */
app.get("/", (req, res) => {
  res.sendFile(path.resolve("../mapmap/build", "index.html"));
});

// Routes

/**
 * Test route for basic server connectivity.
 */
app.get("/Test", (req, res) => {
  res.send("Hello!");
});

/**
 * Search route to perform a full-text search.
 */
app.post("/search", async (req, res) => {
  try {
    const session = driver.session();
    const result = await session.run(
      `
      CALL db.index.fulltext.queryNodes("search_index", $searchString) 
      YIELD node, score
      RETURN coalesce(node.name, node.full_address) AS value, score, labels(node)[0] AS label, node.id AS id
      ORDER BY score DESC LIMIT 10
    `,
      { searchString: req.body.SearchText }
    );

    res.send(
      result.records.map((p) => ({ value: p.get("value"), id: p.get("id") }))
    );
  } catch (error) {
    console.log(error);
  }
});

/**
 * Get latitude and longitude for a given ID.
 */
app.post("/latlong", async (req, res) => {
  try {
    const session = driver.session();
    const result = await session.run(`
      MATCH (a:Address {id:"${req.body.id}"}) RETURN a.location.x as x, a.location.y as y
    `);

    if (result.records.length !== 0) {
      res.send({
        y: result.records[0].get("x"),
        x: result.records[0].get("y"),
      });
    } else {
      res.send({});
    }
  } catch (error) {
    console.log(error);
  }
});

/**
 * Get the route between two points.
 */
app.post("/getRoute", async (req, res) => {
  try {
    const session = driver.session();
    const result = await session.run(`
      MATCH (to {id:"${req.body.src}"})-[:NEAREST_INTERSECTION]->(source:Intersection) 
      MATCH (from {id: "${req.body.dst}"})-[:NEAREST_INTERSECTION]->(target:Intersection)
      CALL apoc.algo.dijkstra(source, target, 'ROAD_SEGMENT', 'length')
      YIELD path, weight
      RETURN [n in nodes(path) | [n.location.latitude, n.location.longitude]] AS route
    `);

    res.send(result.records.length !== 0 ? result.records[0].get("route") : []);
  } catch (error) {
    console.log(error);
  }
});

// HTTPS Server Configuration

const httpsOptions = {
  key: fs.readFileSync("./cert.key"),
  cert: fs.readFileSync("./cert.crt"),
};

const httpsServer = https.createServer(httpsOptions, app);

/**
 * Start the application and establish a connection to Neo4j.
 */
const start = async () => {
  const NEO4J_URI = "neo4j://localhost";
  const NEO4J_USER = "App";
  const NEO4J_PASSWORD = "openM@pdb";

  try {
    driver = neo4j.driver(
      NEO4J_URI,
      neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
    );
    const serverInfo = await driver.getServerInfo();
    console.log("Connection established");
    console.log(serverInfo);
  } catch (err) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`);
  }

  // Start the HTTPS server
  httpsServer.listen(port, () => {
    console.log(`HTTPS Server running on port ${port}`);
  });

  // Handle closing of the server
  httpsServer.on("close", async () => {
    await driver.close();
  });
};

// Start the application
start();

// For development

// app.listen(port, "0.0.0.0", async () => {
//   console.log(`Example app listening on port ${port}!`);

//   const NEO4J_URI = "neo4j://localhost";
//   const NEO4J_USER = "App";
//   const NEO4J_PASSWORD = "openM@pdb";

//   try {
//     driver = neo4j.driver(
//       NEO4J_URI,
//       neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
//     );
//     const serverInfo = await driver.getServerInfo();
//     console.log("Connection established");
//     console.log(serverInfo);
//   } catch (err) {
//     console.log(`Connection error\n${err}\nCause: ${err.cause}`);
//   }
// });
