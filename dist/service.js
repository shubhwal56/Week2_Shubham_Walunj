"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const pgConfig_1 = require("./pgConfig");
const user_model_1 = require("./user_model");
async function createUser(orderids) {
    const transaction = await pgConfig_1.sequelize.transaction();
    try {
        console.log('Starting transaction for order IDs:', orderids);
        for (const orderid of orderids) {
            console.log('Inserting order ID:', orderid);
            await user_model_1.Order.create({ orderid }, { transaction });
        }
        await transaction.commit();
        console.log('Transaction committed successfully');
    }
    catch (error) {
        await transaction.rollback();
        console.error('Error inserting orders, transaction rolled back:', error);
        throw error;
    }
}
exports.createUser = createUser;
//# sourceMappingURL=service.js.map