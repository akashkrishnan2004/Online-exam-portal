import mongoose from "mongoose";

export default function connect() {
    return mongoose.connect(process.env.DB_URI)
}