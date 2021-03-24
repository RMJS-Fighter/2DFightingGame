import React, {useRef,useEffect,useState} from 'react';
import floor from '../png-objects/long-platform.png';
import platform2 from '../png-objects/short-platform.png';
import dog from '../images/dog-l.png';
import dogReverse from '../images/dog-r.png';
import cat from '../images/kitty-l.png';
import catReverse from '../images/kitty-r.png';
import bloodBoltR from '../images/blood-blast-r.png';
import bloodBoltL from '../images/blood-blast-l.png';
import blood from '../images/dropsplash.png';
import shield from '../images/explosion.png';
import attack from '../images/attack-1.png';
import tree from '../png-objects/tree.png';
import box from '../png-objects/box.png';
import birds from '../png-objects/birds.png';
import shrooms from '../png-objects/mushrooms.png';
import flowers from '../png-objects/flower.png';
import attackDrop from '../images/attack-2.png';


let friction = 0.8;
let gravity = 0.3;
let keys = [];


let floorImg = new Image();
floorImg.src = floor;

let platform2Img = new Image();
platform2Img.src = platform2;

let dogImg = new Image();
dogImg.src = dog;

let dogReverseImg = new Image();
dogReverseImg.src = dogReverse;

let catImg = new Image();
catImg.src = cat;

let catReverseImg = new Image();
catReverseImg.src = catReverse;

let bloodBoltRImg = new Image();
bloodBoltRImg.src = bloodBoltR;

let bloodBoltLImg = new Image();
bloodBoltLImg.src = bloodBoltL;

let bloodImg = new Image();
bloodImg.src = blood;

let shieldImg = new Image();
shieldImg.src = shield;

let attackImg = new Image();
attackImg.src = attack;

let treeImg = new Image();
treeImg.src = tree;

let boxImg = new Image();
boxImg.src = box;

let birdsImg = new Image();
birdsImg.src = birds;

let shroomsImg = new Image();
shroomsImg.src = shrooms;

let flowersImg = new Image();
flowersImg.src = flowers;

let attackDropImg = new Image();
attackDropImg.src = attackDrop;



