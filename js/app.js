// console.log('window is loaded');
class Player {
  constructor(name){
  this.name = 'Player ' + name;
  this.color = '';
  this.x = 0;
  this.y = 3;
  this.score = 0;
  this.lives = 3;
  this.jumping = false;
  this.falling = false;
  this.dead = false;
  this.assignColor();
  }
  // enterName = function(){
  //   const $gameGrid = $('.game-grid');
  //   $gameGrid.empty();
  // }
  assignColor = function(){
    switch(this.name){
      case 'Player 1':
      this.color = 'blue'
      break;
      case 'Player 2':
      this.color = 'magenta'
      break;
      case 'Player 3':
      this.color = 'lawngreen'
      break;
      case 'Player 4':
      this.color = 'chartreuse'
      break;
      default:
      this.color = 'blue'
      break;
    }
    $('.player').css({'background-color':`${this.color}`});
  }
  render = function(){
    $('.player').removeClass('player');
    $(`.square[x="${this.x}"][y="${this.y}"]`).addClass('player');
    setTimeout(()=>{
      this.checkForGoal();
      this.checkHurt();
    },500)
  }
  blink = function(){
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
  }
  checkHurt = function(){
    if (game.isHazard(this.x, this.y - 1) && !this.dead){
      this.dead = true;
      this.blink();
      this.lives--;
      game.showLives();
      this.resetPlayer();
    }
  }
  checkForGoal = function(){
    if (game.isGoal(this.x, this.y)){
      this.resetPlayer();
      if (!this.dead){
          this.dead = true;
          this.score += 1000;
          game.showScore();
      }
      // if (enemy){
      //   this.score += 1000;
      //   this.showScore();
      // }
    }
  }
  shoot = function(){
    const $gameGrid = $('.game-grid');
    console.log($gameGrid.position().left);
    if(!this.dead){
      const $playerBullet = $('<span class=player-bullet></span>')
      $('.player').append($playerBullet);
      $playerBullet.css({'left': $('.player').position().left + 30, 'top': $('.player').position().top + 10});
      const $enemyPosition = $('.enemy').position()

      //bullet continues to move as long as left position is not equal to
      //0 or 800, current size of game board with console open
      const bulletInterval = setInterval(()=>{
        $playerBullet.css('left',$playerBullet.position().left + 10);
        if($playerBullet.position().left <= $gameGrid.position().left || $playerBullet.position().left >= $gameGrid.position().left + $gameGrid.width()) {
          clearInterval(bulletInterval);
          $playerBullet.remove();
        }
        //check left position of bullet relative to enemy, using vw to pixel conversion
        else if ($playerBullet.position().left > $enemyPosition.left && $playerBullet.position().left < $enemyPosition.left + 2.9*game.getVwPixels()){
          //check top position of bullet relative to enemy, using vw to pixel conversion
          if ($playerBullet.position().top > $enemyPosition.top && $playerBullet.position().top < $enemyPosition.top + 2.9*game.getVwPixels()){
            if (!game.enemy.dead){
              $playerBullet.remove();
              console.log("Hit!")
              this.score += 500
              game.showScore();
              game.enemy.dead = true;
              game.enemy.blink();
              game.enemy.clear();
            }
          }
        }
      },50);
    }
  }
  move = function(direction){
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
  resetPlayer = function(){
    this.x = 0;
    this.y = 3;
    this.dead = false;
    this.render();
  }
}
class Enemy {
  constructor(bullets, seconds){
  this.lives = 1;
  this.dead = false;
  this.check = true;
  //grab enemy, left and top positions - only works with non-moving enemies
  this.continuousAttack(bullets, seconds);
  }
  // $enemyBullet: $('<span class=enemy-bullet></span>'),
  shoot = function(){
      const $enemy = $('.enemy');
      if ($enemy.length){
      const $left = $('.enemy').position().left;
      const $top = $('.enemy').position().top;
        //grab enemyBullet, stick it to enemy and adjust position
      const $enemyBullet = $(`<span class='enemy-bullet'></span>`);
      const $gameGrid = $('.game-grid')
      $enemy.append($enemyBullet);
      $enemyBullet.css({'left': $left - 5, 'top': $top + 10});

      // enemyBullet continues to move as long as left position is not equal to
      // 0 or 800, current size of game board with console open
      const bulletInterval = setInterval(()=>{
        $enemyBullet.css('left',$enemyBullet.position().left - 10);
        const $playerPosition = $('.player').position();
        //check left position of bullet relative to enemy, using vw to pixel conversion
        if($enemyBullet.position().left <= $gameGrid.position().left || $enemyBullet.position().left >= $gameGrid.position().left + $gameGrid.width()) {
          clearInterval(bulletInterval);
          $enemyBullet.remove();
        }
        else if ($enemyBullet.position().left > $playerPosition.left && $enemyBullet.position().left < $playerPosition.left + 2.9*game.getVwPixels()){
          //check top position of bullet relative to enemy, using vw to pixel conversion
          if ($enemyBullet.position().top > $playerPosition.top && $enemyBullet.position().top < $playerPosition.top + 2.9*game.getVwPixels()){
            if (!game.currentPlayer.dead){
            game.currentPlayer.lives--
            game.currentPlayer.showLives();
            $enemyBullet.remove()
            console.log("Hit!")
            game.currentPlayer.dead = true;
            game.currentPlayer.blink();
            game.currentPlayer.resetPlayer();
            }
          }
        }
      },50);
    }
  }
  //takes a parameter num that determines how many bullets are shot in a burst
  shootBurst = function(num){
    let  shotCount = 0;
    const shootInterval = setInterval(()=>{
      this.shoot(shotCount);
      shotCount++;
      if (shotCount === num){
        clearInterval(shootInterval);
      }
    },150)
  }
  clear = function(){
    $('.enemy').removeClass('enemy');
  }
  //takes two parameters: sec that determines how many seconds between shooting bursts
  //and num that determines how many bullets per burst;
  continuousAttack = function(num, sec){
    const attack = setInterval(()=>{
      if(!this.dead){
        this.shootBurst(num)
      }
      else {
        clearInterval(attack)
      }
    },sec*1000)
  }
  blink = function(){
    const $enemy = $('.enemy')
    let count = 0;
    const blink = setInterval(()=>{
      $enemy.css({'opacity':'0'})
      setTimeout(()=>{
        $enemy.css({'opacity':'1'})
      },100);
      count++;
      if(count === 4){
        clearInterval(blink);
      }
    },200);
  }
}

class Game {
  constructor(row=10, column=10, floor=3){
    this.row = row;
    this.column = column;
    this.floor = floor;
    this.$gameGrid = $('.game-grid');
    this.$startPage = $('.start-page');
    this.$pressStart = $('.press-start');
    this.$playerSelect = $('.player-select');
    this.$scoreDiv = $('#score');
    this.$livesDiv = $('#lives');
    this.$onePlayer = $('#one-player');
    this.$twoPlayer = $('#two-player');
    this.players = [];
    this.enemy = new Enemy(3, 2);
    this.currentPlayer = null;
    this.highScore = {};
    this.colors = ['cyan', 'lawngreen', 'red', 'chartreuse', 'magenta', 'yellow', 'turquoise']
    this.start();
  }
  // timer = function(){
  //   let count = 0;
  //   const gameTimer = setInterval(()=>{
  //     if (player.dead || ){
  //
  //       player.score += 1000 - count*10
  //       clearInterval(gameTimer);
  //     }
  //
  //   },1000)
  // }
  pause = function(){
    console.log('pause function not built yet')
  }
  getVwPixels = function(){
    const pixels = document.documentElement.clientWidth/100
    return pixels
  }
  start = function(){
    this.$startPage.animate({'top': '-=110vh'},5000, 'linear')
    const blink = setInterval(()=>{
      if (this.$pressStart.css('visibility') == 'hidden') {
        this.$pressStart.css('visibility', 'visible')
      } else {
        this.$pressStart.css('visibility', 'hidden');
      }
    }, 500)
    $('body').on('keydown', (e)=>{
      switch(e.which){
        case 32:
        clearInterval(blink);
        this.choosePlayers();
      }
    })
  }
  choosePlayers = function(){
    $('body').off('keydown');
    this.$pressStart.hide();
    this.$playerSelect.show();
    this.$onePlayer.html('&#9658 1 Player');
    $('body').on('keydown', (e)=>{
      switch(e.which){
        case 37:
        case 38:
        case 39:
        case 40:
        if(this.$onePlayer.html() == '► 1 Player'){
          this.$onePlayer.html('&nbsp; 1 Player');
          this.$twoPlayer.html('&#9658; 2 Player');
        } else {
          this.$twoPlayer.html('&nbsp; 2 Player');
          this.$onePlayer.html('&#9658; 1 Player');
        }
        break;
        case 32:
        case 13:
        if (this.$onePlayer.html() == '► 1 Player'){
          this.play(1);
        } else {
          this.play(2);
        }
        break;
        default: alert("Choose one or two players using arrow keys. Select with Enter.")
      }
    });
  }
  showLives= function(){
    this.$livesDiv.show();
    if (this.currentPlayer.lives === 0){
      game.gameOver(this.currentPlayer);
    }
    this.$livesDiv.empty();
    this.$livesDiv.text("Lives: ")
    for (let lifeIcons = this.currentPlayer.lives; lifeIcons > 0; lifeIcons--){
      this.$livesDiv.append('<div class=life-icon></div>');
    }
  }
  showScore = function(){
    this.$scoreDiv.show();
    this.$scoreDiv.text(`${this.currentPlayer.name}: ${this.currentPlayer.score}`)
  }
  enterNames = function(num){
    this.$gameGrid.hide();
    const $playerName = $('<div class=player-name></div>');
    $playerName.css({'color':'white','font-size':'18pt'});
    if (num < 2){
      $playerName.text('Player 1 Name:');
      this.$gameGrid.append($playerName);
    } else {
      for (let i = 1; i < num; i++){
        $playerName.text(`<div class=enter-name>Player ${i} Name:</div>`);
        this.$gameGrid.append($playerName);
      }
    }
  }
  play = function(playerNum){
    $('body').off('keydown');
    this.$startPage.hide();
    for (let i = 1; i <= playerNum; i++){
      const player = new Player(i);
      this.players.push(player)
    }
    this.currentPlayer = this.players[0];
    $('body').on('keydown', (e)=>{
        console.log(e.which);
        switch(e.which){
          case 37:
          this.currentPlayer.move('left');
          break;
          case 32:
          if (!this.currentPlayer.jumping){
          this.currentPlayer.move('jump');}
          break;
          case 39:
          this.currentPlayer.move('right');
          break;
          case 40:
          this.currentPlayer.move('fall');
          break;
          case 16:
          this.currentPlayer.shoot();
          break;
          case 80:
          this.pause();
          break;
          default:
            console.log("Move using the arrow keys");
        }
    });
    this.makeBoard(this.row, this.column);
    this.makeGround();
    this.grabSquare(4, 4).addClass('ground');
    this.grabSquare(2, 4).addClass('ground');
    this.grabSquare(3, 4).addClass('ground');

    this.grabSquare(6, 6).addClass('ground');
    this.grabSquare(7, 6).addClass('ground');
    this.grabSquare(8, 6).addClass('ground');

    this.grabSquare(6, 2).addClass('hazard');
    this.grabSquare(7, 2).addClass('hazard');
    this.grabSquare(8, 2).addClass('hazard');
    this.grabSquare(9, 2).addClass('hazard');
    this.grabSquare(10, 2).addClass('hazard');

    this.grabSquare(19, 3).addClass('goal');
    this.grabSquare(19, 4).addClass('goal');

    this.grabSquare(8, 7).addClass('enemy');
    this.currentPlayer.render();
    this.showScore();
    this.showLives();
  }
  setHighScore = function(){
    const $highScoreDisplay = $('<ul>High Scores</ul>');
    this.$gameGrid.empty();

    this.highScore[player.name] = player.score;
    let count = 0;
    for (let name in this.highScore){
      count++;
      const $score = $(`<li>${name}: ${this.highScore[name]}</li>`)
      $score.css({'color': `${this.colors[count%this.colors.length]}`})
      $highScoreDisplay.append($score)
    }
    this.$gameGrid.css({'place-self': 'start center'})
    this.$gameGrid.append($highScoreDisplay);
  }
  gameOver = function(player){
    const $gameOverMessage = $(`<h1>Game Over\n${this.currentPlayer.name}</h1>`);
    this.$gameGrid.empty();
    this.$gameGrid.append($gameOverMessage);
    this.$gameGrid.css({'grid-row': '3',
                        'grid-column': '2 / span 2',
                        'color': 'white',
                        'place-self': 'center'})
    setTimeout(()=>{
      game.setHighScore();
    },2500)
  }
  makeBoard = function(rowNum, columnNum){
    this.$gameGrid.empty();
  for(let row = rowNum-1; row >= 0; row--) {
  const $rowDiv = $(`<div class=row row${row} ></div>`);
      for (let square = 0; square < columnNum; square++) {
        const $squareDiv = $(`<div class=square x=${square} y=${row}></div>`)
        $rowDiv.append($squareDiv);
        }
      this.$gameGrid.append($rowDiv);
    }
  }
  makeGround = function(){
    const $square = $('.square');
    $square.each(function(){
      if ($(this).attr('y') < 3){
      $(this).addClass('ground');
      }
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



// const loadGame = function(){
//
// }
// loadGame();
//must be able to reference game so the size of the grid is adaptable


$('body').on('keydown', function(e){
  console.log(e.which);
  switch(e.which){
    case 37:
    game.currentPlayer.move('left');
    break;
    case 32:
    if (!game.currentPlayer.jumping){
    game.currentPlayer.move('jump');}
    break;
    case 39:
    game.currentPlayer.move('right');
    break;
    case 40:
    game.currentPlayer.move('fall');
    break;
    case 16:
    game.currentPlayer.shoot();
    break;
    case 80:
    game.pause();
    break;
    default:
      console.log("Left and right to move, space to jump and shift to shoot.");
  }
});
