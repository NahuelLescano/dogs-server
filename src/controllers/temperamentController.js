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

const postTemperaments = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.length === 0) {
      return res.status(500).json({ message: 'name is invalid' });
    }

    const existingTemperament = await Temperament.findOne({
      where: { name },
    });
    if (existingTemperament) {
      return res
        .status(500)
        .json({ message: 'Temperament was already created' });
    }

    const temperamentCreated = await Temperament.create({
      name,
    });
    return res.status(201).json({ success: true, temperamentCreated });
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
};

const getTemperaments = async (req, res) => {
  try {
    const { data } = await axios(ENDPOINT);
    const dogs = data
      .map((dog) => dog.temperament)
      .toString()
      .split(',')
      .map((temperament) => temperament.trim())
      .filter((temperament) => temperament.length > 1);
    const temperament = [...new Set(dogs)];
    const temp = await Temperament.bulkCreate(
      temperament.map((temp) => ({ name: temp }))
    );
    return res.status(200).json(temp);
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
};

module.exports = {
  getAllTemperaments,
  postTemperaments,
  getTemperaments,
};
