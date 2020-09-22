import * as express from 'express';
import * as bodyParser from 'body-parser';

import * as unreadMessages from './unreadMessages.json';
import * as messages from './messages.json';

const app = express();

const validIds = [4946, 645654, 654545];

app.use(bodyParser.json());

app.get('/:id/all_messages', (req, res) => {
  return res.json(messages);
});

app.get('/:id/unread_messages', (req, res) => {
  return res.json(unreadMessages);
});

app.post('/:id/write', (req, res) => {
  const id = +req.params.id;
  if (!id && !validIds.includes(+id)) {
    res.statusCode = 400;
    return res.send('invalid id');
  }
  if (!req.body) {
    res.statusCode = 400;
    return res.send('invalid data given');
  }
  const { sender, receiver, message, subject, creationDate } = req.body || {};
  if (!sender || !receiver || !message || !subject || !creationDate) {
    res.statusCode = 400;
    return res.send('invalid data given');
  }
  if (!+sender || !+receiver) {
  }
  messages.push({ sender: +sender, receiver, message, subject, creationDate });
  return res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
