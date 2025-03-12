// import mongoose from "mongoose";

// export default function connect() {
//     return mongoose.connect(process.env.DB_URI)
// }


import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log(`Database connected`);
  } catch (error) {
    console.log(error);
    console.log("Database not connected");
  }
};

export default connect;
