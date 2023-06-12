const { Temperament } = require('../db');
const axios = require('axios');
const { ENDPOINT } = process.env;

const getAllTemperaments = async (req, res) => {
  try {
    const allTemperaments = await Temperament.findAll();
    return res.status(200).json(allTemperaments);
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
};

const getTemperaments = async () => {
  try {
    const { data } = await axios(ENDPOINT);
    const dogs = data
      .map((dog) => dog.temperament)
      .toString()
      .split(',')
      .map((temperament) => temperament.trim())
      .filter((temperament) => temperament.length > 1);
    const temperament = [...new Set(dogs)];
    await Temperament.bulkCreate(temperament.map((temp) => ({ name: temp })));
  } catch ({ message }) {
    console.log(message);
  }
};

module.exports = {
  getTemperaments,
  getAllTemperaments,
};
