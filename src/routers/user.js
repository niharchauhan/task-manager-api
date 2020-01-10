const express = require('express')
const User = require('../models/user')   //define model 'User' in a separate file
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')      // npm i sharp
const router = new express.Router()
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')

/*********** users collection *************/

//Signup user
router.post('/users', async (req, res) => {
    // console.log(req.body)       //grab data from postman
    // res.send('testing')
    const user = new User(req.body)     //creating a new user (Resource creation)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token})

    } catch (e) {
        res.status(400).send(e)
    }
    
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

//Login user
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch(e) {
        res.status(400).send()
    }
})

//Logout user
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

//Logout All from all the sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


//Reading user/reading profile (reading resources)
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
    // try {   
    //     const users = await User.find({})
    //     res.send(users)

    // } catch {
    //     res.status(500).send()
    // }

    // User.find({}).then((users) => {
    //     res.send(users)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

//Reading a single user using its id
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id

//     try {
//         const user = await User.findById(_id)
//         if(!user) {
//             return res.status(404).send()
//         }

//         res.send(user)
//     } catch(e) {
//         res.status(500).send()
//     }

//     // User.findById(_id).then((user) => {
//     //     if(!user) {
//     //         return res.status(404).send()
//     //     }

//     //     res.send(user)
//     // }).catch((e) => {
//     //     res.status(500).send()
//     // })
// })

//Updating the logged in user
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation) {
        return res.status(400).send( { error: 'Invalid updates!' } )
    }

    try {
        // const user = await User.findById(req.user._id)

        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        await req.user.save()

        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        // if(!user) {
        //     return res.status(404).send()
        // }

        res.send(req.user)
    } catch(e) {
        res.status(400).send(e)
    }
})

//Deleting the logged in user
router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)

        // if(!user) {
        //     return res.status(404).send()
        // }

        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch(e) {
        return res.send(500).send()
    }
})

// File uploads
const upload = multer({
    // dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload JPG, JPEG or PNG image'))
        }

        cb(undefined, true)
    }
})

// Uploading the users profile picture
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()        // sharp is used to convert img format and crop the image
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })      // setting up json error message instead of html
})

// Deleting the users profile picture
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

// Fetching the users profile picture
// in the browser: localhost:3000/users/'..theid..'/avatar
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router