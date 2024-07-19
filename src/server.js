import dotenv from "dotenv";
dotenv.config();
import express from "express";
import axios from "axios";
import cors from "cors";
import morgan from "morgan";
import { responseFormatter } from "./utils/responseFormatter.js";
import { verifyData } from "./middlewares/verifyDate.js";

const app = express();

app.use(express.json());

const API_KEY = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL;
const PORT = process.env.PORT || 5050;

app.use(morgan("dev"));

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
		methods: ["GET"],
	})
);

app.get("/", (req, res) => {
	res.send("Welcome to the weather journal Api");
});

app.get("/get-weather", verifyData, async (req, res, next) => {
	try {
		const { cityName } = req.query;

		const data = (await axios.get(`${BASE_URL}?q=${cityName}&appid=${API_KEY}&units=metric`))
			.data;

		if (!data) {
			responseFormatter(res, "generic", 400, true);
			return;
		}

		if (data.cod === "404") {
			responseFormatter(res, "city not found", 404, true);
			return;
		}

		responseFormatter(res, data, 200, false);
	} catch (e) {
		next(e);
	}
});

app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));

app.use((err, req, res, next) => {
	console.log(err.message);
	responseFormatter(res, "Internal server error", 500, true);
});

app.get("*", (req, res) => {
	responseFormatter(res, "page not found", 404, true);
});
