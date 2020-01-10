const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

/**************** task collection ****************/

router.post('/tasks', auth, async (req, res) => {
    //const task = new Task(req.body)     //creating new task
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)

    } catch(e) {
        res.status(400).send(e)
    }

    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

//Reading tasks (reading resources)
// GET /tasks?completed=true        // Filtering
// GET /tasks?limit=10&skip=0    first 10 contents, when skip=10: next 10 contents skipping the first ten, skip=20: 3rd page skipping first 20 contents.....   // Pagination
// GET /tasks?sortBy=createdAt:desc         // Sorting
router.get('/tasks', auth, async (req, res) => {
    const match = {}                            // filtering task whether completed or not
    const sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        //const tasks = await Task.find({})
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),       // Pagination
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)

    } catch(e) {
            res.status(500).send()
    }
    // Task.find({}).then((tasks) => {
    //     res.send(tasks)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

//Reading a single task using its id
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        //const task = await Task.findById({_id})
        const task = await Task.findOne({ _id, owner: req.user._id })

        if(!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch(e) {
        res.status(500).send()
    }
    // Task.findById(_id).then((task) => {
    //     if(!task) {
    //         return res.status(404).send()
    //     }

    //     res.send(task)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

//Updating a single task by its id
router.patch('/tasks/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if(!task) {
            return res.status(400).send()
        }

        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()

        res.send(task)
    } catch(e) {
        return res.status(500).send(e)
    }
})

//Deleting the task by its id
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        //const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if(!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch(e) {
        return res.status(500).send(e)
    }
})

module.exports = router