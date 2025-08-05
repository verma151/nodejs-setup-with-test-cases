import mongoose from "mongoose";
mongoose.set('strictQuery', true);

var DB:any;

const options: mongoose.ConnectOptions = {
  autoIndex: false, // Don't build indexes
  maxPoolSize: 5, // Maintain up to 5 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  readPreference: 'secondaryPreferred',
};

const connectDatabase = () => {
  const mongoUrl: any = process.env.DB_URI;
  console.log(`Connecting to MongoDB at ${mongoUrl}`);

  mongoose.connect(mongoUrl, options)
    .then(() => {
      DB = mongoose.connection;
      console.log(`Mongodb connected with server`);
    })
    .catch((error: Error) => {
      console.log(`Mongodb connection error: ${error.message}`);
      process.exit(1);
    });
};

const getDBConn = async () =>{
  return DB;
}

export { connectDatabase, getDBConn }
