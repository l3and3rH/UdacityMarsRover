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

// getting latest images of selected Rover
app.get("/rover", async (req, res) => {
	const rover = req.query.sRover;
	rover.toLocaleLowerCase();
	try {
		const data = await fetch(
			`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${process.env.API_KEY}`
		).then((res) => res.json());
		res.send(data);
	} catch (err) {
		console.log("error:", err);
	}
});
//calling missons manifest to get max earth_date for each rover & mission infos
app.get("/manifest", async (req, res) => {
	const selectedRover = req.query.sRover;
	try {
		const data = await fetch(
			`https://api.nasa.gov/mars-photos/api/v1/manifests/${selectedRover}?api_key=${process.env.API_KEY}`
		).then((res) => res.json());
		res.send(data);
	} catch (err) {
		console.log("error:", err);
	}
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
