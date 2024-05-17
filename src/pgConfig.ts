
import {Sequelize} from "sequelize";

export const sequelize = new Sequelize({
    database:"TestOrder",
    username:"postgres",
    password:"Shubham@123",
    port:3000,
    host:"localhost",
    dialect:"postgres"
});

sequelize.authenticate().then(()=>{
    console.log("database connection successfull")
}).catch((err)=>{
    console.log("Unable to connect to the database")
})