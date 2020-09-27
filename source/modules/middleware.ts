import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { getUsernameFRomRequest } from './requestData';
import messages from '~/messages.json';
import { generateResponseMessage } from './responseData';

export function authenticateToken(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return response.sendStatus(401);
  }
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) {
      return response.status(403).json(generateResponseMessage('access token expire'));
    }
    request['user'] = user;
    return next();
  });
}

export function initUserMessagesIfNeeded(request: Request, response: Response, next: NextFunction) {
  const username = getUsernameFRomRequest(request);
  if (!username) {
    return response.sendStatus(401);
  }
  if (!messages[username]) {
    messages[username] = [];
  }
  return next();
}
