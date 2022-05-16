'use strict'

const express = require('express')
const cars = require('./cars')

const PORT = 3000
const HOST = '0.0.0.0'

const app = express();

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

let asyncMethod = async () => "4. Async/await"

app.get('/nexttickasync', async (req, res) => {
    console.log('')

    //this will execute last
    setTimeout(() => {
        console.log("1. setTimeout")
    }, 0)

    // wait for this to complete
    process.nextTick(() => {
        console.log("2. nextTick")
    })

    // then wait for this
    new Promise((resolve, reject) => resolve('3. Promise'))
        .then(console.log)
    
    // then wait for this
    await asyncMethod()
        .then(console.log)

    await new Promise((resolve, reject) => 
        setTimeout(() =>    
            resolve("5. promise timeout", 100)))
        .then(console.log)

    console.log("6. current tick")

    res.send()
})

app.get('/nexttick', (req, res) => {
    console.log('')
    
    // execute this at the end of the following tick
    setTimeout(() => {
        console.log("1. setTimeout")
    }, 0)

    // execute this at the beginning of the next tick
    process.nextTick(() => {
        console.log("2. nextTick")
    })

    // queue this after .nextTick
    new Promise((resolve, reject) => resolve('3. Promise'))
        .then(console.log)

    // queue this after promise
    asyncMethod()
        .then(console.log)

    // queue this after async method
    new Promise((resolve, reject) =>
        // queue this after previous setTimeout 
        setTimeout(() =>    
            resolve("5. promise timeout", 100)))
        .then(console.log)

    // execute this now
    console.log("6. current tick")

    res.send()
})

const server = app.listen(PORT, HOST)

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Process terminated')
    })
})
console.log(`running on http://${HOST}:${PORT}/`)