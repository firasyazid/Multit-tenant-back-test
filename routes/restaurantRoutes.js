const express = require('express');
const router = express.Router();
const { Restaurant } = require('../models/restaurant');
const subdomainMiddleware = require('../middleware/subdomainMiddleware');

// Create a new restaurant
router.post('/', async (req, res) => {
    try {
        const { name, logo } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Le nom du restaurant est requis.' });
        }

        // Generate a unique subdomain
        let baseSubdomain = name.toLowerCase().replace(/\s+/g, '');
        let subdomain = baseSubdomain;
        let count = 1;

        // Ensure subdomain is unique
        while (await Restaurant.findOne({ subdomain })) {
            subdomain = `${baseSubdomain}${count}`;
            count++;
        }

        const restaurant = new Restaurant({
            name,
            logo: logo || 'default-logo.png',
            subdomain,
        });

        await restaurant.save();

        res.status(201).json({
            message: 'Restaurant créé avec succès',
            restaurant,
        });
    } catch (error) {
        console.error('Erreur lors de la création du restaurant :', error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});

// Get all restaurants
router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.status(200).json(restaurants);
    } catch (error) {
        console.error('Erreur lors de la récupération des restaurants :', error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});

router.get('/info', subdomainMiddleware, (req, res) => {
    console.log('Inside /info route:', req.restaurant);

    if (!req.restaurant) {
        return res.status(404).json({ message: 'No restaurant associated with this subdomain.' });
    }

    res.status(200).json(req.restaurant);
});

router.get('/:subdomain', async (req, res) => {
    try {
        const subdomain = req.params.subdomain;

         const restaurant = await Restaurant.findOne({ subdomain });
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        res.status(200).json(restaurant);
    } catch (error) {
        console.error('Error fetching restaurant data:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


 

module.exports = router;
