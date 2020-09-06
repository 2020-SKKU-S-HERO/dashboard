"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResourceRatio = exports.getPredictionAverageError = exports.getTelegramId = exports.deleteTelegramId = exports.insertTelegramId = exports.insertAndroidToken = exports.insertResourceInput = exports.getThisYearPredictionEmissions = exports.insertWeatherData = exports.getNowWeatherData = exports.getSelectedYearEmissions = exports.getSelectedMonthEmissions = exports.getTheMostPastEmissionMonth = exports.getTodayRatioComparedToThisMonthAverage = exports.getThisYearPermissibleEmissions = exports.getThisYearEmissions = exports.getTodayEmissions = void 0;
const mysql = require("mysql");
const db_info = require("./secret/db_info");
const connection = mysql.createConnection(db_info.info);
function getTodayEmissions(location, onGetEmissions) {
    const today = new Date();
    let queryStr;
    if (location) {
        queryStr = `
            SELECT DATE_FORMAT(date_time, '%Y-%m-%d') time, SUM(emissions) total_emissions
            FROM co2_emissions
            WHERE date_time >= '${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}' AND location = '${location}'
            GROUP BY time;`;
    }
    else {
        queryStr = `
            SELECT DATE_FORMAT(date_time, '%Y-%m-%d') time, SUM(emissions) total_emissions
            FROM co2_emissions
            WHERE date_time >= '${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}'
            GROUP BY time;`;
    }
    connection.query(queryStr, (error, results, fields) => {
        if (error) {
            throw error;
        }
        try {
            onGetEmissions(results[0]['total_emissions']);
        }
        catch (e) {
            onGetEmissions(0);
        }
    });
}
exports.getTodayEmissions = getTodayEmissions;
function getThisYearEmissions(location, onGetEmissions) {
    const today = new Date();
    let queryStr;
    if (location) {
        queryStr = `
            SELECT DATE_FORMAT(date_time, '%Y') time, SUM(emissions) total_emissions
            FROM co2_emissions
            WHERE date_time >= '${today.getFullYear()}' AND date_time < '${today.getFullYear() + 1}' AND location = '${location}'
            GROUP BY time;`;
    }
    else {
        queryStr = `
            SELECT DATE_FORMAT(date_time, '%Y') time, SUM(emissions) total_emissions
            FROM co2_emissions
            WHERE date_time >= '${today.getFullYear()}' AND date_time < '${today.getFullYear() + 1}'
            GROUP BY time;`;
    }
    connection.query(queryStr, (error, results, fields) => {
        if (error) {
            throw error;
        }
        try {
            onGetEmissions(results[0]['total_emissions']);
        }
        catch (e) {
            onGetEmissions(0);
        }
    });
}
exports.getThisYearEmissions = getThisYearEmissions;
function getThisYearPermissibleEmissions(onGetEmissions) {
    const today = new Date();
    let queryStr;
    queryStr = `
        SELECT emissions_limit
        FROM permissible_emissions_limit
        WHERE year = '${today.getFullYear()}';`;
    connection.query(queryStr, (error, results, fields) => {
        if (error) {
            throw error;
        }
        onGetEmissions(results[0]['emissions_limit']);
    });
}
exports.getThisYearPermissibleEmissions = getThisYearPermissibleEmissions;
function getTodayRatioComparedToThisMonthAverage(location, onGetEmissions) {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1);
    let queryStr;
    if (location) {
        queryStr = `
            SELECT DATE_FORMAT(date_time, '%Y-%m') time, SUM(emissions) total_emissions
            FROM co2_emissions
            WHERE date_time >= '${today.getFullYear()}-${today.getMonth() + 1}-1' AND date_time < '${nextMonth.getFullYear()}-${nextMonth.getMonth()}-1' AND location = '${location}'
            GROUP BY time;`;
    }
    else {
        queryStr = `
            SELECT DATE_FORMAT(date_time, '%Y-%m') time, SUM(emissions) total_emissions
            FROM co2_emissions
            WHERE date_time >= '${today.getFullYear()}-${today.getMonth() + 1}-1' AND date_time < '${nextMonth.getFullYear()}-${nextMonth.getMonth()}-1'
            GROUP BY time;`;
    }
    connection.query(queryStr, (error, results, fields) => {
        if (error) {
            throw error;
        }
        getTodayEmissions(location, (data) => {
            try {
                onGetEmissions(((data / (results[0]['total_emissions'] / today.getDate())) - 1) * 100);
            }
            catch (e) {
                onGetEmissions(0);
            }
        });
    });
}
exports.getTodayRatioComparedToThisMonthAverage = getTodayRatioComparedToThisMonthAverage;
function getTheMostPastEmissionMonth(location, onGetEmissions) {
    let queryStr;
    if (location) {
        queryStr = `
            SELECT DATE_FORMAT(date_time, '%Y-%m') time
            FROM co2_emissions
            WHERE location = '${location}'
            GROUP BY time;`;
    }
    else {
        queryStr = `
            SELECT DATE_FORMAT(date_time, '%Y-%m') time
            FROM co2_emissions
            GROUP BY time;`;
    }
    connection.query(queryStr, (error, results, fields) => {
        if (error) {
            throw error;
        }
        try {
            onGetEmissions(results[0]['time']);
        }
        catch (e) {
            onGetEmissions(0);
        }
    });
}
exports.getTheMostPastEmissionMonth = getTheMostPastEmissionMonth;
function getSelectedMonthEmissions(monthDate, location, onGetEmissions) {
    const nextMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 13);
    let queryStr;
    if (location) {
        queryStr = `
            SELECT DATE_FORMAT(date_time, '%Y-%m') time, SUM(emissions) total_emissions
            FROM co2_emissions
            WHERE date_time >= '${monthDate.getFullYear()}-${monthDate.getMonth() + 1}-1' AND date_time < '${nextMonth.getFullYear()}-${nextMonth.getMonth() + 1}-1' AND location = '${location}'
            GROUP BY time;`;
    }
    else {
        queryStr = `
            SELECT DATE_FORMAT(date_time, '%Y-%m') time, SUM(emissions) total_emissions
            FROM co2_emissions
            WHERE date_time >= '${monthDate.getFullYear()}-${monthDate.getMonth() + 1}-1' AND date_time < '${nextMonth.getFullYear()}-${nextMonth.getMonth() + 1}-1'
            GROUP BY time;`;
    }
    connection.query(queryStr, (error, results, fields) => {
        if (error) {
            throw error;
        }
        try {
            onGetEmissions(results[0]['total_emissions']);
        }
        catch (e) {
            onGetEmissions(0);
        }
    });
}
exports.getSelectedMonthEmissions = getSelectedMonthEmissions;
function getSelectedYearEmissions(year, location, onGetEmissions) {
    let queryStr;
    if (location) {
        queryStr = `
            SELECT DATE_FORMAT(date_time, '%Y') time, SUM(emissions) total_emissions
            FROM co2_emissions
            WHERE date_time >= '${year}-1-1' AND date_time < '${year + 1}-1-1' AND location = '${location}'
            GROUP BY time;`;
    }
    else {
        queryStr = `
            SELECT DATE_FORMAT(date_time, '%Y') time, SUM(emissions) total_emissions
            FROM co2_emissions
            WHERE date_time >= '${year}-1-1' AND date_time < '${year + 1}-1-1'
            GROUP BY time;`;
    }
    connection.query(queryStr, (error, results, fields) => {
        if (error) {
            throw error;
        }
        try {
            onGetEmissions(results[0]['total_emissions']);
        }
        catch (e) {
            onGetEmissions(0);
        }
    });
}
exports.getSelectedYearEmissions = getSelectedYearEmissions;
function getNowWeatherData(cityName, onGetData) {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:00:00`;
    const queryStr = `
        SELECT weather_icon, temperature, humidity
        FROM weather
        WHERE date_time = '${timeStr}' AND city_name = '${cityName}'`;
    connection.query(queryStr, (error, results, fields) => {
        if (error) {
            throw error;
        }
        if (results.length === 0) {
            onGetData(null);
        }
        else {
            onGetData(results[0]);
        }
    });
}
exports.getNowWeatherData = getNowWeatherData;
function insertWeatherData(data) {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:00:00`;
    const queryStr = `
        INSERT INTO weather(date_time, city_name, weather_icon, temperature, humidity)
        VALUES('${timeStr}', '${data.city_name}', '${data.weather_icon}', ${data.temperature}, ${data.humidity})`;
    connection.query(queryStr, (error, results, fields) => {
        if (error) {
            throw error;
        }
    });
}
exports.insertWeatherData = insertWeatherData;
function getThisYearPredictionEmissions(location, onGetEmissions) {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const lastDay = new Date(now.getFullYear(), 12, 1);
    let queryStr;
    if (location) {
        queryStr = `
            SELECT SUM(predict_value) expected_emissions
            FROM predict_value
            WHERE date_time >= '${tomorrow.getFullYear()}-${tomorrow.getMonth() + 1}-${tomorrow.getDate()}' AND date_time < '${lastDay.getFullYear()}-${lastDay.getMonth() + 1}-${lastDay.getDate()}' AND location = '${location}'`;
    }
    else {
        queryStr = `
            SELECT SUM(predict_value) expected_emissions
            FROM predict_value
            WHERE date_time >= '${tomorrow.getFullYear()}-${tomorrow.getMonth() + 1}-${tomorrow.getDate()}' AND date_time < '${lastDay.getFullYear()}-${lastDay.getMonth() + 1}-${lastDay.getDate()}'`;
    }
    connection.query(queryStr, (error, results, fields) => {
        if (error) {
            throw error;
        }
        try {
            onGetEmissions(results[0]['expected_emissions']);
        }
        catch (e) {
            onGetEmissions(0);
        }
    });
}
exports.getThisYearPredictionEmissions = getThisYearPredictionEmissions;
function insertResourceInput(data, onInsertData) {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    const deleteQueryStr = `
        DELETE FROM resource_input
        WHERE date = '${dateStr}';`;
    const insertQueryStr = `
        INSERT INTO resource_input
        VALUE('${dateStr}', ${data.location}, ${data.limestone}, ${data.clay}, ${data.silicaStone}, ${data.ironOxide}, ${data.gypsum}, ${data.coal});`;
    connection.query(deleteQueryStr, (error, results, fields) => {
        if (error) {
            throw error;
        }
        connection.query(insertQueryStr, (error, results, fields) => {
            if (error) {
                throw error;
            }
            onInsertData();
        });
    });
}
exports.insertResourceInput = insertResourceInput;
function insertAndroidToken(data, onInsertData) {
    const selectQueryStr = `
        SELECT token
        FROM android_token
        WHERE token = '${data.token}'`;
    const insertQueryStr = `
        INSERT INTO android_token
        VALUE('${data.token}', 'administrator');`;
    connection.query(selectQueryStr, (error, results, fields) => {
        if (error) {
            throw error;
        }
        if (results.length === 0) {
            connection.query(insertQueryStr, (error, results, fields) => {
                if (error) {
                    throw error;
                }
                onInsertData();
            });
        }
        else {
            onInsertData();
        }
    });
}
exports.insertAndroidToken = insertAndroidToken;
function insertTelegramId(telegramId, onSuccessToInsertId, onFailToInsertId) {
    const selectQueryStr = `
        SELECT chat_id
        FROM telegram_chat_id
        WHERE chat_id = ${telegramId}`;
    const insertQueryStr = `
        INSERT INTO telegram_chat_id
        VALUE(${telegramId}, 'administrator');`;
    connection.query(selectQueryStr, (error, results, fields) => {
        if (error) {
            throw error;
        }
        if (results.length === 0) {
            connection.query(insertQueryStr, (error, results, fields) => {
                if (error) {
                    throw error;
                }
                onSuccessToInsertId();
            });
        }
        else {
            onFailToInsertId();
        }
    });
}
exports.insertTelegramId = insertTelegramId;
function deleteTelegramId(telegramId, onDeleteId) {
    const queryStr = `
        DELETE FROM telegram_chat_id
        WHERE chat_id = ${telegramId}`;
    connection.query(queryStr, (error, results, fields) => {
        if (error) {
            throw error;
        }
        onDeleteId();
    });
}
exports.deleteTelegramId = deleteTelegramId;
function getTelegramId(authority, onGetData) {
    const queryStr = `
        SELECT chat_id
        FROM telegram_chat_id
        WHERE authority = '${authority}'`;
    connection.query(queryStr, (error, results, fields) => {
        if (error) {
            throw error;
        }
        results.forEach((element) => {
            onGetData(element['chat_id']);
        });
    });
}
exports.getTelegramId = getTelegramId;
function getPredictionAverageError(location, onGetData) {
    const today = new Date();
    const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate());
    let queryStr;
    if (location === '') {
        queryStr = `
            SELECT predict_value, actual_value
            FROM predict_value
            WHERE date_time >= '${twoMonthsAgo.getFullYear()}-${twoMonthsAgo.getMonth() + 1}-${twoMonthsAgo.getDate()}' AND date_time <= '${today.getFullYear()}-${today.getMonth()}-${today.getDate()}'`;
    }
    else {
        queryStr = `
            SELECT predict_value, actual_value
            FROM predict_value
            WHERE date_time >= '${twoMonthsAgo.getFullYear()}-${twoMonthsAgo.getMonth() + 1}-${twoMonthsAgo.getDate()}' AND date_time <= '${today.getFullYear()}-${today.getMonth()}-${today.getDate()}' AND location = '${location}'`;
    }
    connection.query(queryStr, (error, results, fields) => {
        if (error) {
            throw error;
        }
        let sumOfError = 0;
        results.forEach((element) => {
            sumOfError += Math.abs(element['actual_value'] - element['predict_value']);
        });
        onGetData(sumOfError / results.length);
    });
}
exports.getPredictionAverageError = getPredictionAverageError;
function getResourceRatio(location, onGetData) {
    const today = new Date();
    const nextDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    let queryStr;
    if (location === '') {
        queryStr = `
            SELECT limestone, clay, silica_stone, iron_oxide, gypsum, coal
            FROM co2_emissions
            WHERE date_time >= '${today.getFullYear()}-${today.getMonth()}-${today.getDate()} 00:00:00' AND date_time < '${nextDay.getFullYear()}-${nextDay.getMonth()}-${nextDay.getDate()} 00:00:00'`;
    }
    else {
        queryStr = `
            SELECT limestone, clay, silica_stone, iron_oxide, gypsum, coal
            FROM co2_emissions
            WHERE date_time >= '${today.getFullYear()}-${today.getMonth()}-${today.getDate()}' AND date_time < '${nextDay.getFullYear()}-${nextDay.getMonth()}-${nextDay.getDate()} 00:00:00' AND location = '${location}'`;
    }
    connection.query(queryStr, (error, results, fields) => {
        if (error) {
            throw error;
        }
        let sum = 0;
        let sumOfLimestone = 0;
        let sumOfClay = 0;
        let sumOfSilicaStone = 0;
        let sumOfIronOxide = 0;
        let sumOfGypsum = 0;
        let sumOfCoal = 0;
        results.forEach((element) => {
            sumOfLimestone += element['limestone'];
            sumOfClay += element['clay'];
            sumOfSilicaStone += element['silica_stone'];
            sumOfIronOxide += element['iron_oxide'];
            sumOfGypsum += element['gypsum'];
            sumOfCoal += element['coal'];
        });
        sum = sumOfLimestone + sumOfClay + sumOfSilicaStone + sumOfIronOxide + sumOfGypsum + sumOfCoal;
        const ratioOfLimestone = sumOfLimestone / sum * 100;
        const ratioOfClay = sumOfClay / sum * 100;
        const ratioOfSilicaStone = sumOfSilicaStone / sum * 100;
        const ratioOfIronOxide = sumOfIronOxide / sum * 100;
        const ratioOfGypsum = sumOfGypsum / sum * 100;
        const ratioOfCoal = sumOfCoal / sum * 100;
        onGetData(`${ratioOfClay.toFixed(1)} : ${ratioOfCoal.toFixed(1)} : ${ratioOfGypsum.toFixed(1)} : ${ratioOfIronOxide.toFixed(1)} : ${ratioOfLimestone.toFixed(1)} :  ${ratioOfSilicaStone.toFixed(1)}`);
    });
}
exports.getResourceRatio = getResourceRatio;
//# sourceMappingURL=db_control.js.map