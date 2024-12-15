import { connect } from "mongoose";

const DB_Conection = async () => {
    try {
        await connect('mongodb://127.0.0.1:27017/whatsup_practice2')
        console.log("DATABASE CONNECTED SUCCESFULLY.");
    } catch (error) {
        console.log("DATABASE CONNECTION ERROR: ", error.message);
        process.exit();
    }
}

export default DB_Conection;