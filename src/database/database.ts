const mongoose = require('mongoose');

export async function connectDatabase(): Promise<void> {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(
      `mongodb+srv://${process.env.USERDB}:${process.env.PASSDB}@${process.env.SERVERDB}/${process.env.NAMEDB}?retryWrites=true&w=majority`
    );
    console.log('Base de datos conectada');
  } catch (error) {
    throw new Error('Base de datos no ha hecho conexión');
  }
}