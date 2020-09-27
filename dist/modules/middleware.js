"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initUserMessagesIfNeeded = exports.authenticateToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var requestData_1 = require("./requestData");
var messages_json_1 = __importDefault(require("~/messages.json"));
var responseData_1 = require("./responseData");
function authenticateToken(request, response, next) {
    var authHeader = request.headers.authorization;
    var token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return response.sendStatus(401);
    }
    return jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, function (error, user) {
        if (error) {
            return response.status(403).json(responseData_1.generateResponseMessage('access token expire'));
        }
        request['user'] = user;
        return next();
    });
}
exports.authenticateToken = authenticateToken;
function initUserMessagesIfNeeded(request, response, next) {
    var username = requestData_1.getUsernameFRomRequest(request);
    if (!username) {
        return response.sendStatus(401);
    }
    if (!messages_json_1.default[username]) {
        messages_json_1.default[username] = [];
    }
    return next();
}
exports.initUserMessagesIfNeeded = initUserMessagesIfNeeded;
