const mongoose = require('mongoose');

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be longer than 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description can not be longer than 500 characters']
    },
    email: {
        type: String,
        match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Invalid email']
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating has to be at least 1'],
        min: [1, 'Rating can not be greater than 10']
    },
    careers: {
        type: [String],
        required: true,
        enum: ['Web Development', 'Mobile Development', 'UI/UX', 'Data Science', 'Business', 'Other']
    },
    averageCost: Number,
    slug: String,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: Boolean
})


// middleware for deleting bootcamp and all associated courses7
// this is gonna get triggered by the 'bootcamp.remove()' call in the delete method of the bootcamp controller
BootcampSchema.pre('remove', async function(next) {
    await this.model('Course').deleteMany({ bootcamp: this._id });
    next()
})
module.exports = mongoose.model('Bootcamp', BootcampSchema);