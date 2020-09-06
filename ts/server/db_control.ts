import * as mysql from 'mysql';
import * as db_info from './secret/db_info';
import { Connection, FieldInfo, MysqlError } from 'mysql';
import exp = require('constants');

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

export function getThisYearPermissibleEmissions(onGetEmissions: (data: number) => void): void {
    const today: Date = new Date();
    let queryStr: string;
    
    queryStr = `
        SELECT emissions_limit
        FROM permissible_emissions_limit
        WHERE year = '${ today.getFullYear() }';`;
    
    connection.query(queryStr, (error: MysqlError | null, results: any, fields: FieldInfo | undefined): void => {
        if (error) {
            throw error;
        }
        
        onGetEmissions(results[0]['emissions_limit']);
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
    const dateStr: string = `${ now.getFullYear() }-${ now.getMonth() + 1 }-${ now.getDate() }`;
    const deleteQueryStr: string = `
        DELETE FROM resource_input
        WHERE date = '${ dateStr }';`;
    const insertQueryStr: string = `
        INSERT INTO resource_input
        VALUE('${ dateStr }', ${ data.location }, ${ data.limestone }, ${ data.clay }, ${ data.silicaStone }, ${ data.ironOxide }, ${ data.gypsum }, ${ data.coal });`;
    
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

export function insertAndroidToken(data: any, onInsertData: (() => void)): void {
    const selectQueryStr: string = `
        SELECT token
        FROM android_token
        WHERE token = '${ data.token }'`;
    const insertQueryStr: string = `
        INSERT INTO android_token
        VALUE('${ data.token }', 'administrator');`;
    
    connection.query(selectQueryStr, (error: MysqlError | null, results: any, fields: FieldInfo | undefined): void => {
        if (error) {
            throw error;
        }
        
        if (results.length === 0) {
            connection.query(insertQueryStr, (error: MysqlError | null, results: any, fields: FieldInfo | undefined): void => {
                if (error) {
                    throw error;
                }
                
                onInsertData();
            });
        } else {
            onInsertData();
        }
    });
}

export function insertTelegramId(telegramId: number, onSuccessToInsertId: () => void, onFailToInsertId: () => void): void {
    const selectQueryStr: string = `
        SELECT chat_id
        FROM telegram_chat_id
        WHERE chat_id = ${ telegramId }`;
    const insertQueryStr: string = `
        INSERT INTO telegram_chat_id
        VALUE(${ telegramId }, 'administrator');`;
    
    connection.query(selectQueryStr, (error: MysqlError | null, results: any, fields: FieldInfo | undefined): void => {
        if (error) {
            throw error;
        }
        
        if (results.length === 0) {
            connection.query(insertQueryStr, (error: MysqlError | null, results: any, fields: FieldInfo | undefined): void => {
                if (error) {
                    throw error;
                }
                
                onSuccessToInsertId();
            });
        } else {
            onFailToInsertId();
        }
    });
}

export function deleteTelegramId(telegramId: number, onDeleteId: () => void): void {
    const queryStr: string = `
        DELETE FROM telegram_chat_id
        WHERE chat_id = ${telegramId}`;
    
    connection.query(queryStr, (error: MysqlError | null, results: any, fields: FieldInfo | undefined): void => {
        if (error) {
            throw error;
        }
        
        onDeleteId();
    });
}

export function getTelegramId(authority: string, onGetData: (telegramId: number) => void): void {
    const queryStr: string = `
        SELECT chat_id
        FROM telegram_chat_id
        WHERE authority = '${authority}'`;
    
    connection.query(queryStr, (error: MysqlError | null, results: any, fields: FieldInfo | undefined): void => {
        if (error) {
            throw error;
        }
        
        results.forEach((element: any): void => {
            onGetData(element['chat_id']);
        });
    });
}

export function getPredictionAverageError(location: string, onGetData: (data: number) => void): void {
    const today: Date = new Date();
    const twoMonthsAgo: Date = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate());
    let queryStr: string;
    
    if (location === '') {
        queryStr = `
            SELECT predict_value, actual_value
            FROM predict_value
            WHERE date_time >= '${twoMonthsAgo.getFullYear()}-${twoMonthsAgo.getMonth() + 1}-${twoMonthsAgo.getDate()}' AND date_time <= '${today.getFullYear()}-${today.getMonth()}-${today.getDate()}'`;
    } else {
        queryStr = `
            SELECT predict_value, actual_value
            FROM predict_value
            WHERE date_time >= '${twoMonthsAgo.getFullYear()}-${twoMonthsAgo.getMonth() + 1}-${twoMonthsAgo.getDate()}' AND date_time <= '${today.getFullYear()}-${today.getMonth()}-${today.getDate()}' AND location = '${location}'`;
    }
    
    connection.query(queryStr, (error: MysqlError | null, results: any, fields: FieldInfo | undefined): void => {
        if (error) {
            throw error;
        }
        
        let sumOfError: number = 0;
        
        results.forEach((element: any): void => {
            sumOfError += Math.abs(element['actual_value'] - element['predict_value']);
        });
        
        onGetData(sumOfError / results.length);
    });
}

export function getResourceRatio(location: string, onGetData: (data: string) => void): void {
    const today: Date = new Date();
    const nextDay: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    let queryStr: string;
    
    if (location === '') {
        queryStr = `
            SELECT limestone, clay, silica_stone, iron_oxide, gypsum, coal
            FROM co2_emissions
            WHERE date_time >= '${today.getFullYear()}-${today.getMonth()}-${today.getDate()} 00:00:00' AND date_time < '${nextDay.getFullYear()}-${nextDay.getMonth()}-${nextDay.getDate()} 00:00:00'`;
    } else {
        queryStr = `
            SELECT limestone, clay, silica_stone, iron_oxide, gypsum, coal
            FROM co2_emissions
            WHERE date_time >= '${today.getFullYear()}-${today.getMonth()}-${today.getDate()}' AND date_time < '${nextDay.getFullYear()}-${nextDay.getMonth()}-${nextDay.getDate()} 00:00:00' AND location = '${location}'`;
    }
    
    connection.query(queryStr, (error: MysqlError | null, results: any, fields: FieldInfo | undefined): void => {
        if (error) {
            throw error;
        }
        
        let sum: number = 0;
        let sumOfLimestone: number = 0;
        let sumOfClay: number = 0;
        let sumOfSilicaStone: number = 0;
        let sumOfIronOxide: number = 0;
        let sumOfGypsum: number = 0;
        let sumOfCoal: number = 0;
        
        results.forEach((element: any): void => {
            sumOfLimestone += element['limestone'];
            sumOfClay += element['clay'];
            sumOfSilicaStone += element['silica_stone'];
            sumOfIronOxide += element['iron_oxide'];
            sumOfGypsum += element['gypsum'];
            sumOfCoal += element['coal'];
        });
        
        sum = sumOfLimestone + sumOfClay + sumOfSilicaStone + sumOfIronOxide + sumOfGypsum + sumOfCoal;
        
        const ratioOfLimestone: number = sumOfLimestone / sum * 100;
        const ratioOfClay: number = sumOfClay / sum * 100;
        const ratioOfSilicaStone: number = sumOfSilicaStone / sum * 100;
        const ratioOfIronOxide: number = sumOfIronOxide / sum * 100;
        const ratioOfGypsum: number = sumOfGypsum / sum * 100;
        const ratioOfCoal: number = sumOfCoal / sum * 100;
        
        onGetData(`${ratioOfClay.toFixed(1)} : ${ratioOfCoal.toFixed(1)} : ${ratioOfGypsum.toFixed(1)} : ${ratioOfIronOxide.toFixed(1)} : ${ratioOfLimestone.toFixed(1)} :  ${ratioOfSilicaStone.toFixed(1)}`);
    });
}