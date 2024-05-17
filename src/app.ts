import express from 'express';
import { Application, Request, Response } from 'express';
import { createUser } from './service';
import { sequelize } from './pgConfig';
import { Order } from './user_model';

const app: Application = express();
app.use(express.json());

// 1
app.post('/orders', async (req: Request, res: Response) => {
    try {
        console.log('Received request:', req.body);
        const orders = req.body.items;
        
        // 5
        // Function to check if table exists, and create if not
        async function checkAndCreateTable(): Promise<void> {
            try {
                const tableExists = await Order.sync({ alter: true });
                if (!tableExists) {
                    console.log("Table 'orders' created successfully.");
                } else {
                    console.log("Table 'orders' already exists.");
                }
            } catch (error) {
                console.error("Error checking or creating table:", error);
            }
        }

        await checkAndCreateTable();

        const filteredOrders = orders.filter((order: any) => {
            return order.OrderBlocks.some((block: any) => {
                if (Array.isArray(block.lineNo)) {
                    return block.lineNo.some((line: number) => line % 3 === 0);
                } else {
                    return block.lineNo % 3 === 0;
                }
            });
        });

        console.log('Filtered orders:', filteredOrders);

        const orderIDs = filteredOrders.map((order: any) => order.orderID);
        console.log('Order IDs to insert:', orderIDs);

        await createUser(orderIDs);
        res.send("Orders filtered and stored successfully");
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send("Internal Server Error");
    }
});

// 2
app.post('/array-functions', async (req: Request, res: Response) => {
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
        const mapped = items.map((item: number) => item * 2);
        const shifted = items.shift();
        const filtered = items.filter((item: number) => item % 2 === 0);
        items.unshift(0);
        items.forEach((item: number, index: number) => console.log(`Item at index ${index}: ${item}`));
        const flatArray = [1, [2, 3], [4, [5]]].flat(2);
        const found = items.find((item: number) => item > 50);
        const joined = items.join('-');
        const findIndex = items.findIndex((item: number) => item > 50);
        const toString = items.toString();
        const someNegative = items.some((item: number) => item < 0);
        const splitString = joined.split('-');
        const everyPositive = items.every((item: number) => item >= 0);
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
    } catch (error) {
        console.error('Error processing array functions:', error);
        res.status(500).send("Internal Server Error");
    }
});

// 4
function filterPassedStudents(students: any[]) {
    return students.filter(student => student.grade >= 50);
}

function getStudentNames(students: any[]) {
    return students.map(student => student.name);
}

function sortStudentsByGrade(students: any[]) {
    return students.slice().sort((a, b) => a.grade - b.grade);
}

function getAverageAge(students: any[]) {
    const totalAge = students.reduce((acc, student) => acc + student.age, 0);
    return totalAge / students.length;
}

app.post('/array-functions-students', async (req: Request, res: Response) => {
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
    } catch (error) {
        console.error('Error processing array functions:', error);
        res.status(500).send("Internal Server Error");
    }
});



sequelize.sync({ force: false }).then(() => {
    console.log('Database & tables created!');
    app.listen(8000, () => {
        console.log(`Server is running on port 8000`);
    });
}).catch(err => {
    console.error('Error creating database & tables:', err);
});
