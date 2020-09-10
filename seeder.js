const mongoose = require('mongoose');
const dotenv = require('dotenv');
const asyncHandler = require('./middleware/asyncHandler')
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const fs = require('fs');
dotenv.config({ path: './config/config.env' });

const bootcamps = require('./seedDatas/bootcamps.json')
const courses = require('./seedDatas/courses.json');

mongoose.connect(process.env.mongo_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

const importData = async() => {
    try {
        console.log('Seeding Data...')
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        console.log('Done')
        process.exit()
    } catch (error) {
        console.log(error)
    }
}

const deleteData = async() => {
    try {
        console.log('Deleting Data...')
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        console.log('Done')
        process.exit()
    } catch (error) {
        console.log(error)
    }
}

if (process.argv[2] === '-seed') {
    importData();
}

if (process.argv[2] == '-delete') {
    deleteData();
}

// console.log('dummyData =>> ', dummyData)
// console.log('dummyData222222222222 =>> ', dummyData2)