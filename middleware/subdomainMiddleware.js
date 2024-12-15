const { Restaurant } = require('../models/restaurant');

const subdomainMiddleware = async (req, res, next) => {
    try {
        const host = req.headers.host;  
        console.log('Host:', host);

         if (!host || !host.includes('.')) {
            return res.status(400).json({ message: 'Invalid host. Subdomain required.' });
        }

        const subdomain = host.split('.')[0];  
        console.log('Extracted subdomain:', subdomain);

         const restaurant = await Restaurant.findOne({ subdomain });
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        console.log('Attaching restaurant to req.restaurant:', restaurant);
        req.restaurant = restaurant;  
        next();  
    } catch (error) {
        console.error('Error in subdomainMiddleware:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = subdomainMiddleware;
