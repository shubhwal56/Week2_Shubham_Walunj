import { sequelize } from './pgConfig';
import { Order } from './user_model';

async function createUser(orderids: string[]): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
        console.log('Starting transaction for order IDs:', orderids);
        
        for (const orderid of orderids) {
            console.log('Inserting order ID:', orderid);
            await Order.create({ orderid }, { transaction });
        }

        await transaction.commit();
        console.log('Transaction committed successfully');
    } catch (error) {
        await transaction.rollback();
        console.error('Error inserting orders, transaction rolled back:', error);
        throw error;
    }
}

export { createUser };
