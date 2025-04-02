const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");

const app = express();
const mustache = mustacheExpress();
const { Client } = require("pg");

// @ts-ignore
mustache.cache = null;
app.engine("mustache", mustache);
app.set("view engine", "mustache");

app.use(express.static("public"));
// @ts-ignore
app.use(bodyParser.urlencoded({ extened: false }));

app.get("/meds", (req, res) => {
  const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "medical1",
    port: 5432,
    password: "admin123",
  });

  client
    .connect()
    .then(() => {
      return client.query("SELECT * FROM meds");
    })
    .then((results) => {
      console.log("results: ", results);
      res.render("meds", results);
    });
});

app.get("/add", (req, res) => {
  res.render("meds-form");
});

app.post("/meds/add", (req, res) => {
  const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "medical1",
    port: 5432,
    password: "admin123",
  });

  client
    .connect()
    .then(() => {
      console.log("connection successful");
      const sql = "INSERT INTO meds (name, count, brand) VALUES ($1, $2, $3)";
      const params = [req.body.name, req.body.count, req.body.brand];

      return client.query(sql, params);
    })
    .then((results) => {
      console.log("results: ", results);
      res.redirect("/meds");
    });
});

app.post("/meds/delete/:id", (req, res) => {
  const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "medical1",
    port: 5432,
    password: "admin123",
  });

  client
    .connect()
    .then(() => {
      const sql = "DELETE FROM meds WHERE mid=$1";
      const params = [req.params.id];

      return client.query(sql, params);
    })
    .then((results) => {
      res.redirect("/meds");
    });
});

app.listen(5000, () => {
  console.log("listening to port 5000");
});
