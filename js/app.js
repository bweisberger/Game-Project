// console.log('window is loaded');
class Game {
  constructor(row=10, column=10, floor=3){
    this.row = row;
    this.column = column;
    this.floor = floor;
    this.makeBoard(row, column);
    this.makeGround();
  }
  checkHits = function() {
    player.checkHit();
    enemy.checkHit();
  }
  getVwPixels = function(){
    const pixels = document.documentElement.clientWidth/100
    return pixels
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

game.grabSquare(8, 7).addClass('enemy');

//must be able to reference game so the size of the grid is adaptable
const player = {
  x: 0,
  y: 3,
  jumping: false,
  falling: false,
  dead: false,
  render: function(){
    $('.player').removeClass('player');
    $(`.square[x="${this.x}"][y="${this.y}"]`).addClass('player');
    setTimeout(()=>{
      this.checkForGoal();
      this.checkHurt();
    },500)
  },
  restart: function(){
    setTimeout(()=>{
      this.x = 0;
      this.y = 3;
      this.render();
      this.dead = false;
    },500);
  },
  checkHit: function(){
  const $enemyBullet = $('.enemy-bullet');
  const $playerPosition = $('.player').position();
  //check left position of bullet relative to enemy, using vw to pixel conversion
  if ($enemyBullet.position().left > $playerPosition.left && $enemyBullet.position().left < $playerPosition.left + 2.9*game.getVwPixels()){
    //check top position of bullet relative to enemy, using vw to pixel conversion
    if ($enemyBullet.position().top > $playerPosition.top && $enemyBullet.position().top < $playerPosition.top + 2.9*game.getVwPixels()){
      $enemyBullet.removeClass('enemy-bullet');
      console.log("Hit!")
      this.dead = true;
      this.blink();
      this.restart();
      }
    }
  },
  blink: function(){
    let count = 0;
    const blink = setInterval(()=>{
      $('.player').css({'opacity':'0'})
      setTimeout(()=>{
        $('.player').css({'opacity':'1'})
      },50);
      count++;
      if(count === 4){
        clearInterval(blink);
      }
    },100);
  },
  checkHurt: function(){
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
  shoot: function(num){
    if(!this.dead){
      const $playerBullet = $('<span class=player-bullet></span>')
      $('.player').append($playerBullet);
      $playerBullet.css({'left': $('.player').position().left + 30, 'top': $('.player').position().top + 10});
      $enemyPosition = $('.enemy').position()

      //bullet continues to move as long as left position is not equal to
      //0 or 800, current size of game board with console open
      const bulletInterval = setInterval(()=>{
        $playerBullet.css('left',$playerBullet.position().left + 10);
        if($playerBullet.position().left <= 0 || $playerBullet.position().left >= 800) {
          clearInterval(bulletInterval);
          $playerBullet.remove();
        }
        //check left position of bullet relative to enemy, using vw to pixel conversion
        else if ($playerBullet.position().left > $enemyPosition.left && $playerBullet.position().left < $enemyPosition.left + 2.9*game.getVwPixels()){
          //check top position of bullet relative to enemy, using vw to pixel conversion
          if ($playerBullet.position().top > $enemyPosition.top && $playerBullet.position().top < $enemyPosition.top + 2.9*game.getVwPixels()){
            $playerBullet.remove();
            console.log("Hit!")
            enemy.dead = true;
            enemy.blink();
            enemy.clear();
          }
        }
      },50);
    }
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
  }
}

const enemy = {
  lives: 1,
  dead: false,
  check: true,
  //grab enemy, left and top positions - only works with non-moving enemies
  $enemy: $('.enemy'),
  $left: $('.enemy').position().left,
  $top: $('.enemy').position().top,
  // $enemyBullet: $('<span class=enemy-bullet></span>'),
  bulletFly: function(){
        //grab enemyBullet, stick it to enemy and adjust position
      const $enemyBullet = $(`<span class='enemy-bullet'></span>`);
      this.$enemy.append($enemyBullet);
      $enemyBullet.css({'left': this.$left - 5, 'top': this.$top + 10});

      // enemyBullet continues to move as long as left position is not equal to
      // 0 or 800, current size of game board with console open
      const bulletInterval = setInterval(()=>{
        $enemyBullet.css('left',$enemyBullet.position().left - 10);
        const $playerPosition = $('.player').position();
        //check left position of bullet relative to enemy, using vw to pixel conversion
        if($enemyBullet.position().left <= 0 || $enemyBullet.position().left >= 800) {
        clearInterval(bulletInterval);
        $enemyBullet.remove();
        }
        else if ($enemyBullet.position().left > $playerPosition.left && $enemyBullet.position().left < $playerPosition.left + 2.9*game.getVwPixels()){
          //check top position of bullet relative to enemy, using vw to pixel conversion
          if ($enemyBullet.position().top > $playerPosition.top && $enemyBullet.position().top < $playerPosition.top + 2.9*game.getVwPixels()){
            $enemyBullet.remove()
            console.log("Hit!")
            player.dead = true;
            player.blink();
            player.restart();
            }
          }
      },50);
  },
  //takes a parameter num that determines how many bullets are shot in a burst
  shootBurst: function(num){
    let  shotCount = 0;
    const shootInterval = setInterval(()=>{
      this.bulletFly(shotCount);
      shotCount++;
      if (shotCount === num){
        clearInterval(shootInterval);
      }
    },150)
  },
  checkHit: function(){
  const $playerBullet = $('#player-bullet');
  //check left position of bullet relative to enemy, using vw to pixel conversion
  if ($playerBullet.position().left > this.$left && $playerBullet.position().left < this.$left + 2.9*game.getVwPixels()){
    //check top position of bullet relative to enemy, using vw to pixel conversion
    if ($playerBullet.position().top > this.$top && $playerBullet.position().top < this.$top + 2.9*game.getVwPixels()){
      $playerBullet.remove();
      console.log("Hit!")
      this.dead = true;
      this.blink();
      this.clear();
      }
    }
  },
  clear: function(){
    this.$enemy.removeClass('enemy');
  },
  //takes two parameters: sec that determines how many seconds between shooting bursts
  //and num that determines how many bullets per burst;
  continuousAttack: function(num, sec){
    const attack = setInterval(()=>{
      this.shootBurst(num)
      if(this.dead){
        clearInterval(attack)
      }
    },sec*1000)
  },
  blink: function(){
    let count = 0;
    const blink = setInterval(()=>{
      this.$enemy.css({'opacity':'0'})
      setTimeout(()=>{
        this.$enemy.css({'opacity':'1'})
      },100);
      count++;
      if(count === 4){
        clearInterval(blink);
      }
    },200);
  }
}
enemy.continuousAttack(3, 2);
// gameInterval = setInterval(()=>{
//   game.checkHits();
//   if (enemy.dead){
//     clearInterval(gameInterval);
//   }
// },50)
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
