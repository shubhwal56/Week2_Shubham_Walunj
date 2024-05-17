"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
exports.sequelize = new sequelize_1.Sequelize({
    database: "TestOrder",
    username: "postgres",
    password: "Shubham@123",
    port: 3000,
    host: "localhost",
    dialect: "postgres"
});
exports.sequelize.authenticate().then(() => {
    console.log("database connection successfull");
}).catch((err) => {
    console.log("Unable to connect to the database");
});
//# sourceMappingURL=pgConfig.js.map