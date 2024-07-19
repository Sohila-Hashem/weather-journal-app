import { responseFormatter } from "../utils/responseFormatter.js";

export const verifyData = (req, res, next) => {
	const { cityName } = req.query;

	if (!cityName) {
		responseFormatter(res, "all fields are required", 400, true);
		return;
	}

	if (typeof cityName !== "string") {
		responseFormatter(res, "cityName must be a string", 400, true);
		return;
	}

	next();
};
