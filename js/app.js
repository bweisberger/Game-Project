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
  grabSquare = function(x, y){
    return $(`.square[x="${x}"][y="${y}"]`);
  }
}

const game = new Game(10, 20, 3);
game.grabSquare(1, 4).addClass('ground');
game.grabSquare(2, 4).addClass('ground');
game.grabSquare(3, 4).addClass('ground');

game.grabSquare(6, 6).addClass('ground');
game.grabSquare(7, 6).addClass('ground');
game.grabSquare(8, 6).addClass('ground');

//must be able to reference game so the size of the grid is adaptable
const player = {
  x: 0,
  y: 3,
  gravity: 0.5,
  gravitySpeed: 0,
  jumping: false,
  falling: true,
  move: function(direction){
    switch(direction){
      case 'left':
        if(this.x > 0 && !game.isWall(this.x-1, this.y)){
        this.x--;
        if(!this.jumping){
          this.move('down');
        }
      }
        break;
      case 'right':
        if(this.x < game.column-1 && !game.isWall(this.x+1, this.y)){
        this.x++;
        if(!this.jumping){
          this.move('down');
        }
      }
        break;
      case 'jump':
      //check if player is on row low enough to jump (relative to ceiling) and if there is ground/wall above player
        if(this.y < game.row-2 && !game.isWall(this.x, this.y+1) && !game.isWall(this.x, this.y+2)){
          this.jumping = true;
          this.y += 2;
          setTimeout(()=>{
            this.jumping = false;
            this.move('down');
          },500);
        }
        break;
      case 'down':
      //cannot move through a square with class ground
        if(!game.isWall(this.x,this.y-1)){
          this.y--;
          this.render();
          this.move('down');
        }
        break;
      default:
        console.log("player.move dysfunctional");
    }
    this.render();
  },
  render: function(){
    $('.player').removeClass('player');
    $(`.square[x="${this.x}"][y="${this.y}"]`).addClass('player');
  }
}

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
    player.move('down');
    break;
    default:
      console.log("Move using the arrow keys");
  }
});
