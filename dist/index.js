"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var dotenv_1 = __importDefault(require("dotenv"));
var routes_1 = require("./routes");
require("tsconfig-paths/register");
require("ts-node/register");
dotenv_1.default.config();
var app = express_1.default();
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use(routes_1.Routes);
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("Server is running in http://localhost:" + PORT);
});
