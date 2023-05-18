const { Router } = require('express');
const {
  getDogs,
  getDogsByIdBreed,
  getDogsByName,
  postDogs,
} = require('../controllers/dogController');

const router = Router();

router.get('/', getDogs);
router.get('/id/:id', getDogsByIdBreed);
router.get('/name', getDogsByName);
router.post('/', postDogs);

module.exports = router;
