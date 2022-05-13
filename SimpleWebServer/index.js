'use strict'

const express = require('express')

const PORT = 3000
const HOST = '0.0.0.0'

const app = express();

app.get('/', (req, res) => {
    res.send('hello WOLRD')
})

const server = app.listen(PORT, HOST)

console.log(`running on http://${HOST}:${PORT}/`)