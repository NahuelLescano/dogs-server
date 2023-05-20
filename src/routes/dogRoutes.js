const { Router } = require('express');
const {
  getAllDogs,
  getDogsByIdBreed,
  getDogsByName,
  postDogs,
} = require('../controllers/dogController');

const router = Router();

router.get('/', getAllDogs);
router.get('/id/:id', getDogsByIdBreed);
router.get('/name', getDogsByName);
router.post('/', postDogs);

module.exports = router;
