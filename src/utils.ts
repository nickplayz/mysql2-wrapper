import * as alt from 'alt-server';
import * as fs from 'fs';
import * as path from 'path';

//  Workaround to get variables directly from server.cfg
const getConvar = (convar: string, initialValue: string): string => {
    const serverCfg = fs.readFileSync(path.join(alt.rootDir, 'server.cfg'), 'utf8');
    const cfg = serverCfg.split(/\r\n|\r|\n/);
    const convarValue = cfg.find(x => x.includes(`${convar}: `));
    if (!convarValue) {
        return initialValue;
    }
    if(convarValue.charAt(0) === '#'){
        return initialValue;
    }
    const sanitizedConvar = convarValue.substring(convar.length + 3).slice(0, -1);
    return sanitizedConvar;
};

const getIntConvar = (convar: string, initialValue: number): number => {
    const serverCfg = fs.readFileSync(path.join(alt.rootDir, 'server.cfg'), 'utf8');
    const cfg = serverCfg.split(/\r\n|\r|\n/);
    const convarValue = cfg.find(x => x.includes(`${convar}: `));
    if (!convarValue) {
        return initialValue;
    }
    if(convarValue.charAt(0) === '#'){
        return initialValue;
    }
    const sanitizedConvar = Number(convarValue.substring(convar.length + 3).slice(0, -1));
    return sanitizedConvar;
};

const parseSemiColons = (string: string): Record<string, unknown> => {
    const parts = string.split(';');
    return parts.reduce((connectionInfo, parameter) => {
        const [key, value] = parameter.split('=');
        connectionInfo[key] = value;
        return connectionInfo;
    }, {});
};

const queryType = (query: string): number | false => {
    switch (query.replace(/\s.*/, '')) {
    case 'SELECT':
        return 1;
    case 'INSERT':
        return 2;
    case 'UPDATE':
        return 3;
    case 'DELETE':
        return 3;
    default:
        return false;
    }
};
  

export { getConvar, getIntConvar, parseSemiColons, queryType};
