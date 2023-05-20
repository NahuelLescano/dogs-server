const { Dog, Temperament, Op } = require('../db');
const axios = require('axios');
const { ENDPOINT } = process.env;

const getAllDogs = async (req, res) => {
  try {
    const dogsDb = await Dog.findAll({ include: { model: Temperament } });
    const dogsApi = await axios(ENDPOINT);
    const allDogs = [
      ...dogsApi.data.map((dog) => ({
        ...dog,
        image: dog.image.url,
      })),
      ...dogsDb,
    ];
    return res.status(200).json(allDogs);
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
};

const getDogsByIdBreed = async (req, res) => {
  try {
    const { id } = req.params;
    // request to the database
    if (id.includes('-')) {
      const dogsDb = await Dog.findAll({
        include: [{ model: Temperament }],
        where: { id },
      });

      return res.status(200).json(dogsDb);
    }

    // request to API
    const { data } = await axios.get(ENDPOINT);

    const dogs = [];
    if (data) {
      const dogId = data.filter((dog) => dog.id == id);
      dogs.push(dogId);
    }

    if (dogs.length === 0) {
      return res.status(404).json({ message: 'Dog not found' });
    }
    return res.status(200).json(dogs);
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
};

const getDogsByName = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name || name.length === 0) {
      return res.status(400).json({ message: 'Must introduce a valid name' });
    }
    const dogApi = await axios(`${ENDPOINT}search?q=${name}`);
    const dogApiFound = dogApi.data.filter(
      (dog) => dog.name.toLowerCase() === name.toLowerCase()
    );

    const dogDb = await Dog.findOne({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
    });

    const allDogs = [...dogApiFound, ...[dogDb]];
    return res.status(200).json({ allDogs });
  } catch ({ message }) {
    return res.status(500).json(message);
  }
};

const postDogs = async (req, res) => {
  try {
    const { weight, height, name, life_span, image, temperament } = req.body;
    if (
      !weight ||
      !height ||
      !name ||
      name.length === 0 ||
      !life_span ||
      life_span.length === 0 ||
      !image ||
      image.length === 0 ||
      !temperament
    ) {
      return res.status(500).json({ message: 'Missing data' });
    }
    const dogExisting = await Dog.findOne({
      where: { name },
    });
    if (dogExisting) {
      return res.status(500).json({ message: 'Dog already exists.' });
    }

    const temperamentExisting = await Temperament.findByPk(temperament);
    if (!temperamentExisting) {
      return res.status(500).json({ message: 'Temperament do not exist' });
    }
    const dogCreated = await Dog.create({
      image,
      name,
      height,
      weight,
      life_span,
    });
    dogCreated.addTemperaments(temperament);
    return res.status(201).json({ message: 'Dog was added successfully' });
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
};

module.exports = {
  getAllDogs,
  getDogsByIdBreed,
  getDogsByName,
  postDogs,
};
