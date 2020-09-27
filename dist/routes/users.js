"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRoutes = void 0;
var express_1 = __importDefault(require("express"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var responseData_1 = require("~/modules/responseData");
var token_1 = require("~/modules/token");
var refreshTokens = [];
var router = express_1.default.Router();
router.post('/login', function (request, response) {
    var name = request.body.username;
    if (!name) {
        return response.status(401).json(responseData_1.generateResponseMessage('Wrong username/password'));
    }
    var user = { name: name };
    var accessToken = token_1.generateAccessToken(user);
    var refreshToken = jsonwebtoken_1.default.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    return response.json({ accessToken: accessToken, refreshToken: refreshToken });
});
router.delete('/logout', function (request, response) {
    var refreshToken = request.body.token;
    if (!refreshToken) {
        return response.sendStatus(400);
    }
    refreshTokens = refreshTokens.filter(function (token) { return token !== refreshToken; });
    return response.sendStatus(200);
});
router.post('/token', function (request, response) {
    var refreshToken = request.body.token;
    if (!refreshToken) {
        return response.sendStatus(401);
    }
    if (!refreshTokens.includes(refreshToken)) {
        return response.sendStatus(403);
    }
    return jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function (error, user) {
        if (error) {
            return response.sendStatus(403);
        }
        var accessToken = token_1.generateAccessToken({ name: user.name });
        return response.json({ accessToken: accessToken });
    });
});
exports.UsersRoutes = router;
