import { Response } from 'express';
import { nodeEnv, refreshTokenExpiresIn } from '../../config';
import { AuthResponseData } from '../../types/responses';

export const successResponse = <SuccessData>(
  res: Response,
  statusCode: number,
  message: string,
  data?: SuccessData
): void => {
  res.status(statusCode).send({
    status: 'success',
    message,
    data,
  });
};

export const cookieSuccessResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: AuthResponseData
): void => {
  res
    .cookie('accessToken', data.jwt, {
      httpOnly: true,
      secure: nodeEnv === 'production',
      expires: new Date(
        Date.now() + refreshTokenExpiresIn * 24 * 60 * 60 * 1000
      ),
      sameSite: 'none',
    })
    .status(statusCode)
    .send({
      status: 'success',
      message,
      data,
    });
};

export const errorResponse = (
  res: Response,
  statusCode: number,
  error: string
): void => {
  res.status(statusCode).send({
    status: 'error',
    error,
  });
};
