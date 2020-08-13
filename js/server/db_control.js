"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
const db_info = require("./secret/db_info");
const connection = mysql.createConnection(db_info.info);
connection.query(`
SELECT DATE_FORMAT(date_time, '%Y-%m-%d') time, SUM(emissions)
FROM co2_emissions
GROUP BY time;`, (error, results, fields) => {
    if (error)
        throw error;
    console.log(results[0].solution);
});
connection.end();
//# sourceMappingURL=db_control.js.map