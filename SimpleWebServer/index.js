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

const server = app.listen(PORT, HOST)

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Process terminated')
    })
})
console.log(`running on http://${HOST}:${PORT}/`)