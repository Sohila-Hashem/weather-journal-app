export const responseFormatter = (response, data, status, isError) => {
	const resObj = {
		data,
		isError,
	};
	response.status(status).json(resObj);
};
