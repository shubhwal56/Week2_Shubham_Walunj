"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const service_1 = require("./service");
const pgConfig_1 = require("./pgConfig");
const user_model_1 = require("./user_model");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// 1
app.post('/orders', async (req, res) => {
    try {
        console.log('Received request:', req.body);
        const orders = req.body.items;
        // 5
        // Function to check if table exists, and create if not
        async function checkAndCreateTable() {
            try {
                const tableExists = await user_model_1.Order.sync({ alter: true });
                if (!tableExists) {
                    console.log("Table 'orders' created successfully.");
                }
                else {
                    console.log("Table 'orders' already exists.");
                }
            }
            catch (error) {
                console.error("Error checking or creating table:", error);
            }
        }
        await checkAndCreateTable();
        const filteredOrders = orders.filter((order) => {
            return order.OrderBlocks.some((block) => {
                if (Array.isArray(block.lineNo)) {
                    return block.lineNo.some((line) => line % 3 === 0);
                }
                else {
                    return block.lineNo % 3 === 0;
                }
            });
        });
        console.log('Filtered orders:', filteredOrders);
        const orderIDs = filteredOrders.map((order) => order.orderID);
        console.log('Order IDs to insert:', orderIDs);
        await (0, service_1.createUser)(orderIDs);
        res.send("Orders filtered and stored successfully");
    }
    catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send("Internal Server Error");
    }
});
// 2
app.post('/array-functions', async (req, res) => {
    try {
        const items = req.body.items;
        if (!Array.isArray(items)) {
            res.status(400).send("Invalid payload");
            return;
        }
        const concatenated = items.concat([10, 20, 30]);
        const lastIndexOfFive = items.lastIndexOf(5);
        items.push(100);
        const spliced = items.splice(2, 1, 200);
        const popped = items.pop();
        const sliced = items.slice(1, 3);
        const mapped = items.map((item) => item * 2);
        const shifted = items.shift();
        const filtered = items.filter((item) => item % 2 === 0);
        items.unshift(0);
        items.forEach((item, index) => console.log(`Item at index ${index}: ${item}`));
        const flatArray = [1, [2, 3], [4, [5]]].flat(2);
        const found = items.find((item) => item > 50);
        const joined = items.join('-');
        const findIndex = items.findIndex((item) => item > 50);
        const toString = items.toString();
        const someNegative = items.some((item) => item < 0);
        const splitString = joined.split('-');
        const everyPositive = items.every((item) => item >= 0);
        const replaced = joined.replace(/100/, 'REPLACED');
        const includes = items.includes(100);
        const indexOf = items.indexOf(100);
        res.json({
            concatenated,
            lastIndexOfFive,
            spliced,
            popped,
            sliced,
            mapped,
            shifted,
            filtered,
            flatArray,
            found,
            joined,
            findIndex,
            toString,
            someNegative,
            splitString,
            everyPositive,
            replaced,
            includes,
            indexOf,
        });
    }
    catch (error) {
        console.error('Error processing array functions:', error);
        res.status(500).send("Internal Server Error");
    }
});
// 4
function filterPassedStudents(students) {
    return students.filter(student => student.grade >= 50);
}
function getStudentNames(students) {
    return students.map(student => student.name);
}
function sortStudentsByGrade(students) {
    return students.slice().sort((a, b) => a.grade - b.grade);
}
function getAverageAge(students) {
    const totalAge = students.reduce((acc, student) => acc + student.age, 0);
    return totalAge / students.length;
}
app.post('/array-functions-students', async (req, res) => {
    try {
        const students = req.body.students;
        if (!Array.isArray(students)) {
            res.status(400).send("Invalid payload");
            return;
        }
        const passedStudents = filterPassedStudents(students);
        const studentNames = getStudentNames(students);
        const sortedStudents = sortStudentsByGrade(students);
        const averageAge = getAverageAge(students);
        res.json({
            passedStudents,
            studentNames,
            sortedStudents,
            averageAge,
        });
    }
    catch (error) {
        console.error('Error processing array functions:', error);
        res.status(500).send("Internal Server Error");
    }
});
pgConfig_1.sequelize.sync({ force: false }).then(() => {
    console.log('Database & tables created!');
    app.listen(8000, () => {
        console.log(`Server is running on port 8000`);
    });
}).catch(err => {
    console.error('Error creating database & tables:', err);
});
//# sourceMappingURL=app.js.map