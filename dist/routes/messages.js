"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesRoutes = void 0;
var express_1 = __importDefault(require("express"));
var messages_json_1 = __importDefault(require("~/messages.json"));
var requestData_1 = require("~/modules/requestData");
var responseData_1 = require("~/modules/responseData");
var router = express_1.default.Router();
router.get('/all', function (request, response) {
    var username = requestData_1.getUsernameFRomRequest(request);
    return response.json(messages_json_1.default[username]);
});
router.get('/read', function (request, response) {
    var id = +request.body.id;
    if (!id) {
        return response.status(200).json(responseData_1.generateResponseMessage('message doesnt exist'));
    }
    var username = requestData_1.getUsernameFRomRequest(request);
    var userMessages = messages_json_1.default[username];
    var foundMessage = userMessages.find(function (message) { return message.id === id; });
    if (foundMessage) {
        foundMessage.isRead = true;
        return response.json(foundMessage);
    }
    return response.status(400).json(responseData_1.generateResponseMessage("message doesn't exist"));
});
router.get('/unread', function (request, response) {
    var username = requestData_1.getUsernameFRomRequest(request);
    return response.json(messages_json_1.default[username].filter(function (message) { return !message.isRead; }));
});
router.post('/write', function (request, response) {
    var _a = request.body, sender = _a.sender, receiver = _a.receiver, message = _a.message, subject = _a.subject, creationDate = _a.creationDate;
    if (!sender || !receiver || !message || !subject || !creationDate) {
        return response.status(200).json(responseData_1.generateResponseMessage('invalid data given'));
    }
    var username = requestData_1.getUsernameFRomRequest(request);
    var givenMessage = { id: messages_json_1.default[username].length + 1, sender: sender, receiver: receiver, message: message, subject: subject, creationDate: creationDate, isRead: false };
    messages_json_1.default[username].push(givenMessage);
    return response.sendStatus(200);
});
router.delete('/remove', function (request, response) {
    var id = +request.body.id;
    if (!id) {
        return response.sendStatus(400);
    }
    var username = requestData_1.getUsernameFRomRequest(request);
    var userMessages = messages_json_1.default[username];
    var messageIndex = userMessages.findIndex(function (message) { return message.id === id; });
    if (messageIndex > -1) {
        userMessages[messageIndex] = null;
        messages_json_1.default[username] = userMessages.filter(Boolean);
        return response.sendStatus(200);
    }
    return response.status(400).json(responseData_1.generateResponseMessage("message doesn't exist"));
});
exports.MessagesRoutes = router;
