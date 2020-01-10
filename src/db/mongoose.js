const mongoose = require("mongoose")  //require mongoose library, to install mongoose - npm i mongoose
// const validator = require("validator")   //npm i validator
 
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})

//defining the model
// const User = mongoose.model('User', {
//     name: {
//         type: String,
//         required: true,     //field is required
//         trim: true          //trim the extra spaces in the name
//     },
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true,
//         validate(value) {               //custom validator
//             if(!validator.isEmail(value)) {         //used validator library
//                throw new Error('Email is invalid!') 
//             }
//         }
//     },
//     password: {
//         type: String,
//         required: true,
//         trim: true,
//         minlength: 7,
//         validate(value) {
//             if(value.toLowerCase().includes('password')) {
//                 throw new Error('Password cannot contain "password"!!')
//             }
//         }
//     },
//     age: {
//         type: Number,
//         default: 0,
//         validate(value) {               //custom validator
//             if(value < 0) {
//                 throw new Error('Age must be positive number')
//             }
//         }
//     }
// })

//creating the instance of it
// const me = new User({
//     name: '    Nihar   ',
//     email: 'NIHAR9@GMAIL.COM  ',
//     password: ' Password '
// })

// // //saving the instance to the database
// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log('Error!!', error)
// })

// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         trim: true,
//         required: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     }
// })

// const task = new Task({
//     description: '  Task1   ',
//     completed: true
// })

// task.save().then(() => {
//     console.log(task)
// }).catch((error) => {
//     console.log('Error!!', error)
// })