const express = require('express')      //including express library
require('./db/mongoose')        //connecting to mongoose database
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
// const port = process.env.PORT || 3000            //for local machine
const port = process.env.PORT           // for heroku deployment (creation of dev.env to store PORT)

// app.use((req, res, next) => {
//     // console.log(req.method, req.path)
//     // next()
//     if (req.method === "GET") {
//         res.send('GET requests are disabled')
//     } else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down. Check back soon!')
// })


// File uploads.. npm i multer
// const multer = require('multer')
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         // if (!file.originalname.endsWith('.pdf')) {
//         if (!file.originalname.match(/\.(doc|docx)$/)) {        // Used regex for .doc or .docx file extension
//             return cb(new Error('Please upload a Word document'))
//         }

//         cb(undefined, true)

//         // cb(new Error('File must be a PDF'))
//         // cb(undefined, true)
//         // cb(undefined, false)
//     }
// })

// app.post('/upload', upload.single('upload'), (req, res) => {        //type the same key name 'upload' in postman as written inside single
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })      // setting up json error message instead of html
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

// const bcrypt = require('bcryptjs')       //npm i bcrypt
// const jwt = require('jsonwebtoken')     //npm i jsonwebtoken

// const myFunction = async () => {

//     /********* json web token for authentication *********/
//     //create a new token
//     const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', { expiresIn: '7 days' })  //token expires in 7 days
//     console.log(token)

//     //verify the token
//     const data = jwt.verify(token, 'thisismynewcourse')
//     console.log(data)

//     /************ bcrypt library to store hashed password ************/
//     // const password = 'Red12345!'
//     // const hashedPassword = await bcrypt.hash(password, 8)

//     // console.log(password)
//     // console.log(hashedPassword)

//     // const isMatch = await bcrypt.compare('Red1234!', hashedPassword)
//     // console.log(isMatch)
// }

// myFunction()

// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//     // const task = await Task.findById('5e145ab3984d9e0641cba35d')
//     // await task.populate('owner').execPopulate()         //grab all the owner details
//     // console.log(task.owner)

//     const user = await User.findById('5e1459b4dcecd90634fe2cc6')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()