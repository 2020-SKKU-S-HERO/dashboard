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
            SELECT DATE_FORMAT(date_time, '%Y-%m') time, SUM(emissions) total_emissions
            FROM co2_emissions
            WHERE date_time >= '${ today.getFullYear() }-${ today.getMonth() + 1 }-1' AND date_time < '${ nextMonth.getFullYear() }-${ nextMonth.getMonth() }-1' AND location = '${ location }'
            GROUP BY time;`;
    } else {
        queryStr = `
            SELECT DATE_FORMAT(date_time, '%Y-%m') time, SUM(emissions) total_emissions
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
                onGetEmissions(((data / (results[0]['total_emissions'] / today.getDate())) - 1) * 100);
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

export function getNowWeatherData(cityName: string, onGetData: (data: any | null) => void): void {
    const now: Date = new Date();
    const timeStr: string = `${ now.getFullYear() }-${ now.getMonth() + 1 }-${ now.getDate() } ${ now.getHours() }:00:00`;
    const queryStr: string = `
        SELECT weather_icon, temperature, humidity
        FROM weather
        WHERE date_time = '${ timeStr }' AND city_name = '${ cityName }'`;
    
    connection.query(queryStr, (error: MysqlError | null, results: any, fields: FieldInfo | undefined): void => {
        if (error) {
            throw error;
            
        }
        
        if (results.length === 0) {
            onGetData(null);
        } else {
            onGetData(results[0]);
        }
    });
}

export function insertWeatherData(data: any): void {
    const now: Date = new Date();
    const timeStr: string = `${ now.getFullYear() }-${ now.getMonth() + 1 }-${ now.getDate() } ${ now.getHours() }:00:00`;
    const queryStr: string = `
        INSERT INTO weather(date_time, city_name, weather_icon, temperature, humidity)
        VALUES('${ timeStr }', '${ data.city_name }', '${ data.weather_icon }', ${ data.temperature }, ${ data.humidity })`;
    
    connection.query(queryStr, (error: MysqlError | null, results: any, fields: FieldInfo | undefined): void => {
        if (error) {
            throw error;
        }
    });
}

export function getThisYearPredictionEmissions(location: string | undefined, onGetEmissions: ((data: number) => void)): void {
    const now: Date = new Date();
    const tomorrow: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const lastDay: Date = new Date(now.getFullYear(), 12, 1);
    let queryStr: string;
    
    if (location) {
        queryStr = `
            SELECT SUM(predict_value) expected_emissions
            FROM predict_value
            WHERE date_time >= '${ tomorrow.getFullYear() }-${ tomorrow.getMonth() + 1 }-${ tomorrow.getDate() }' AND date_time < '${ lastDay.getFullYear() }-${ lastDay.getMonth() + 1 }-${ lastDay.getDate() }' AND location = '${ location }'`;
    } else {
        queryStr = `
            SELECT SUM(predict_value) expected_emissions
            FROM predict_value
            WHERE date_time >= '${ tomorrow.getFullYear() }-${ tomorrow.getMonth() + 1 }-${ tomorrow.getDate() }' AND date_time < '${ lastDay.getFullYear() }-${ lastDay.getMonth() + 1 }-${ lastDay.getDate() }'`;
    }
    
    connection.query(queryStr, (error: MysqlError | null, results: any, fields: FieldInfo | undefined): void => {
        if (error) {
            throw error;
        }
        
        try {
            onGetEmissions(results[0]['expected_emissions']);
        } catch (e) {
            onGetEmissions(0);
        }
    });
}

export function insertResourceInput(data: any, onInsertData: (() => void)): void {
    const now: Date = new Date();
    const dateStr: string = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
    const deleteQueryStr: string = `
        DELETE FROM resource_input
        WHERE date = '${dateStr}';`;
    const insertQueryStr: string = `
        INSERT INTO resource_input
        VALUE('${dateStr}', ${data.location}, ${data.limestone}, ${data.clay}, ${data.silicaStone}, ${data.ironOxide}, ${data.gypsum}, ${data.coal});`;
        
    connection.query(deleteQueryStr, (error: MysqlError | null, results: any, fields: FieldInfo | undefined): void => {
        if (error) {
            throw error;
        }
    
        connection.query(insertQueryStr, (error: MysqlError | null, results: any, fields: FieldInfo | undefined): void => {
            if (error) {
                throw error;
            }
        
            onInsertData();
        });
    });
}