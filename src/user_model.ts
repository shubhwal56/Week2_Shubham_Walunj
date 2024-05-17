import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './pgConfig';

interface OrderAttributes {
    id: number;
    orderid: string;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id'> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    public id!: number;
    public orderid!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Order.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        orderid: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'orders',
        sequelize,
        timestamps: false, 
    }
);

export { Order };
