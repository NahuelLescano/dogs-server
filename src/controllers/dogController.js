const { Dog, Temperament, Op } = require('../db');
const axios = require('axios');
const { ENDPOINT } = process.env;

const getAllDogs = async (req, res) => {
  try {
    const dogsDb = await Dog.findAll({ include: { model: Temperament } });
    const dogsApi = await axios(ENDPOINT);
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
    const { weight, height, name, life_span, image, temperaments } = req.body;
    console.log(req.body);
    if (
      !weight ||
      !height ||
      !name ||
      name.length === 0 ||
      !life_span ||
      life_span.length === 0 ||
      !image ||
      image.length === 0
    ) {
      return res.status(500).json({ message: 'Missing data.' });
    }
    const dogExisting = await Dog.findOne({
      where: { name },
    });
    if (dogExisting) {
      return res.status(500).json({ message: 'Dog already exists.' });
    }

    const dogCreated = await Dog.create({
      image: image.url,
      name,
      height,
      weight,
      life_span,
    });
    if (temperaments.length > 1) {
      const temperPromise = temperaments.map(async (temp) => {
        await Temperament.findByPk(temp);
        await dogCreated.addTemperaments(temp);
      });

      await Promise.all(temperPromise).catch((error) =>
        res.status(500).json({ message: error.message })
      );
    }
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
