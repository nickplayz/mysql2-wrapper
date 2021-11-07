import { debug, slowQueryWarning } from "./config";
import { parseParameters } from "./parser";
import { pool } from "./pool";

//Executes a single query
const executeQuery = async (query: string, parameters: unknown, resource: string): Promise<any> => {
    try {
        const t0 = new Date().getTime(); 
        [query, parameters] = parseParameters(query, parameters);
        const [ rows ] = await pool.query(query, parameters);
        const t1 = new Date().getTime();
        const executionTime = t1 - t0
        if(executionTime >= slowQueryWarning || debug){
          console.log(
            `['DEBUG'] ${resource} took ${executionTime}ms to execute a query!
            ${query} ${JSON.stringify(parameters)}`
          );
        }
        return rows;
      } catch (error) {
        console.log(
          `[ERROR] ${resource} was unable to execute a query!
            ${error.message}
            ${error.sql || `${query} ${JSON.stringify(parameters)}`}`
        );
      }
};

export { executeQuery }