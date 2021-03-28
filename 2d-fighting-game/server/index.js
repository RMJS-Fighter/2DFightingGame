const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const STAGE_WIDTH = 1000;
const STAGE_HEIGHT = 500;

//Serve necessary files to client

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/client.js", (req, res) => {
  res.sendFile(__dirname + "/client.js");
});
app.get("/style.css", (req, res) => {
  res.sendFile(__dirname + "/style.css");
});
app.get("/images/c2d-background-blood.png", (req, res) => {
  res.sendFile(__dirname + "/images/c2d-background-blood.png");
});
app.get("/images/bloody-background.png", (req, res) => {
  res.sendFile(__dirname + "/images/bloody-background.png");
});
app.get("/images/c2d-background.png", (req, res) => {
  res.sendFile(__dirname + "/images/c2d-background.png");
});
app.get("/images/dead-dog.png", (req, res) => {
  res.sendFile(__dirname + "/images/dead-dog.png");
});
app.get("/images/dead-cat.png", (req, res) => {
  res.sendFile(__dirname + "/images/dead-cat.png");
});
app.get("/images/Gameover-new-2.png", (req, res) => {
  res.sendFile(__dirname + "/images/Gameover-new-2.png");
});
app.get("/images/c2d-background-dark-2.JPG", (req, res) => {
  res.sendFile(__dirname + "/images/c2d-background-dark-2.JPG");
});
app.get("/images/play-splash.png", (req, res) => {
  res.sendFile(__dirname + "/images/play-splash.png");
});
app.get("/images/c2dlogo2.png", (req, res) => {
  res.sendFile(__dirname + "/images/c2dlogo2.png");
});
app.get("/images/blood-dog-1.png", (req, res) => {
  res.sendFile(__dirname + "/images/blood-dog-1.png");
});
app.get("/images/fight-time.png", (req, res) => {
  res.sendFile(__dirname + "/images/fight-time.png");
});
app.get("/images/jeffrey-icon.png", (req, res) => {
  res.sendFile(__dirname + "/images/jeffrey-icon.png");
});
app.get("/images/blood-cat.png", (req, res) => {
  res.sendFile(__dirname + "/images/blood-cat.png");
});
app.get("/images/ted-icon.png", (req, res) => {
  res.sendFile(__dirname + "/images/ted-icon.png");
});
app.get("/png-objects/long-platform.png", (req, res) => {
  res.sendFile(__dirname + "/png-objects/long-platform.png");
});
app.get("/images/dog-r.png", (req, res) => {
  res.sendFile(__dirname + "/images/dog-r.png");
});
app.get("/images/kitty-r.png", (req, res) => {
  res.sendFile(__dirname + "/images/kitty-r.png");
});
app.get("/images/kitty-l.png", (req, res) => {
  res.sendFile(__dirname + "/images/kitty-l.png");
});

let state = "red";
let superState = {
  playerOne: {
    x: 200,
    y: 200,
    w: 200,
    h: 200,
    sx: 50,
    sy: 50,
    sw: 50,
    sh: 50,
  },
};

//create game state logic. based gamewindow.js class CanvasDisplay
class GameState {
  constructor(p1id, p2id) {
    this.player1 = new Player(p1id, 30, 350, 100, 100, "right");
    // this.player2 = new Player(p2id, 30, 50, 100, 100, "right");
    this.player2 = new Player(p2id, 855, 350, 100, 100, "left");
    this.floor = new Barrier(-100, STAGE_HEIGHT * 0.9, STAGE_WIDTH * 1.2, 50);
  }
  sendState() {
    return {
      player1: {
        dir: this.player1.direction,
        img: this.player1.img,
        sx: this.player1.sx,
        sy: this.player1.sy,
        sw: this.player1.sw,
        sh: this.player1.sh,
        x: this.player1.x,
        y: this.player1.y,
        w: this.player1.w,
        h: this.player1.h,
      },
      player2: {
        dir: this.player2.direction,
        img: this.player2.img,
        sx: this.player2.sx,
        sy: this.player2.sy,
        sw: this.player2.sw,
        sh: this.player2.sh,
        x: this.player2.x,
        y: this.player2.y,
        w: this.player2.w,
        h: this.player2.h,
      },
      floor: {
        x: this.floor.x,
        y: this.floor.y,
        w: this.floor.w,
        h: this.floor.h,
        img: this.floor.img,
      },
    };
  }
}