function GameWindow(props) {
    const canvasRef=useRef();

const gameStart=()=>{

 
    class SpecialEffects {
        constructor(player, w, h, img, numberWide, numberTall) {
          this.x = player.x;
          this.y = -1000;
          this.w = w;
          this.h = h;
          this.img = img;
          this.sx = 0;
          this.sy = 0;
        //   const reSize = () => {
        //     this.sw = img.width / numberWide;
        //     this.sh = img.height / numberTall;
        //   };
        this.sw = img.width / numberWide;
            this.sh = img.height / numberTall;
          this.numberWide = numberWide;
          this.numberTall = numberTall;
        //   reSize();
        //   img.onload = reSize;
        }
      
        draw(ctx) {
          //animate blood
          if (this.img === bloodImg) {
            if (frame % 8 === 0) {
              this.sx += this.sw;
            }
            if (this.sx > this.sw * 2 && this.sy === 0) {
              this.sx = 0;
              this.sy = this.sh;
            } else if (this.sx > this.sw * 2 && this.sy === this.sh) {
              this.y = -1000;
            }
          } else if (this.img === shieldImg) {
            if (frame % 4 === 0) {
              this.sx += this.sw;
            }
            if (this.sx > this.sw * 6) {
              this.sx = this.sw * 4;
            }
          } else if ((this.img = attackImg)) {
            if (frame % 4 === 0) {
              this.sx += this.sw;
            }
            if (this.sx > this.sw) {
              this.sx = 0;
            }
          }
      
          //actually drawing
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
        }
        update(ctx) {
          this.draw(ctx);
        }
      }
      class Player {
        constructor(x, y, w, h, img, rImg, direction) {
          this.x = x;
          this.y = y;
          this.w = w;
          this.h = h;
          this.velX = 0;
          this.velY = 0;
          this.speed = 5;
          this.jumping = false;
          this.grounded = false;
          this.img = img;
          this.rImg = rImg;
          this.sx = 0; //frame of animation
        //   const reSize = () => {
            this.sy = img.height / 5; //animation type
            this.sw = img.width / 10;
            this.sh = img.height / 5;
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
      
      class SpecialAttack {
        constructor(x, y, w, h, img, img2) {
          this.x = x;
          this.y = y;
          this.w = w;
          this.h = h;
          this.img = img;
          this.img2 = img2;
          this.sx = 0;
          this.sy = 0;
        //   const reSize = () => {
            this.sw = 786 / 5;
            this.sh = 151;
        //   };
        //   reSize();
        //   img.onload = reSize;
        //   img2.onload= reSize;
          this.direction = null;
        }
        update(ctx) {
          this.drawAttack(ctx);
        }
        drawAttack(ctx) {
          if (frame % 5 === 0) {
            this.sx += this.sw;
          }
          if (this.sx > this.sw * 4) {
            this.sx = 0;
          }
          if (this.direction === "right") {
            this.x += 8;
          } else {
            this.x -= 8;
          }
          if (this.direction === "right") {
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
              this.img2,
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
        reset(player) {
          this.direction = player.direction;
          if (this.direction === "right") {
            this.x = player.x + player.w;
          } else {
            this.x = player.x - player.w;
          }
          this.y = player.y;
        }
      }
      
      class Beautify {
        constructor(x, y, w, h, img) {
          this.x = x;
          this.y = y;
          this.w = w;
          this.h = h;
          this.img = img;
        }
        draw(ctx) {
            //console.log(ctx);
          ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
        }
        update(ctx) {
          this.draw(ctx);
        }
        reset(player) {
          this.direction = player.direction;
          if (this.direction === "right") {
            this.x = player.x + player.w * 0.5;
          } else {
            this.x = player.x - player.w * 0.5;
          }
          this.y = player.y;
        }
      }
      
      class Barrier {
        constructor(x, y, w, h, img) {
          this.x = x;
          this.y = y;
          this.w = w;
          this.h = h;
          this.img = img;
        }
      
        draw(ctx) {
          ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
        }
        update(ctx) {
          this.draw(ctx);
        }
      }

    class CanvasDisplay {
        constructor() {
          this.canvas = canvasRef.current;
          this.ctx = canvasRef.current.getContext("2d");
          this.stageConfig = {
            width: 1000,
            height: 500,
          };
      
          //create game objects to manipulate
          this.canvas.width = this.stageConfig.width;
          this.canvas.height = this.stageConfig.height;
      
          this.createFloor = new Barrier(
            -100,
            this.stageConfig.height * 0.9,
            this.stageConfig.width * 1.2,
            50,
            floorImg
          );
          this.createLeftWall = new Barrier(
            -800,
            0,
            800,
            this.stageConfig.height,
            floorImg
          );
          this.createRightWall = new Barrier(
            1000,
            0,
            800,
            this.stageConfig.height,
            floorImg
          );
          this.createPlatform = new Barrier(
            this.stageConfig.width * 0.4,
            this.stageConfig.height * 0.6,
            200,
            50,
            platform2Img
          );
          this.createPlayer1 = new Player(30, 50, 100, 100, dogImg, dogReverseImg, "right");
          this.createPlayer2 = new Player(855, 50, 100, 100, catImg, catReverseImg, "left");
          this.createSpecialP1 = new SpecialAttack(
            2000,
            2000,
            100,
            100,
            bloodBoltRImg,
            bloodBoltLImg
          );
          this.createSpecialP2 = new SpecialAttack(
            2500,
            2000,
            100,
            100,
            bloodBoltRImg,
            bloodBoltLImg
          );
          this.createBloodP1 = new SpecialEffects(
            this.createPlayer1,
            100,
            100,
            bloodImg,
            3,
            2
          );
          this.createBloodP2 = new SpecialEffects(
            this.createPlayer2,
            100,
            100,
            bloodImg,
            3,
            2
          );
          this.createShieldP1 = new SpecialEffects(
            this.createPlayer1,
            250,
            350,
            shieldImg,
            17,
            1
          );
          this.createShieldP2 = new SpecialEffects(
            this.createPlayer2,
            250,
            350,
            shieldImg,
            17,
            1
          );
          this.createAttackP1 = new SpecialEffects(
            this.createPlayer1,
            50,
            50,
            attackImg,
            2,
            1
          );
          this.createAttackP2 = new SpecialEffects(
            this.createPlayer2,
            50,
            50,
            attackImg,
            2,
            1
          );
          this.createTree = new Beautify(-2, 255, 200, 200, treeImg);
          this.createTree2 = new Beautify(800, 255, 200, 200, treeImg);
          this.createBox = new Beautify(400, 250, 50, 50, boxImg);
          this.createBirds = new Beautify(900, 55, 100, 100, birdsImg);
          this.createShrooms = new Beautify(400, 410, 50, 50, shroomsImg);
          this.createFlowers = new Beautify(920, 405, 50, 50, flowersImg);
          this.createFlowers2 = new Beautify(200, 405, 50, 50, flowersImg);
          this.createAttackDropP1 = new Beautify(
            this.createAttackP1.x,
            this.createAttackP1.y,
            100,
            100,
            attackDropImg
          );
          this.createAttackDropP2 = new Beautify(
            this.createAttackP2.x,
            this.createAttackP2.y,
            100,
            100,
            attackDropImg
          );
        }
        animate() {
            //Update canvas
            this.ctx.clearRect(0, 0, this.stageConfig.width, this.stageConfig.height);
            //Beautify stuffff
            this.createTree.update(this.ctx);
            this.createTree2.update(this.ctx);
            this.createBox.update(this.ctx);
            this.createBirds.update(this.ctx);
            this.createShrooms.update(this.ctx);
            this.createFlowers.update(this.ctx);
            this.createFlowers2.update(this.ctx);
            //End stuffff
            this.createFloor.update(this.ctx);
            this.createLeftWall.update(this.ctx);
            this.createRightWall.update(this.ctx);
            this.createPlatform.update(this.ctx);
            this.createPlayer1.update(this.ctx);
            this.createPlayer2.update(this.ctx);
            this.createSpecialP1.update(this.ctx);
            this.createSpecialP2.update(this.ctx);
            this.createBloodP1.update(this.ctx);
            this.createBloodP2.update(this.ctx);
            this.createShieldP1.update(this.ctx);
            this.createShieldP2.update(this.ctx);
            this.createAttackP1.update(this.ctx);
            this.createAttackP2.update(this.ctx);
            this.createAttackDropP1.update(this.ctx);
            this.createAttackDropP2.update(this.ctx);
          }
        }

        let canvasDisplay=new CanvasDisplay();

        let ctx = canvasDisplay.ctx;
        let player1 = canvasDisplay.createPlayer1;
        let player2 = canvasDisplay.createPlayer2;
        let specialP1 = canvasDisplay.createSpecialP1;
        let specialP2 = canvasDisplay.createSpecialP2;
        let bloodP1 = canvasDisplay.createBloodP1;
        let bloodP2 = canvasDisplay.createBloodP2;
        let shieldP1 = canvasDisplay.createShieldP1;
        let shieldP2 = canvasDisplay.createShieldP2;
        let attackP1 = canvasDisplay.createAttackP1;
        let attackP2 = canvasDisplay.createAttackP2;
        let attackDropP1 = canvasDisplay.createAttackDropP1;
        let attackDropP2 = canvasDisplay.createAttackDropP2;
        
        let platform = canvasDisplay.createPlatform;
        let stage = canvasDisplay.createFloor;
        let leftWall = canvasDisplay.createLeftWall;
        let rightWall = canvasDisplay.createRightWall;
        
        let gameObjects = [
          canvasDisplay.createPlatform,
          canvasDisplay.createFloor,
          canvasDisplay.createLeftWall,
          canvasDisplay.createRightWall,
          canvasDisplay.createSpecialP1,
          canvasDisplay.createSpecialP2,
          canvasDisplay.createAttackP1,
          canvasDisplay.createAttackP2,
        ];
    
        
        function colCheck(shapeA, shapeB) {
            // get the vectors to check against
            var vX = shapeA.x + shapeA.w / 2 - (shapeB.x + shapeB.w / 2),
              vY = shapeA.y + shapeA.h / 2 - (shapeB.y + shapeB.h / 2),
              // add the half widths and half heights of the objects
              hWidths = shapeA.w / 2 + shapeB.w / 2,
              hHeights = shapeA.h / 2 + shapeB.h / 2,
              colDir = null;
          
            // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
            if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
              // figures out on which side we are colliding (top, bottom, left, or right)
              var oX = hWidths - Math.abs(vX),
                oY = hHeights - Math.abs(vY);
              if (shapeB === attackP1 || shapeB === attackP2) {
                colDir = "a";
              } else {
                if (oX >= oY) {
                  if (vY > 0) {
                    colDir = "t";
                    shapeA.y += oY;
                  } else {
                    colDir = "b";
                    shapeA.y -= oY;
                  }
                } else {
                  if (vX > 0) {
                    colDir = "l";
                    shapeA.x += oX;
                  } else {
                    colDir = "r";
                    shapeA.x -= oX;
                  }
                }
              }
              return colDir;
            }
          }
          let timeToDissapear = 100;
          let timeToDissapear1 = 100;
          let interval = null;
          let frame = 0;
          let playerDied = 0;
          
          /////////////////////////////////////
          //////////// Play Game //////////////
          /////////////////////////////////////
          function playGame() {
          
            /////////
          /////Fix On load issues for player 1 
          
            shieldP1.sh = shieldP1.img.height/shieldP1.numberTall
            bloodP1.sh=bloodP1.img.height/bloodP1.numberTall
            bloodP1.sw=bloodP1.img.width/bloodP1.numberWide
            shieldP1.sw = shieldP1.img.width/shieldP1.numberWide
            /*--- key press codes, if true which is set on keydown, will check to see if player1 is within canvas, 
                  then execute move functions in class--- */
            if (playerDied === 1) {
            //   setTimeout(killSound.play(), 1000);
            //   gameOverSound.play();
              playerDied++;
            }
            if (keys[74] && player2.special >= 100) {
              //special attack
            //   bloodBlastSound.play();
              specialP1.reset(player1);
              player2.special = 0;
            }
            if (keys[76] && player2.special > 25) {
              //attack
            //   attackSound.play();
              player2.special -= 25;
              if (player1.direction === "right") {
                attackP1.y = player1.y + player1.h / 4;
                attackP1.x = player1.x + player1.w * 0.8;
              } else {
                attackP1.y = player1.y + player1.h / 4;
                attackP1.x = player1.x - player1.w * 0.4;
              }
              timeToDissapear1 = 100;
              attackDropP1.reset(player1);
            } else {
              timeToDissapear1 -= 4;
              if (timeToDissapear1 === 0) {
                attackDropP1.y = -1000;
                timeToDissapear1 = 100;
              }
              attackP1.y = -1000;
            }
            if (keys[37]) {
            //   leftkey.style.animation = "buttonGlow 5s alternate-reverse";
              if (player1.x - 30 > 0) {
                player1.moveLeft();
              }
            }
            if (keys[39]) {
            //   rightkey.style.animation = "buttonGlow 5s alternate-reverse";
              if (player1.x < 1365) {
                player1.moveRight();
              }
            }
            if (keys[38]) {
            //   upkey.style.animation = "buttonGlow 5s alternate-reverse";
              if (player1.y - player1.h > 0) {
                if (!player1.jumping && player1.grounded) {
                  player1.grounded = false;
                  player1.jump();
                }
              }
            }
            if (keys[40] && player2.special > 10) {
            //   downkey.style.animation = "buttonGlow 5s alternate-reverse";
              shieldP1.x = player1.x;
              shieldP1.y = player1.y;
              player1.drawBlockP1();
              player1.blocking = true;
              player2.special -= 2;
            } else {
              shieldP1.y = -1000;
              player1.blocking = false;
            }
          
            //PLAYER2
            if (keys[50] && player1.special >= 100) {
            //   bloodyBlastSound.play();
              specialP2.reset(player2);
              player1.special = 0;
              //console.log("i pressed it!");
            }
            if (keys[51] && player1.special > 25) {
            //   attackSound.play();
              player1.special -= 25;
              //attack
              if (player2.direction === "right") {
                attackP2.y = player2.y + player2.h / 4;
                attackP2.x = player2.x + player2.w * 0.8;
              } else {
                attackP2.y = player2.y + player2.h / 4;
                attackP2.x = player2.x - player2.w * 0.4;
              }
              timeToDissapear = 100;
              attackDropP2.reset(player2);
            } else {
              timeToDissapear -= 4;
              if (timeToDissapear === 0) {
                attackDropP2.y = -1000;
                timeToDissapear = 100;
              }
              attackP2.y = -1000;
            }
          
            player1.velY += gravity;
            player1.velX *= friction;
            player1.grounded = false;
          
            if (keys[65]) {
            //   aakey.style.animation = "buttonGlow 5s alternate-reverse";
              player2.moveLeft();
            }
            if (keys[68]) {
            //   ddkey.style.animation = "buttonGlow 5s alternate-reverse";
              player2.moveRight();
            }
            if (keys[87]) {
            //   wwkey.style.animation = "buttonGlow 5s alternate-reverse";
              if (!player2.jumping && player2.grounded) {
                player2.grounded = false;
                player2.jump();
              }
            }
            if (keys[83] && player1.special > 10) {
            //   sskey.style.animation = "buttonGlow 5s alternate-reverse";
              player2.drawBlockP2();
              player2.blocking = true;
              player1.special -= 2;
            } else {
              shieldP2.y = -1000;
              player2.blocking = false;
            }
            if (keys[77]) {
            //   if (backgroundMusic.muted === false) backgroundMusic.muted = true;
            //   else {
            //     backgroundMusic.muted = false;
            //   }
            }
          
            player2.velY += gravity;
            player2.velX *= friction;
            player2.grounded = false;
          
            for (var i = 0; i < gameObjects.length; i++) {
              var dir = colCheck(player1, gameObjects[i]);
              if (i < 4) {
                if (dir == "l" || dir === "r") {
                  player1.velX = 0;
                  player1.jumping = false;
                } else if (dir === "b") {
                  player1.grounded = true;
                  player1.jumping = false;
                } else if (dir === "t") {
                  player1.velY *= -1;
                }
              } else if (i === 5) {
                if (dir != null) {
                  player1.receiveDamageP1(3);
                  specialP2.y = -500;
                }
              } else if (i === 7) {
                if (dir != null) {
                  player1.receiveDamageP1(1);
                }
              }
            }
          
            if (player1.grounded) {
              player1.velY = 0;
              player1.idle();
            }
          
            player1.x += player1.velX;
            player1.y += player1.velY;
          
            for (var i = 0; i < gameObjects.length; i++) {
              var dir = colCheck(player2, gameObjects[i]);
              if (i < 4) {
                if (dir ==="l" || dir === "r") {
                  player2.velX = 0;
                  player2.jumping = false;
                } else if (dir === "b") {
                  player2.grounded = true;
                  player2.jumping = false;
                } else if (dir === "t") {
                  player2.velY *= -1;
                }
              } else if (i === 4) {
                if (dir != null) {
                  player2.receiveDamageP2(3);
                  specialP1.y = -500;
                }
              } else if (i === 6) {
                if (dir != null) {
                  player2.receiveDamageP2(1);
                }
              }
            }
          
            if (player2.grounded) {
              player2.velY = 0;
              player2.idle();
            }
          
            player2.x += player2.velX;
            player2.y += player2.velY;
          
            if (player1.health <= 0) {
              player1.dead();
            }
            if (player2.health <= 0) {
              player2.dead();
            }
            if ((player1.velX > 0.3 || player1.velX < -0.3) && player1.grounded) {
              player1.run();
            }
            if ((player2.velX > 0.3 || player2.velX < -0.3) && player2.grounded) {
              player2.run();
            }
            // if (player1.grounded === false) {
            //   player1.fall()
            // }
            // if (player2.grounded === false) {
            //   player2.fall()
            // }
          
            // player1.x
            // player2.x
          
            frame++;
            // gameOver();
            interval = requestAnimationFrame(playGame);
            canvasDisplay.animate();
          }
          
          /////////////////////////////////////
          /// Key selectors for css anims /////
          /////////////////////////////////////
          let leftkey = document.querySelector("#leftkey");
          let rightkey = document.querySelector("#rightkey");
          let upkey = document.querySelector("#upkey");
          let downkey = document.querySelector("#downkey");
          let aakey = document.querySelector("#aakey");
          let ddkey = document.querySelector("#ddkey");
          let wwkey = document.querySelector("#wwkey");
          let sskey = document.querySelector("#sskey");
          
          /////////////////////////////////////
          /////// Key listeners  //////////////
          /////////////////////////////////////
          window.onkeydown = function (e) {
            keys[e.keyCode] = true;
          };
          window.onkeyup = function (e) {
            keys[e.keyCode] = false;
            // document.querySelector("#leftkey").style.removeProperty("animation");
            // document.querySelector("#rightkey").style.removeProperty("animation");
            // document.querySelector("#upkey").style.removeProperty("animation");
            // document.querySelector("#downkey").style.removeProperty("animation");
            // document.querySelector("#aakey").style.removeProperty("animation");
            // document.querySelector("#ddkey").style.removeProperty("animation");
            // document.querySelector("#wwkey").style.removeProperty("animation");
            // document.querySelector("#sskey").style.removeProperty("animation");
          };
        playGame();
        }         


    return (
        <div>
            <canvas ref={canvasRef} ></canvas>
            <button onClick={gameStart}>Start Game</button>
        </div>
    );
}

export default GameWindow;