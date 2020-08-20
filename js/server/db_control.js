"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSelectedYearEmissions = exports.getSelectedMonthEmissions = exports.getTheMostPastEmissionMonth = exports.getTodayRatioComparedToThisMonthAverage = exports.getThisYearRemainingPermissibleEmissions = exports.getThisYearEmissions = exports.getTodayEmissions = void 0;
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
function getThisYearRemainingPermissibleEmissions(location, onGetEmissions) {
    const today = new Date();
    let queryStr;
    if (location) {
        queryStr = `
            SELECT emissions_limit
            FROM permissible_emissions_limit
            WHERE year = '${today.getFullYear()}' AND location = '${location}';`;
    }
    else {
        queryStr = `
            SELECT emissions_limit
            FROM permissible_emissions_limit
            WHERE year = '${today.getFullYear()}';`;
    }
    connection.query(queryStr, (error, results, fields) => {
        if (error) {
            throw error;
        }
        getThisYearEmissions(location, (thisYearData) => {
            try {
                onGetEmissions(results[0]['emissions_limit'] - thisYearData);
            }
            catch (e) {
                onGetEmissions(0);
            }
        });
    });
}
exports.getThisYearRemainingPermissibleEmissions = getThisYearRemainingPermissibleEmissions;
function getTodayRatioComparedToThisMonthAverage(location, onGetEmissions) {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1);
    let queryStr;
    if (location) {
        queryStr = `
            SELECT DATE_FORMAT(date_time, '%Y-%m') time, AVG(emissions) average_emissions
            FROM co2_emissions
            WHERE date_time >= '${today.getFullYear()}-${today.getMonth() + 1}-1' AND date_time < '${nextMonth.getFullYear()}-${nextMonth.getMonth()}-1' AND location = '${location}'
            GROUP BY time;`;
    }
    else {
        queryStr = `
            SELECT DATE_FORMAT(date_time, '%Y-%m') time, AVG(emissions) average_emissions
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
                onGetEmissions(((data / results[0]['average_emissions']) - 1) * 100);
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
//# sourceMappingURL=db_control.js.map