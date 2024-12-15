const { Restaurant } = require('../models/restaurant');

const subdomainMiddleware = async (req, res, next) => {
    try {
        const host = req.headers.host; // Extract host from the request
        console.log('Host:', host);

        // Validate that the host includes a subdomain
        if (!host || !host.includes('.')) {
            return res.status(400).json({ message: 'Invalid host. Subdomain required.' });
        }

        const subdomain = host.split('.')[0]; // Extract subdomain
        console.log('Extracted subdomain:', subdomain);

        // Query the database for the restaurant
        const restaurant = await Restaurant.findOne({ subdomain });
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        console.log('Attaching restaurant to req.restaurant:', restaurant);
        req.restaurant = restaurant; // Attach the restaurant to the request object
        next(); // Proceed to the next middleware/route
    } catch (error) {
        console.error('Error in subdomainMiddleware:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = subdomainMiddleware;