class Barrier {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
  }
  update(ctx) {
    this.draw(ctx);
  }
}

class Player {
  constructor(id, x, y, w, h, direction) {
    this.img = //"./images/dog-r.png";
    // this.img= "./images/kitty-r.png";
    // this.img= "./images/kitty-l.png";
    this.rImg = //"./images/dog-l.png";
    this.id = id;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.velX = 0;
    this.velY = 0;
    this.speed = 5;
    this.jumping = false;
    this.grounded = false;

    this.sx = 0; //frame of animation
    //   const reSize = () => {
    this.sy = 879 / 5; //animation type
    this.sw = 2000 / 10;
    this.sh = 879 / 5;
    //   };
    //   reSize();
    //   img.onload = reSize;
    this.numberTall = 5;
    this.numberWide = 10;
    this.health = 100;
    this.special = 0;
    this.keepLooping = true;
    this.direction = direction;
    this.blocking = false;
  }

  draw(ctx) {
    //dead
    if (frame % 3 === 0 && this.special < 100) {
      this.special = this.special + 2;
      // if (this.img === cat) {
      //   document.querySelector("#energy-1").style.width = `${this.special}%`;
      // } else {
      //   document.querySelector("#energy-2").style.width = `${this.special}%`;
      // }
    }

    if (this.sy === 0 && frame % 20 === 0) {
      this.sx += this.sw;
    }
    // Idle-foolishness
    // if (this.sy === this.sh*3 && frame % 10 === 0){
    //   this.sx += this.sw
    // }
    if (this.sy === this.sh * 4 && frame % 5 === 0) {
      this.sx += this.sw;
    }

    if (this.sx >= (this.numberWide - 1) * this.sw) {
      if (this.keepLooping) {
        this.sx = 0;
      } else {
        this.sx = (this.numberWide - 1) * this.sw;
      }
    }
    if (this.direction === "left") {
      ctx.drawImage(
        this.img,
        this.sx,
        this.sy,
        this.sw,
        this.sh,
        this.x,
        this.y,
        this.w,
        this.h
      );
    } else {
      ctx.drawImage(
        this.rImg,
        this.sx,
        this.sy,
        this.sw,
        this.sh,
        this.x,
        this.y,
        this.w,
        this.h
      );
    }
  }
  update(ctx) {
    this.draw(ctx);
    this.lowHealth();
  }
  jump() {
    this.velY = -this.speed * 2;
    this.y = this.y + this.velY;
    this.fall();
  }
  dead() {
    this.numberWide = 10; //how many dead frames you have
    this.sy = 0;
    this.keepLooping = false;
  }
  fall() {
    this.numberWide = 8;
    this.sy = this.sh;
  }
  hurt() {
    this.numberWide = 10;
    this.sy = this.sh * 2;
  }
  idle() {
    this.numberWide = 10;
    this.sy = this.sh * 3;
  }
  run() {
    this.numberWide = 8;
    this.sy = this.sh * 4;
  }
  moveRight() {
    if (this.velX < 0) {
      this.velX = 0;
    }
    if (this.velX < this.speed) {
      this.velX = this.velX + 4;
    }
    this.x += this.velX;
    this.direction = "right";
  }
  moveLeft() {
    if (this.velX > 0) {
      this.velX = 0;
    }
    if (this.velX > -this.speed) {
      this.velX = this.velX - 4;
    }
    this.x += this.velX;
    this.direction = "left";
  }
  receiveDamageP1(multiplier) {
    if (this.blocking === false) {
      this.health -= 10 * multiplier;
      // hit1Sound.play();
      if (player2.direction === "right") {
        this.y -= this.h * 1;
        this.x += this.w;
      } else {
        this.y -= this.h * 1;
        this.x -= this.w;
      }
    } else {
      this.health -= 2 * multiplier;
      // hit2Sound.play();
    }
    bloodP1.sx = 0;
    bloodP1.sy = 0;
    bloodP1.y = this.y;
    bloodP1.x = this.x;
    //   if (this.health < 50) {
    //     document.querySelector(
    //       "#hp-1"
    //     ).style.cssText = `width: ${this.health}%; background-image: linear-gradient(#ff0404, #ec4141, #f16a63,  #ec4141, #ff0404)`;
    //     document.querySelector(".player1").style.cssText =
    //       "animation: healthGlow 2s infinite;";
    //   }
    //   document.querySelector("#hp-1").style.width = `${this.health}%`;
  }
  receiveDamageP2(multiplier) {
    if (this.blocking === false) {
      this.health -= 10 * multiplier;
      // hit3Sound.play();
      if (player1.direction === "right") {
        this.y -= this.h * 1;
        this.x -= this.w;
      } else {
        this.y -= this.h * 1;
        this.x -= this.w;
      }
    } else {
      // hit4Sound.play();
      this.health -= 2 * multiplier;
    }

    bloodP2.sx = 0;
    bloodP2.sy = 0;
    bloodP2.y = this.y;
    bloodP2.x = this.x;
    //   if (this.health < 50) {
    //     document.querySelector(
    //       "#hp-2"
    //     ).style.cssText = `width: ${this.health}%; background-image: linear-gradient(#ff0404, #ec4141, #f16a63,  #ec4141, #ff0404)`;
    //     document.querySelector(".player2").style.cssText =
    //       "animation: healthGlow 2s infinite;";
    //   }
    //   document.querySelector("#hp-2").style.width = `${this.health}%`;
  }
  drawBlockP1() {
    shieldP1.sx = shieldP1.sw * 4;
    shieldP1.sy = 0;
    shieldP1.y = this.y - this.h * 1.5;
    shieldP1.x = this.x - this.w * 1.2;
    this.blocking = true;
  }
  drawBlockP2() {
    shieldP2.sx = shieldP2.sw * 4;
    shieldP2.sy = 0;
    shieldP2.y = this.y - this.h * 1.5;
    shieldP2.x = this.x - this.w * 1.05;
    this.blocking = true;
  }
  lowHealth() {
    //   if (this.health <= 40) {
    //     let lowHealthDarkBg = document.querySelector("#low-health-bg");
    //     lowHealthDarkBg.style.animation = "fade-in 1.5s ease-in forwards";
    //   }
  }
}

