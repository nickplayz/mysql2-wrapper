import * as alt from 'alt-server';
import { getConvar, getIntConvar } from './utils';

const connectionString = getConvar('mysql_connection_string', '');
const slowQueryWarning = getIntConvar('mysql_slow_query_warning', 150);
const debug = getConvar('mysql_debug', 'false') === 'true';
const resourceName = alt.resourceName;

export { slowQueryWarning, debug, resourceName, connectionString };