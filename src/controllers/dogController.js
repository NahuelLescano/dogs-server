const { Dog, Temperament, Op } = require('../db');
const axios = require('axios');
const { ENDPOINT } = process.env;

const getAllDogs = async (req, res) => {
  try {
    const dogsDb = await Dog.findAll({
      include: { model: Temperament, through: {} },
    });
    const allDogs = [
      ...dogsApi.data.map((dog) => {
        const temper = dog.temperament ? dog.temperament.split(', ') : [];
        return {
          ...dog,
          image: dog.image.url,
          temperament: temper,
        };
      }),
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
      return res.status(200).json(dogsDb[0]);
    }

    // request to API
    const { data } = await axios.get(ENDPOINT);

    let dogId = data && data.filter((dog) => dog.id == id);
    dogId = {
      ...dogId[0],
      image: dogId[0].image.url,
    };

    if (!dogId) {
      return res.status(404).json({ message: 'Dog not found.' });
    }
    return res.status(200).json(dogId);
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
};

const getDogsByName = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name || name.length === 0) {
      return res.status(400).json({ message: 'Write a valid name.' });
    }
    const dogApi = await axios(`${ENDPOINT}search?q=${name}`);
    const dogApiFound = dogApi.data.filter(
      (dog) => dog.name.toLowerCase() === name.toLowerCase()
    );

    const dogDb = await Dog.findOne({
      include: { model: Temperament, through: {} },
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
    });

    const allDogs = [...dogApiFound, ...[dogDb]];
    return res.status(200).json(allDogs);
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
      !life_span ||
      !image ||
      !temperament ||
      temperament.length === 0
    ) {
      return res.status(400).json({ message: 'Missing data.' });
    }

    if (temperament.length < 2) {
      return res
        .status(400)
        .json({ message: 'Add at least two temperaments.' });
    }

    const setTemp = new Set(temperament);
    if (setTemp.size !== temperament.length) {
      return res
        .status(400)
        .json({ message: 'Each temperament must be different.' });
    }
    const dogExisting = await Dog.findOne({
      where: { name },
    });
    if (dogExisting) {
      return res.status(400).json({ message: 'Dog already exists.' });
    }

    const existingTemperament = await Temperament.findAll({
      where: { name: temperament },
    });

    if (!existingTemperament) {
      return res
        .status(500)
        .json({ message: 'Temperament does not exist in the database.' });
    }

    const dogCreated = await Dog.create({
      image,
      name,
      height,
      weight,
      life_span,
    });

    await dogCreated.addTemperaments(existingTemperament);

    return res.status(201).json({ message: 'Dog was successfully created.' });
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
