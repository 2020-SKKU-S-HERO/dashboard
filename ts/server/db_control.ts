import * as mysql from 'mysql';
import * as db_info from './secret/db_info';
import { Connection, FieldInfo, MysqlError } from 'mysql';

const connection: Connection = mysql.createConnection(db_info.info);

export function getTodayEmissions(onGetEmissions: ((results: any) => void)): void {
    const today: Date = new Date();
    const queryStr: string = `
        SELECT DATE_FORMAT(date_time, '%Y-%m-%d') time, SUM(emissions) total_emissions
        FROM co2_emissions
        WHERE date_time >= '${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}'
        GROUP BY time;`;
    
    connection.query(queryStr, (error: MysqlError | null, results: any, fields: FieldInfo | undefined): void => {
        if (error) throw error;
    
        onGetEmissions(results);
    });
}
