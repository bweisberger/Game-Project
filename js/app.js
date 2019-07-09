// console.log('window is loaded');
class Game {
  constructor(num=10){
    this.num = num;
    this.makeGrid(num);
  }
  makeGrid = function(num){
  for(let row = num-1; row >= 0; row--) {
  const $rowDiv = $(`<div class=row row${row} ></div>`);
      for (let square = 0; square <= num-1; square++) {
        const $squareDiv = $(`<div class=square x=${square} y=${row}></div>`)
        $rowDiv.append($squareDiv);
        }
      $('.game-grid').append($rowDiv);
    }
  }
}

const game = new Game(20);

//must be able to reference game so the size of the grid is adaptable
const player = {
  x: 10,
  y: 10,
  move: function(direction){
    switch(direction){
      case 'left':
        if(this.x > 0){
        this.x--;}
        break;
      case 'right':
        if(this.x < game.num-1){
        this.x++;}
        break;
      case 'up':
        if(this.y < game.num-1){
        this.y++;}
        break;
      case 'down':
        if(this.y > 0){
        this.y--;}
        break;
      default:
        console.log("Move using the arrow keys");
    }
    this.render();
  },
  render: function(){
    $('.player').removeClass('player');
    $(`.square[x="${this.x}"][y="${this.y}"]`).addClass('player');
  }
}
