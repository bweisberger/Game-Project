// console.log('window is loaded');
class Game {
  constructor(row=10, column=10, floor=3){
    this.row = row;
    this.column = column;
    this.floor = floor;
    this.makeBoard(row, column);
    this.makeGround();
  }
  makeBoard = function(rowNum, columnNum){
  for(let row = rowNum-1; row >= 0; row--) {
  const $rowDiv = $(`<div class=row row${row} ></div>`);
      for (let square = 0; square <= columnNum-1; square++) {
        const $squareDiv = $(`<div class=square x=${square} y=${row}></div>`)
        $rowDiv.append($squareDiv);
        }
      $('.game-grid').append($rowDiv);
    }
  }
  makeGround = function(){
    $('.square').each(function(){
      if ($(this).attr('y') < 3){
      $(this).addClass('ground');}
    })
  }
  isWall = function(x, y){
    return $(`.square[x="${x}"][y="${y}"]`).hasClass('ground');
  }
  isHazard = function(x,y){
    return $(`.square[x="${x}"][y="${y}"]`).hasClass('hazard');
  }
  isGoal = function(x,y){
    return $(`.square[x="${x}"][y="${y}"]`).hasClass('goal');
  }
  grabSquare = function(x, y){
    return $(`.square[x="${x}"][y="${y}"]`);
  }
}

const game = new Game(10, 20, 3);
game.grabSquare(4, 4).addClass('ground');
game.grabSquare(2, 4).addClass('ground');
game.grabSquare(3, 4).addClass('ground');

game.grabSquare(6, 6).addClass('ground');
game.grabSquare(7, 6).addClass('ground');
game.grabSquare(8, 6).addClass('ground');

game.grabSquare(6, 2).addClass('hazard');
game.grabSquare(7, 2).addClass('hazard');
game.grabSquare(8, 2).addClass('hazard');
game.grabSquare(9, 2).addClass('hazard');
game.grabSquare(10, 2).addClass('hazard');

game.grabSquare(19, 3).addClass('goal');
game.grabSquare(19, 4).addClass('goal');

//must be able to reference game so the size of the grid is adaptable
const player = {
  x: 0,
  y: 3,
  jumping: false,
  falling: false,
  dead: false,
  restart: function(){
    setTimeout(()=>{
      this.x = 0;
      this.y = 3;
      this.render();
      this.dead = false;
    },2000);
  },
  blink: function(){
    let count = 0;
    const blink = setInterval(()=>{
      $('.player').css({'opacity':'0'})
      setTimeout(()=>{
        $('.player').css({'opacity':'1'})
      },100);
      count++;
      if(count === 4){
        clearInterval(blink);
      }
    },200);
  },
  checkForHazard: function(){
    if (game.isHazard(this.x, this.y - 1)){
      this.dead = true;
      this.blink();
      this.restart();
    }
  },
  checkForGoal: function(){
    if (game.isGoal(this.x, this.y)){
      alert("You win");
      this.restart();
    }
  },
  shoot: function(){
    const $bullet = $('<span class=bullet></span>')
    $('.player').append($bullet);
    $bullet.css({'left': $('.player').position().left + 30, 'top': $('.player').position().top + 10});
  },
  move: function(direction){
    if(!this.dead)
    switch(direction){
      case 'left':
        if(this.x > 0 && !game.isWall(this.x-1, this.y)){
        this.x--;
        this.render();
        if(!this.jumping){
          // if(!this.falling){
            // this.falling = true;
            this.move('fall');
          // }
        }
      }
        break;
      case 'right':
        if(this.x < game.column-1 && !game.isWall(this.x+1, this.y)){
        this.x++;
        this.render();
        if(!this.jumping){
          // if(!this.falling){
          //   this.falling = true;
            this.move('fall');
          // }
        }
      }
        break;
      case 'jump':
      //check if player is on row low enough to jump (relative to ceiling) and if there is ground/wall above player
        if(this.y < game.row-2 && !game.isWall(this.x, this.y+1) && !game.isWall(this.x, this.y+2)){
          this.jumping = true;
          this.y += 2;
          this.render();
          setTimeout(()=>{
            this.jumping = false;
            this.falling = true;
            this.move('fall');
          },400);
        }
        break;
      case 'fall':
        // if(this.falling){
      //cannot move through a square with class ground
          if(!game.isWall(this.x,this.y-1)){
            // setTimeout(()=>{
              this.y--;
              this.render();
              this.move('fall');
            // }, 100);
          } else {
            // this.falling = false;
            this.render();
          }
          break;
      default:
        console.log("player.move dysfunctional");
      }
  },
  render: function(){
    $('.player').removeClass('player');
    $(`.square[x="${this.x}"][y="${this.y}"]`).addClass('player');
    setTimeout(()=>{
      this.checkForGoal();
      this.checkForHazard();
    },500)
  }
}
player.render();
$('body').on('keydown', function(e){
  console.log(e.which);
  switch(e.which){
    case 37:
    player.move('left');
    break;
    case 32:
    if (!player.jumping){
    player.move('jump');}
    break;
    case 39:
    player.move('right');
    break;
    case 40:
    player.move('fall');
    break;
    case 16:
    player.shoot();
    default:
      console.log("Move using the arrow keys");
  }
});
