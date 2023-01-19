// Postgres
import pgPromise from 'pg-promise';
// Constants
import { DatabaseConstants } from '../constants/config/database.constants';

// Puerto de ambiente del servidor de base de datos o ingresar un puerto temporal
const port = parseInt(process.env.PGPORT || DatabaseConstants.PORT_DATABASE, 10);

// Configuracion de conexion con servidor de postgres
const config = {
    database: process.env.PGDATABASE || DatabaseConstants.DATABASE,
    host: process.env.PGHOST || DatabaseConstants.HOST,
    port,
    user: process.env.PGUSER || DatabaseConstants.USER_DATABASE,
    password: process.env.PGPASSWORD || DatabaseConstants.PASSWORD_DATABASE
}

const pgp = pgPromise();
const db = pgp(config);

export default db;


