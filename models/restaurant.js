const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },  
    logo: { 
        type: String, 
        default: 'default-logo.png' 
    },  
    subdomain: {
         type: String, unique: true, required: true, lowercase: true 
        },

    createdAt: { 
        type: Date, 
        default: Date.now 
    }  
});

 RestaurantSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

RestaurantSchema.set('toJSON', {
    virtuals: true,
});



  
exports.Restaurant = mongoose.model('Restaurant', RestaurantSchema);
exports.RestaurantSchema = RestaurantSchema;
