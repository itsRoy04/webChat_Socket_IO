var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

var dbUrl = 'mongodb+srv://mr04:1dbK0Zp8vCtIDttp@cluster0.4h1jjsb.mongodb.net/?retryWrites=true&w=majority'

// var messages = [
//     { name: 'Tim', message: 'Hi' },
//     { name: 'Jane', message: 'Hello' }
// ]

var Message = mongoose.model('Message', {
    name: String,
    message: String
})

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) =>{
        res.send(messages)
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body)

    message.save((err) => {
        if (err)
            sendStatus(500)

        io.emit('message', req.body)
        res.sendStatus(200)
    })

})

io.on('connection', (socket) => {
    console.log('a user connected')
})

mongoose.connect(dbUrl, (err) => {
    console.log('Mongo db connection establish')
    if(err){
        console.log(err)
    }
})

var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})