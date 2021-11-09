import { pool } from './pool';
import * as alt from 'alt-server';
import { executeQuery } from './execute';
import { queryType } from './utils';
import { debug } from './config';
import altCallback from './interfaces/altCallback';

(async () => {
    try{
        await pool.getConnection();
        console.log(`Database server connection established!`);
    }catch(e){
        console.log(`Unable to establish a connection to the database! [${e.code}]\n${e.message}`);
    }
})();

const safeCallback = (callback: altCallback | unknown, result: unknown, resource: string, query: string): altCallback | void => {
    if (typeof callback === 'function'){
        return callback(result);
    }
    else if (debug)
        return console.log(`[WARNING] ${resource} executed a query, but no callback function was defined!\n
      ${query}`);
};

const execute = async (query: string, parameters: unknown, cb: altCallback, resource: string): Promise<altCallback | void> => {
    if(!alt.hasResource(resource)){
        throw new Error(`Invoked by invalid resource`);
    }
    const result = await executeQuery(query, parameters, resource);
    return safeCallback(cb || parameters, result, resource, query);
};

const insert = async (query: string, parameters: unknown, cb: altCallback, resource: string): Promise<altCallback | void> => { 
    if(!alt.hasResource(resource)){
        throw new Error(`Invoked by invalid resource`);
    }
    const qType = queryType(query);
    if(qType !== 2){
        throw new Error(`Incorrect query type, insert only do INSERT queries`);
    }
    const result = await executeQuery(query, parameters, resource);
    safeCallback(cb || parameters, result && result.insertId, resource, query);
};

const update = async (query: string, parameters: unknown, cb: altCallback, resource: string): Promise<altCallback | void> => { 
    if(!alt.hasResource(resource)){
        throw new Error(`Invoked by invalid resource`);
    }
    const qType = queryType(query);
    if(qType !== 3){
        throw new Error(`Incorrect query type, update only do UPDATE queries`);
    }
    const result = await executeQuery(query, parameters, resource);
    safeCallback(cb || parameters, result && result.affectedRows, resource, query);
};

const scalar = async (query: string, parameters: unknown, cb: altCallback, resource: string): Promise<altCallback | void> => { 
    if(!alt.hasResource(resource)){
        throw new Error(`Invoked by invalid resource`);
    }
    const qType = queryType(query);
    if(qType !== 1){
        throw new Error(`Incorrect query type, scalar only do SELECT queries`);
    }
    const result = await executeQuery(query, parameters, resource);
    safeCallback(cb || parameters, result && result[0] && Object.values(result[0])[0], resource, query);
};


export default { execute, insert, update, scalar };

