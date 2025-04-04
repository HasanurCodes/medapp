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

// dashboard
app.get("/dashboard", (req, res) => {
	const client = new Client({
		user: "postgres",
		host: "localhost",
		database: "medical1",
		port: 5432,
		password: "admin123",
	});

	client
		.connect()
		.then((_) => {
			return client.query(
				"SELECT SUM(count) FROM meds; SELECT DISTINCT COUNT(brand) FROM meds"
			);
		})
		.then((results) => {
			console.log(results[0]);
			console.log(results[1]);
			res.render("dashboard", {
				rows1: results[0].rows,
				rows2: results[1].rows,
			});
		});
});

// public routes
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
			const sql =
				"INSERT INTO meds (name, count, brand) VALUES ($1, $2, $3)";
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

app.get("/meds/edit/:id", (req, res) => {
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
			const sql = "SELECT * FROM meds WHERE mid=$1";
			const params = [req.params.id];

			return client.query(sql, params);
		})
		.then((results) => {
			console.log(results.rows[0]);
			res.render("meds-edit", { med: results.rows[0] });
		});
});

app.post("/meds/edit/:id", (req, res) => {
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
			const sql =
				"UPDATE meds SET name=$1, count=$2, brand=$3 WHERE mid=$4";
			const params = [
				req.body.name,
				req.body.count,
				req.body.brand,
				req.params.id,
			];

			return client.query(sql, params);
		})
		.then((results) => {
			console.log(results);
			res.redirect("/meds");
		});
});

app.listen(5000, () => {
	console.log("listening to port 5000");
});
