const mongoose = require("mongoose");
require("dotenv").config();

const mongoConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION);

    console.log(`> Conectado a MongoDB ${mongoose.version}`.green);
  } catch (error) {
    console.log(`Error conexión con MongoDB`.red);
    console.log(error);
  }
};

module.exports = {
  mongoConnection,
};
