'use strict'

const express = require('express')
const cars = require('./cars')
const path = require('path')

const PORT = 3000
const HOST = '0.0.0.0'

const app = express();

app.use(
    express.urlencoded({
        extended: true,
    }))
app.use(express.json())

app.get('/path', (req, res) => {
    console.log(path.join('$','hello','world')) // $/hello/world
    console.log(path.join('C:','hello','world')) // C:/hello/world
    console.log(path.join('/','hello','world')) // /hello/world
    console.log(path.join('hello','world')) // hello/world

    res.send()
})

app.get('/', (req, res) => {
    res.send('hello WOLRD')
})

app.get('/kill', (req, res) => {
    res.send('killed')
    process.kill(process.pid, 'SIGTERM')
})

app.get('/amiondocker', (req, res) => {
    if (process.env.IS_DOCKER === "true")
    {
        res.send('yes')
        return
    }
    res.send('no')
})

app.get('/argument', (req, res) => {
    const args = require('minimist')(process.argv.slice(2))
    if (args.argument)
    {
        res.send(args.argument)
        return
    }
    res.send('no argument')    
})

app.get('/cars', (req, res) => {    
    res.send(cars)
})

let asyncMethod = async (log) => log

app.get('/nexttickasync', async (req, res) => {
    console.log('')

    //this will execute last
    setTimeout(() => console.log("1. setTimeout"), 0)

    setImmediate(() => console.log("2. setImmediate"))

    // wait for this
    new Promise((resolve, reject) => resolve('2. Promise'))
        .then(console.log)
    
    // wait for this
    await asyncMethod("3. async method")
        .then(console.log)
    
    // wait for this to complete
    process.nextTick(() => {
        console.log("4. nextTick")
    })

    // by awaiting this, our macroqueue will be executed 
    // prior to resolving the promise
    await new Promise((resolve, reject) => 
        // wait for this
        setTimeout(() =>    
            resolve("5. promise timeout", 100)))
        .then(console.log)

    console.log("6. current tick")

    res.send()
})

app.get('/nexttick', (req, res) => {
    console.log('')
    
    // queue this into the macrotask queue
    setTimeout(() => console.log("1. setTimeout"), 0)

    // insert this before setTimeout into the macrotask queue??
    setImmediate(() => console.log("2. setImmediate"))

    // queue into the promises microtask queue
    new Promise((resolve, reject) => resolve('3. Promise'))
        .then(console.log)

    // queue this into the promises microtask queue
    asyncMethod("4. async method")
        .then(console.log)
    
    // quque this into the nextTick queue
    process.nextTick(() => {
        console.log("5. nextTick")
    })

    // queue this after async method
    new Promise((resolve, reject) =>
        // queue this after previous setTimeout 
        setTimeout(() =>    
            resolve("6. promise timeout", 100)))
        .then(console.log)

    // execute this now
    console.log("7. current tick")

    res.send()
})

app.post('/todos', (req, res) => {
    console.log(req.body.todo)
    res.send()
})

const server = app.listen(PORT, HOST)

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Process terminated')
    })
})
console.log(`running on http://${HOST}:${PORT}/`)