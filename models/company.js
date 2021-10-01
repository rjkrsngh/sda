const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    employees: [{
        type: ObjectId, 
        ref: 'User'
    }],
    address: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
});


mongoose.model('Company', companySchema);