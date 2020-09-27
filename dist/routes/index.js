"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
var express_1 = __importDefault(require("express"));
var users_1 = require("./users");
var messages_1 = require("./messages");
var middleware_1 = require("~/modules/middleware");
var router = express_1.default.Router();
router.use('/users', users_1.UsersRoutes);
//after login
router.use(middleware_1.authenticateToken);
//before messages
router.use(middleware_1.initUserMessagesIfNeeded);
router.use('/messages', messages_1.MessagesRoutes);
exports.Routes = router;
