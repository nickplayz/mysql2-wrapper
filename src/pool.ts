import { createPool } from 'mysql2/promise';
import { parseSemiColons } from './utils';
import { ConnectionStringParser } from 'connection-string-parser';
import { connectionString } from './config';

if (!connectionString) {
    throw new Error(`Set up mysql_connection_string in server.cfg`);
}

const createConnection = () => {
    if (connectionString.includes('database=')) {
        const options: any = parseSemiColons(connectionString);
        return createPool({
            host: options.host || 'localhost',
            port: options.port || 3306,
            user: options.username || options.user || options.userid || 'root',
            password: options.password || options.pass || '',
            database: options.endpoint || options.database,
            charset: 'utf8mb4_unicode_ci',
            connectTimeout: 30000,
            ...options.options,
            namedPlaceholders: true,
        });
    }else{
        const options = new ConnectionStringParser({
            scheme: 'mysql',
            hosts: [],
        }).parse(connectionString);

        if (Object.keys(options).length === 0) {
            throw new Error(`Set up mysql_connection_string in correct format - 'mysql://user:password@host/database'`);
        }
        return createPool({
            host: options.hosts[0].host || 'localhost',
            port: options.hosts[0].port || 3306,
            user: options.username || 'root',
            password: options.password || '',
            database: options.endpoint,
            charset: 'utf8mb4_unicode_ci',
            connectTimeout: 30000,
            ...options.options,
            namedPlaceholders: true,
        });
    }
};

export const pool = createConnection();