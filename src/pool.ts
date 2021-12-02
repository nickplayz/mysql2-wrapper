import { createPool } from 'mysql2/promise';
import { connectionString } from './config';

if (!connectionString) {
    throw new Error(`Set up mysql_connection_string in server.cfg`);
}

const createConnection = () => {
    const isURI = connectionString.includes('mysql://')

    if(isURI){
        return createPool({uri: connectionString, namedPlaceholders: true})
    }

    const options: any = connectionString
    .replace(/(?:host(?:name)|ip|server|data\s?source|addr(?:ess)?)=/gi, 'host=')
    .replace(/(?:user\s?(?:id|name)?|uid)=/gi, 'user=')
    .replace(/(?:pwd|pass)=/gi, 'password=')
    .replace(/(?:db)=/gi, 'database=')
    .split(';')
    .reduce((connectionInfo, parameter) => {
      const [key, value] = parameter.split('=');
      connectionInfo[key] = value;
      return connectionInfo;
    }, {});

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
};

export const pool = createConnection();