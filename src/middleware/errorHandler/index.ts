import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { AxiosError } from 'axios';
import logger from '../../utils/logger';
import { errorResponse } from '../../utils/responses';
import ApiError from './ApiError';
import { nodeEnv } from '../../config';

const errorHandler = (
	err: ErrorRequestHandler | AxiosError,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	let message	 = 'Oops, something went wrong. Please try again later';
	let errCode = 500;

	if (err instanceof ApiError) {
		message = err.message;
		errCode = err.code;
	}
	else if ((err as AxiosError).isAxiosError) {
		//handle axios errors
		if ((err as AxiosError).response)
			message =
				// @ts-ignore
				(err as AxiosError).response?.data.error ||
				// @ts-ignore
				(err as AxiosError).response?.data.message;
		else message = (err as AxiosError).message;

		errCode = (err as AxiosError).response?.status || 500;
	}
	else if (err instanceof Error) {
		//handle multer errors
		message = err.message;
		errCode = 422;
	} else if (
		err instanceof SyntaxError ||
		err instanceof EvalError ||
		err instanceof RangeError ||
		err instanceof ReferenceError ||
		err instanceof TypeError ||
		err instanceof URIError
	) {
		//handle global error types
		message = err.message;
		errCode = 400;
	}

	logger.error(
		`[${req.method} ${req.url}] ${
			//convert other data types to strings to ensure readability in logs
			typeof message === 'string' ? message : JSON.stringify(message)
		}`
	);
	if (nodeEnv !== 'test') console.error(err);

	errorResponse(res, errCode, message);
};

export default errorHandler;
