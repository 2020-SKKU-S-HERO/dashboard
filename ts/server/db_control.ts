import * as mysql from 'mysql';
import * as db_info from './secret/db_info';
import { Connection, FieldInfo, MysqlError } from 'mysql';

const connection: Connection = mysql.createConnection(db_info.info);

export function getTodayEmissions(location: string | undefined, onGetEmissions: ((data: number) => void)): void {
    const today: Date = new Date();
    let queryStr: string;
    
    if (location) {
        queryStr = `
            SELECT DATE_FORMAT(date_time, '%Y-%m-%d') time, SUM(emissions) total_emissions
            FROM co2_emissions
            WHERE date_time >= '${ today.getFullYear() }-${ today.getMonth() + 1 }-${ today.getDate() }' AND location = '${ location }'
            GROUP BY time;`;
    } else {
        queryStr = `
            SELECT DATE_FORMAT(date_time, '%Y-%m-%d') time, SUM(emissions) total_emissions
            FROM co2_emissions
            WHERE date_time >= '${ today.getFullYear() }-${ today.getMonth() + 1 }-${ today.getDate() }'
            GROUP BY time;`;
    }
    
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

export function getThisYearEmissions(location: string | undefined, onGetEmissions: ((data: number) => void)): void {
    const today: Date = new Date();
    let queryStr: string;
    
    if (location) {
        queryStr = `
            SELECT DATE_FORMAT(date_time, '%Y') time, SUM(emissions) total_emissions
            FROM co2_emissions
            WHERE date_time >= '${ today.getFullYear() }' AND date_time < '${ today.getFullYear() + 1 }' AND location = '${ location }'
            GROUP BY time;`;
    } else {
        queryStr = `
            SELECT DATE_FORMAT(date_time, '%Y') time, SUM(emissions) total_emissions
            FROM co2_emissions
            WHERE date_time >= '${ today.getFullYear() }' AND date_time < '${ today.getFullYear() + 1 }'
            GROUP BY time;`;
    }
    
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

export function getThisYearRemainingPermissibleEmissions(location: string | undefined, onGetEmissions: ((data: number) => void)): void {
    const today: Date = new Date();
    let queryStr: string;
    
    if (location) {
        queryStr = `
            SELECT emissions_limit
            FROM permissible_emissions_limit
            WHERE year = '${ today.getFullYear() }' AND location = '${ location }';`;
    } else {
        queryStr = `
            SELECT emissions_limit
            FROM permissible_emissions_limit
            WHERE year = '${ today.getFullYear() }';`;
    }
    
    connection.query(queryStr, (error: MysqlError | null, results: any, fields: FieldInfo | undefined): void => {
        if (error) {
            throw error;
        }
        
        getThisYearEmissions(location, (thisYearData: number): void => {
            try {
                onGetEmissions(results[0]['emissions_limit'] - thisYearData);
            } catch (e) {
                onGetEmissions(0);
            }
        });
    });
}

export function getTodayRatioComparedToThisMonthAverage(location: string | undefined, onGetEmissions: ((data: number) => void)): void {
    const today: Date = new Date();
    const nextMonth: Date = new Date(today.getFullYear(), today.getMonth() + 2, 1);
    let queryStr: string;
    
    if (location) {
        queryStr = `
            SELECT DATE_FORMAT(date_time, '%Y-%m') time, AVG(emissions) average_emissions
            FROM co2_emissions
            WHERE date_time >= '${ today.getFullYear() }-${ today.getMonth() + 1 }-1' AND date_time < '${ nextMonth.getFullYear() }-${ nextMonth.getMonth() }-1' AND location = '${ location }'
            GROUP BY time;`;
    } else {
        queryStr = `
            SELECT DATE_FORMAT(date_time, '%Y-%m') time, AVG(emissions) average_emissions
            FROM co2_emissions
            WHERE date_time >= '${ today.getFullYear() }-${ today.getMonth() + 1 }-1' AND date_time < '${ nextMonth.getFullYear() }-${ nextMonth.getMonth() }-1'
            GROUP BY time;`;
    }
    
    connection.query(queryStr, (error: MysqlError | null, results: any, fields: FieldInfo | undefined): void => {
        if (error) {
            throw error;
        }
        
        getTodayEmissions(location, (data: number): void => {
            
            try {
                onGetEmissions(((data / results[0]['average_emissions']) - 1) * 100);
            } catch (e) {
                onGetEmissions(0);
            }
        });
    });
}

export function getTheMostPastEmissionMonth(location: string | undefined, onGetEmissions: ((data: number) => void)): void {
    let queryStr: string;
    
    if (location) {
        queryStr = `
            SELECT DATE_FORMAT(date_time, '%Y-%m') time
            FROM co2_emissions
            WHERE location = '${ location }'
            GROUP BY time;`;
    } else {
        queryStr = `
            SELECT DATE_FORMAT(date_time, '%Y-%m') time
            FROM co2_emissions
            GROUP BY time;`;
    }
    
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

export function getSelectedMonthEmissions(monthDate: Date, location: string | undefined, onGetEmissions: ((data: number) => void)): void {
    const nextMonth: Date = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 13);
    let queryStr: string;
    
    if (location) {
        queryStr = `
            SELECT DATE_FORMAT(date_time, '%Y-%m') time, SUM(emissions) total_emissions
            FROM co2_emissions
            WHERE date_time >= '${ monthDate.getFullYear() }-${ monthDate.getMonth() + 1 }-1' AND date_time < '${ nextMonth.getFullYear() }-${ nextMonth.getMonth() + 1 }-1' AND location = '${ location }'
            GROUP BY time;`;
    } else {
        queryStr = `
            SELECT DATE_FORMAT(date_time, '%Y-%m') time, SUM(emissions) total_emissions
            FROM co2_emissions
            WHERE date_time >= '${ monthDate.getFullYear() }-${ monthDate.getMonth() + 1 }-1' AND date_time < '${ nextMonth.getFullYear() }-${ nextMonth.getMonth() + 1 }-1'
            GROUP BY time;`;
    }
    
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

export function getSelectedYearEmissions(year: number, location: string | undefined, onGetEmissions: ((data: number) => void)): void {
    let queryStr: string;
    
    if (location) {
        queryStr = `
            SELECT DATE_FORMAT(date_time, '%Y') time, SUM(emissions) total_emissions
            FROM co2_emissions
            WHERE date_time >= '${ year }-1-1' AND date_time < '${ year + 1 }-1-1' AND location = '${ location }'
            GROUP BY time;`;
    } else {
        queryStr = `
            SELECT DATE_FORMAT(date_time, '%Y') time, SUM(emissions) total_emissions
            FROM co2_emissions
            WHERE date_time >= '${ year }-1-1' AND date_time < '${ year + 1 }-1-1'
            GROUP BY time;`;
    }
    
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