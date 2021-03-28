var socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', function(e) {
e.preventDefault();
if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
}
});

//Player controls
//Send controls
//Finish controls

window.addEventListener('keydown', function(e){
  e.preventDefault();
  if(e.keyCode==100){
  socket.emit('moveRight',e.keyCode);
  }
  if(e.keyCode==65){
  socket.emit('moveLeft',e.keyCode);
  }
});





socket.on('chat message', function(msg) {
var item = document.createElement('li');
item.textContent = msg;
messages.appendChild(item);
window.scrollTo(0, document.body.scrollHeight);
});

socket.on('paint game', function(state){
    paintGame(state);
})

socket.on('paint player', function(state){
    
    paintPlayer(state);
})

////////////////////////////////////////////
//////  Opening Game Splash ////////////////
////////////////////////////////////////////
window.addEventListener("click", function () {
    let splashTarget = document.querySelector(".splash-screen");
    let playGameAudio = document.querySelector("#splash-audio");
    // if (soundPlayed) {
    //   playGameAudio.play();
    //   soundPlayed = false;
    // }
    splashTarget.style.animation = "fade-out 2s 1 ease forwards";
    // if (splashTarget.style.opacity == 0) backgroundMusic.play();
  });
  let soundPlayed = true;

/////////////////////////
//images//////////////
/////////////////////////

let platform = new Image();
platform.src= './png-objects/long-platform.png'

let dog = new Image();
dog.src= './images/dog-r.png'



/////////////////////////
//Paint game 
/////////////////////////


let canvas= document.querySelector('canvas');
let ctx= canvas.getContext('2d');
canvas.width=1000;
canvas.height=500;

  function paintGame(state){
    paintStage(state.stage);
    paintPlayer(state)
  }


  function paintStage(stuff){
    //platform
    ctx.drawImage(platform,-100,canvas.height*0.9,canvas.width*1.2,50);

  }
  function paintPlayer(stuff){
      console.log(stuff)
    ctx.drawImage(dog,stuff.playerOne.sx,stuff.playerOne.sy,
        stuff.playerOne.sw,stuff.playerOne.sh,
        canvas.width/2,canvas.height/2,
        stuff.playerOne.w,stuff.playerOne.h,
        )  
  }
