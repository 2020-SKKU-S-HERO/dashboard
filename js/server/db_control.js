"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodayEmissions = void 0;
const mysql = require("mysql");
const db_info = require("./secret/db_info");
const connection = mysql.createConnection(db_info.info);
function getTodayEmissions(onGetEmissions) {
    const today = new Date();
    const queryStr = `
        SELECT DATE_FORMAT(date_time, '%Y-%m-%d') time, SUM(emissions) total_emissions
        FROM co2_emissions
        WHERE date_time >= '${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}'
        GROUP BY time;`;
    connection.query(queryStr, (error, results, fields) => {
        if (error)
            throw error;
        onGetEmissions(results);
    });
}
exports.getTodayEmissions = getTodayEmissions;
//# sourceMappingURL=db_control.js.map