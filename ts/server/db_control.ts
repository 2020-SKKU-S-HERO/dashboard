import * as mysql from 'mysql';
import * as db_info from './secret/db_info';

const connection = mysql.createConnection(db_info.info);

connection.query(`
SELECT DATE_FORMAT(date_time, '%Y-%m-%d') time, SUM(emissions)
FROM co2_emissions
GROUP BY time;`, (error: mysql.MysqlError | null, results: any, fields: mysql.FieldInfo | undefined): void => {
    if (error) throw error;
    
    console.log(results[0].solution);
});

connection.end();