const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);




//Serve necessary files to client

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); 
  });
app.get('/client.js', (req,res) => {
    res.sendFile(__dirname + '/client.js');
});
app.get('/style.css', (req,res)=>{
    res.sendFile(__dirname + '/style.css');
})
app.get('/images/c2d-background-blood.png', (req,res) => {
    res.sendFile(__dirname + '/images/c2d-background-blood.png');
})
app.get('/images/bloody-background.png', (req,res) => {
    res.sendFile(__dirname + '/images/bloody-background.png');
})
app.get('/images/c2d-background.png', (req,res)=> {
    res.sendFile(__dirname + '/images/c2d-background.png');
})
app.get('/images/dead-dog.png', (req,res) => {
    res.sendFile(__dirname + '/images/dead-dog.png');
})
app.get('/images/dead-cat.png', (req,res) => {
    res.sendFile(__dirname + '/images/dead-cat.png');
})
app.get('/images/Gameover-new-2.png', (req,res) => {
    res.sendFile(__dirname + '/images/Gameover-new-2.png');
})
app.get('/images/c2d-background-dark-2.JPG', (req,res) => {
    res.sendFile(__dirname + '/images/c2d-background-dark-2.JPG');
})
app.get('/images/play-splash.png', (req,res) => {
    res.sendFile(__dirname + '/images/play-splash.png');
})
app.get('/images/c2dlogo2.png', (req,res) => {
    res.sendFile(__dirname + '/images/c2dlogo2.png');
})
app.get('/images/blood-dog-1.png', (req,res) => {
    res.sendFile(__dirname + '/images/blood-dog-1.png');
})
app.get('/images/fight-time.png', (req,res) => {
    res.sendFile(__dirname + '/images/fight-time.png');
})
app.get('/images/jeffrey-icon.png', (req,res) => {
    res.sendFile(__dirname + '/images/jeffrey-icon.png');
})
app.get('/images/blood-cat.png', (req,res) => {
    res.sendFile(__dirname + '/images/blood-cat.png');
})
app.get('/images/ted-icon.png', (req,res) => {
    res.sendFile(__dirname + '/images/ted-icon.png');
})
app.get('/png-objects/long-platform.png', (req,res) => {
    res.sendFile(__dirname + '/png-objects/long-platform.png');
})
app.get('/images/dog-r.png', (req,res)=>{
    res.sendFile(__dirname + '/images/dog-r.png');
})



let state='red';
let superState={
    playerOne:{
        x: 200,
        y: 200,
        w: 200,
        h: 200,
        sx: 50,
        sy: 50,
        sw: 50,
        sh: 50
    }
}
//Communication with client

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
    
    setInterval(()=>{
        superState.playerOne.h+=20;
        io.emit('paint game', superState)
    },1000);
   
    
  });
});



http.listen(3000, () => {
  console.log('listening on *:3000');
});

