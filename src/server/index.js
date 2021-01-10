require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

// your API calls
app.get("/rover", async (req, res) => {
	let rover = req.query.sRover;
	let date = req.query.date;
	rover.toLocaleLowerCase();
	try {
		let data = await fetch(
			`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${date}&api_key=${process.env.API_KEY}`
		).then((res) => res.json());
		res.send(data);
	} catch (err) {
		console.log("error:", err);
	}
});
//calling missons manifest to get max earth_date for each rover & mission infos
app.get("/manifest", async (req, res) => {
	let selectedRover = req.query.sRover;
	try {
		let data = await fetch(
			`https://api.nasa.gov/mars-photos/api/v1/manifests/${selectedRover}?api_key=${process.env.API_KEY}`
		).then((res) => res.json());
		res.send(data);
	} catch (err) {
		console.log("error:", err);
	}
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
