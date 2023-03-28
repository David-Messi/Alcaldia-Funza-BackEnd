
const { Router } = require('express');
const { buscarUsuario } = require('../controllers/buscar');

const router = Router();


// router.get('/:coleccion/:termino', buscar )



router.get('/user/:termino', buscarUsuario )




module.exports = router;