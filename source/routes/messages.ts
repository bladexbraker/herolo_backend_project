import express from 'express';
import messages from '~/messages.json';
import { getUsernameFRomRequest } from '~/modules/requestData';
import { generateResponseMessage } from '~/modules/responseData';

const router = express.Router();

router.get('/all', (request: express.Request, response: express.Response) => {
  const username = getUsernameFRomRequest(request);
  return response.json(messages[username]);
});

router.get('/read', (request: express.Request, response: express.Response) => {
  const id = +request.body.id;
  if (!id) {
    return response.status(200).json(generateResponseMessage('message doesnt exist'));
  }
  const username = getUsernameFRomRequest(request);
  const userMessages = messages[username];
  const foundMessage = userMessages.find((message) => message.id === id);
  if (foundMessage) {
    foundMessage.isRead = true;
    return response.json(foundMessage);
  }
  return response.status(400).json(generateResponseMessage("message doesn't exist"));
});

router.get('/unread', (request: express.Request, response: express.Response) => {
  const username = getUsernameFRomRequest(request);
  return response.json(messages[username].filter((message) => !message.isRead));
});

router.post('/write', (request: express.Request, response: express.Response) => {
  const { sender, receiver, message, subject, creationDate } = request.body;
  if (!sender || !receiver || !message || !subject || !creationDate) {
    return response.status(200).json(generateResponseMessage('invalid data given'));
  }

  const username = getUsernameFRomRequest(request);
  const givenMessage = { id: messages[username].length + 1, sender, receiver, message, subject, creationDate, isRead: false };
  messages[username].push(givenMessage);
  return response.sendStatus(200);
});

router.delete('/remove', (request: express.Request, response: express.Response) => {
  const id = +request.body.id;
  if (!id) {
    return response.sendStatus(400);
  }
  const username = getUsernameFRomRequest(request);
  const userMessages = messages[username];
  const messageIndex = userMessages.findIndex((message) => message.id === id);
  if (messageIndex > -1) {
    userMessages[messageIndex] = null;
    messages[username] = userMessages.filter(Boolean);
    return response.sendStatus(200);
  }
  return response.status(400).json(generateResponseMessage("message doesn't exist"));
});

export const MessagesRoutes = router;
