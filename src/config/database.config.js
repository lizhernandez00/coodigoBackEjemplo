"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Postgres
const pg_promise_1 = __importDefault(require("pg-promise"));
// Constants
const database_constants_1 = require("../constants/config/database.constants");
// Puerto de ambiente del servidor de base de datos o ingresar un puerto temporal
const port = parseInt(process.env.PGPORT || database_constants_1.DatabaseConstants.PORT_DATABASE, 10);
// Configuracion de conexion con servidor de postgres
const config = {
    database: process.env.PGDATABASE || database_constants_1.DatabaseConstants.DATABASE,
    host: process.env.PGHOST || database_constants_1.DatabaseConstants.HOST,
    port,
    user: process.env.PGUSER || database_constants_1.DatabaseConstants.USER_DATABASE,
    password: process.env.PGPASSWORD || database_constants_1.DatabaseConstants.PASSWORD_DATABASE
};
const pgp = (0, pg_promise_1.default)();
const db = pgp(config);
exports.default = db;
