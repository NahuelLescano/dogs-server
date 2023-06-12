const { Router } = require('express');
const { getAllTemperaments } = require('../controllers/temperamentController');

const router = Router();

router.get('/', getAllTemperaments);

module.exports = router;
