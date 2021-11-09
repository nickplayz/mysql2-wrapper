import { debug, slowQueryWarning } from './config';
import { pool } from './pool';

const executeQuery = async (query: string, parameters: any, resource: string): Promise<any> => {
    try {
        const t0 = process.hrtime.bigint(); 
        const [ rows ] = await pool.query(query, parameters);
        const t1 = process.hrtime.bigint();
        const executionTime = Number(t1 - t0) / 1000000;
        if(executionTime >= slowQueryWarning || debug){
            console.log(
                `['DEBUG'] ${resource} took ${Math.round(executionTime)}ms to execute a query!`+
                `${query} ${JSON.stringify(parameters)}`
            );
        }
        return rows;
    } catch (error) {
        console.log(
            `[ERROR] ${resource} was unable to execute a query!`+
            `${error.message}\n`+
            `${error.sql || `${query} ${JSON.stringify(parameters)}`}`
        );
    }
};

export { executeQuery };