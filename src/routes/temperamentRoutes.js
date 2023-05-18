const { Router } = require('express');
const {
  getAllTemperaments,
  postTemperaments,
  getTemperaments,
} = require('../controllers/temperamentController');

const router = Router();

router.get('/all', getAllTemperaments);
router.get('/', getTemperaments);
router.post('/', postTemperaments);

module.exports = router;
