import mongoose from 'mongoose';

export async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URL); // Added await
    const connection = mongoose.connection;

    connection.on('connected', () => {
      // console.log('MongoDB connected successfully');
    });

    connection.on('error', (err) => {  // Fixed arrow function syntax
      // console.log('MongoDB connection error. Please make sure MongoDB is running.');
      // console.error(err);
      // process.exit(1);  // Exit with error code
    });

  } catch (error) {
    console.log('Something went wrong!');
    console.error(error);
    process.exit(1); // Exit the process on error
  }
}
