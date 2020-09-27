import express from 'express';
import jwt from 'jsonwebtoken';
import { generateResponseMessage } from '~/modules/responseData';
import { generateAccessToken } from '~/modules/token';

let refreshTokens: string[] = [];

const router = express.Router();

router.post('/login', (request: express.Request, response: express.Response) => {
  const name = request.body.username;
  if (!name) {
    return response.status(401).json(generateResponseMessage('Wrong username/password'));
  }
  const user = { name };
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  return response.json({ accessToken, refreshToken });
});

router.delete('/logout', (request: express.Request, response: express.Response) => {
  const refreshToken = request.body.token;
  if (!refreshToken) {
    return response.sendStatus(400);
  }
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  return response.sendStatus(200);
});

router.post('/token', (request: express.Request, response: express.Response) => {
  const refreshToken = request.body.token;
  if (!refreshToken) {
    return response.sendStatus(401);
  }
  if (!refreshTokens.includes(refreshToken)) {
    return response.sendStatus(403);
  }
  return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
    if (error) {
      return response.sendStatus(403);
    }
    const accessToken = generateAccessToken({ name: user.name });
    return response.json({ accessToken });
  });
});

export const UsersRoutes = router;
