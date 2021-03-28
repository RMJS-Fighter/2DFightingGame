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

/////////////////////////////////////////////////
////////// Player Controls /////////////////////
////////////////////////////////////////////////

window.addEventListener('keydown', function(e){
  e.preventDefault();
  console.log(e.keyCode)
  if(e.keyCode==68){
  socket.emit('moveRight',e.keyCode);
  }
  if(e.keyCode==65){
  socket.emit('moveLeft',e.keyCode);
  }
  if(e.keyCode == 87){
    socket.emit('moveUp', e.keyCode)
  }
  if(e.keyCode == 83){
    socket.emit('moveBlock', e.keyCode)
  }
  // if(e.keyCode == 74){
  //   socket.emit('attack1', e.keyCode)
  // }
  // if(e.keyCode == 76){
  //   socket.emit('attack2',e.keyCode)
  // }
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

////////////////////////////////////////////////
///////////// Images ///////////////////////////
////////////////////////////////////////////////

let platform = new Image();
platform.src= './png-objects/long-platform.png'

let dog = new Image();
dog.src= './images/dog-r.png'

let cat = new Image();
cat.src = './images/kitty-r.png'



/////////////////////////////////////////////////
/////////// Paint Game ////////////////////////// 
/////////////////////////////////////////////////


let canvas= document.querySelector('canvas');
let ctx= canvas.getContext('2d');
canvas.width=1000;
canvas.height=500;

  function paintGame(state){
    paintStage(state.floor);
    paintPlayer(state.player1);
    paintPlayer(state.player2);
  }


  function paintStage(stuff){
    //platform
    ctx.drawImage(platform, stuff.x, stuff.y, stuff.w, stuff.h);

  }
  function paintPlayer(stuff){
      console.log(stuff)
    ctx.drawImage(dog,stuff.sx, stuff.sy, 
        stuff.sw, stuff.sh, 
        stuff.x, stuff.y, 
        stuff.w, stuff.h,
        )  
        ctx.drawImage(cat,stuff.sx, stuff.sy, 
          stuff.sw, stuff.sh, 
          stuff.x, stuff.y, 
          stuff.w, stuff.h,
        )  
  }
