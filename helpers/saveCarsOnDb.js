const Car = require("../models/car");

const saveCarsOnDb = async (car) => {
  const duplicatedCars = await Car.find(car);
  if (duplicatedCars.length === 0) {
    try {
      const carDb = await new Car(car);
      await carDb.save();
      console.log(`Se ha guardado el coche en la DB`.bgGreen.black.bold);
      return 1;
    } catch (error) {
      console.log(
        `Error no se ha podido guardar el coche en la BD. Motivo: ${error.errors.properties.path}`
          .bgRed
      );
      console.log(error.errors);
    }
  } else {
    console.log(
      `No se ha guardado el coche puesto que ya estaba en la BD`.bgRed
    );
  }

  return 0;
};

module.exports = saveCarsOnDb;
