// Setup empty JS object to act as endpoint for all routes
const projectData = {}

// Require Express to run server and routes
const express = require('express')
// Start up an instance of app
const app = express()

//Dependencies
const bodyParser = require('body-parser')

// Middleware
//Here we are configuring express to use'body-parser'as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Cors for cross origin allowance
const cors = require('cors')
app.use(cors())

// Initializing the main project folder
app.use(express.static('website'))

// Setup Server
const port = process.env.PORT || 5050;

const server = app.listen(port, () => {
    console.log(`runing on port: ${port}`)
})


//routes
//a get route to send data to the user in the client-side
app.get('/getWeatherClientData', (req,res) => {
    res.send(projectData)
})
//a post route to save the data coming from the client-side to the server
app.post('/saveWeatherClientData', (req, res) => {
    //the specific data required to post in the client side
    projectData.maxTemp = req.body.maxTemp
    projectData.minTemp = req.body.minTemp
    projectData.country = req.body.country
    projectData.city = req.body.city
    projectData.date = req.body.date
    console.log('post saved!')
    //indication to the end of the request
    res.send()
})