function checkForPlayer2(stuff) {
//   console.log(stuff);
if(connectedPlayers.length ==2) {
    checkforPlayer2
}
}
function addPlayer(id) {
  connectedPlayers.push(id);
  if (connectedPlayers.length == 2) {
    currentGame = new GameState(id);
  }
}

let currentGame;
let connectedPlayers = [];

function removePlayer(id) {
  let index = connectedPlayers.indexOf(id);
  connectedPlayers.splice(index, 1);
}

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
  socket.on("disconnect", () => {
    removePlayer(socket.id);
  });
  // socket.on('connect',()=> {
  addPlayer(socket.id);
  // })
  socket.on("moveLeft", (e) => {
    console.log(e, socket.id);
  });
  socket.on("moveRight", (e) => {
    console.log(e, connectedPlayers);
  });
  socket.on("moveUp", (e) => {
    console.log(e);
  });
  socket.on("moveBlock", (e) => {
    console.log(e);
  });
  // socket.on('attack1', (e)=> {
  //     console.log(e)
  // })
  // socket.on('attack2', (e)=> {
  //     console.log(e)
  // })
  if (connectedPlayers.length > 1) {
    setInterval(() => {
      io.emit("paint game", currentGame.sendState());
    }, 1000);
  }
});

//frame rate logic

http.listen(3000, () => {
  console.log("listening on *:3000");
});
