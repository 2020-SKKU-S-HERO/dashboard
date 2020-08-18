import * as mysql from 'mysql';
import * as db_info from './secret/db_info';
import { Connection, FieldInfo, MysqlError } from 'mysql';

const connection: Connection = mysql.createConnection(db_info.info);

export function getTodayEmissions(onGetEmissions: ((data: number) => void)): void {
    const today: Date = new Date();
    const queryStr: string = `
        SELECT DATE_FORMAT(date_time, '%Y-%m-%d') time, SUM(emissions) total_emissions
        FROM co2_emissions
        WHERE date_time >= '${ today.getFullYear() }-${ today.getMonth() + 1 }-${ today.getDate() }'
        GROUP BY time;`;
    
    connection.query(queryStr, (error: MysqlError | null, results: any, fields: FieldInfo | undefined): void => {
        if (error) {
            throw error;
        }
        
        try {
            onGetEmissions(results[0]['total_emissions']);
        } catch (e) {
            onGetEmissions(0);
        }
    });
}

export function getThisYearEmissions(onGetEmissions: ((data: number) => void)): void {
    const today: Date = new Date();
    const queryStr: string = `
        SELECT DATE_FORMAT(date_time, '%Y') time, SUM(emissions) total_emissions
        FROM co2_emissions
        WHERE date_time >= '${ today.getFullYear() }' AND date_time < '${ today.getFullYear() + 1 }'
        GROUP BY time;`;
    
    connection.query(queryStr, (error: MysqlError | null, results: any, fields: FieldInfo | undefined): void => {
        if (error) {
            throw error;
        }
        
        try {
            onGetEmissions(results[0]['total_emissions']);
        } catch (e) {
            onGetEmissions(0);
        }
    });
}

export function getThisYearRemainingPermissibleEmissions(onGetEmissions: ((data: number) => void)): void {
    const today: Date = new Date();
    const queryStr: string = `
        SELECT emissions_limit
        FROM permissible_emissions_limit
        WHERE year = '${ today.getFullYear() }';`;
    
    connection.query(queryStr, (error: MysqlError | null, results: any, fields: FieldInfo | undefined): void => {
        if (error) {
            throw error;
        }
        
        getThisYearEmissions((thisYearData: number): void => {
            try {
                onGetEmissions(results[0]['emissions_limit'] - thisYearData);
            } catch (e) {
                onGetEmissions(0);
            }
        });
    });
}

export function getTodayRatioComparedToThisMonthAverage(onGetEmissions: ((data: number) => void)): void {
    const today: Date = new Date();
    const nextMonth: Date = new Date(today.getFullYear(), today.getMonth() + 2, 1);
    const queryStr: string = `
        SELECT DATE_FORMAT(date_time, '%Y-%m') time, AVG(emissions) average_emissions
        FROM co2_emissions
        WHERE date_time >= '${ today.getFullYear() }-${ today.getMonth() + 1 }-1' AND date_time < '${ nextMonth.getFullYear() }-${ nextMonth.getMonth() }-1'
        GROUP BY time;`;
    
    connection.query(queryStr, (error: MysqlError | null, results: any, fields: FieldInfo | undefined): void => {
        if (error) {
            throw error;
        }
        
        getTodayEmissions((data: number): void => {
            
            try {
                onGetEmissions(((data / results[0]['average_emissions']) - 1) * 100);
            } catch (e) {
                onGetEmissions(0);
            }
        });
    });
}

export function getTheMostPastEmissionMonth(onGetEmissions: ((data: number) => void)): void {
    const queryStr: string = `
        SELECT DATE_FORMAT(date_time, '%Y-%m') time
        FROM co2_emissions
        GROUP BY time;`;
    
    connection.query(queryStr, (error: MysqlError | null, results: any, fields: FieldInfo | undefined): void => {
        if (error) {
            throw error;
        }
    
        try {
            onGetEmissions(results[0]['time']);
        } catch (e) {
            onGetEmissions(0);
        }
    });
}

export function getSelectedMonthEmissions(monthDate: Date, onGetEmissions: ((data: number) => void)): void {
    const nextMonth: Date = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 13);
    
    const queryStr: string = `
        SELECT DATE_FORMAT(date_time, '%Y-%m') time, SUM(emissions) total_emissions
        FROM co2_emissions
        WHERE date_time >= '${ monthDate.getFullYear() }-${ monthDate.getMonth() + 1 }-1' AND date_time < '${ nextMonth.getFullYear() }-${ nextMonth.getMonth() + 1 }-1'
        GROUP BY time;`;
    
    connection.query(queryStr, (error: MysqlError | null, results: any, fields: FieldInfo | undefined): void => {
        if (error) {
            throw error;
        }
        
        try {
            onGetEmissions(results[0]['total_emissions']);
        } catch (e) {
            onGetEmissions(0);
        }
    });
}

export function getSelectedYearEmissions(year: number, onGetEmissions: ((data: number) => void)): void {
    const queryStr: string = `
        SELECT DATE_FORMAT(date_time, '%Y') time, SUM(emissions) total_emissions
        FROM co2_emissions
        WHERE date_time >= '${ year }-1-1' AND date_time < '${ year + 1 }-1-1'
        GROUP BY time;`;
    
    console.log(queryStr);
    
    connection.query(queryStr, (error: MysqlError | null, results: any, fields: FieldInfo | undefined): void => {
        if (error) {
            throw error;
        }
        
        try {
            onGetEmissions(results[0]['total_emissions']);
        } catch (e) {
            onGetEmissions(0);
        }
    });
}