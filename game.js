var GAME_WIDTH = 608;
var GAME_HEIGHT = 608;
var GAME_SCALE = 4;
var DIM = 18;

var gameport = document.getElementById("gameport");
var renderer = PIXI.autoDetectRenderer(608,608, {BackgroundColor: 0x3344ee});

var stage = new PIXI.Container();

var player = new PIXI.Container();
var water;
// load in the images
var start_button = PIXI.Texture.fromImage("start_button.png");
var background = PIXI.Texture.fromImage("stars.png");
var win_back = PIXI.Texture.fromImage("win.png");

//save the different scenes
var scene1 = new PIXI.Container();
var scene2 = new PIXI.Container();
scene2.scale.x = GAME_SCALE;
scene2.scale.y = GAME_SCALE;
var scene3 = new PIXI.Container();
//create sprites
var button = new PIXI.Sprite(start_button);
var stars= new PIXI.Sprite(background);
var win = new PIXI.Sprite(win_back);

var current_screen = new PIXI.Container();
scene1.addChild(button);
stage.addChild(scene1);
stage.addChild(scene2);
stage.addChild(scene3);
current_screen = scene1;

function mouseHandler(e)
{
  current_screen = scene2;
  animate_game();

}
function you_won()
{
  current_screen = scene3;
  animate_win();
}

button.interactive = true;
button.on('mousedown', mouseHandler);
button.position.x = 200;
button.position.y = 200;
if(current_screen == scene1)
{
  animate_start_screen();
}else if(current_screen == scene2)
{
  animate_game();
}else if(current_screen == scene3)
{
  animate_win();
}
PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
PIXI.loader
  .add('assets.json')
  .add('map','map.json')
  .add('tiles','map.png')
  .load(ready);
  function ready()
  {
  var tu =new TileUtilities(PIXI);
  world = tu.makeTiledWorld("map", 'map.png');
  scene2.addChild(world);
  scene3.addChild(win);


  player.moving_frame = new PIXI.Sprite.fromFrame("leroy2.png");
  player.still_frame = new PIXI.Sprite.fromFrame("leroy1.png");
  player.addChild(player.moving_frame);
  player.addChild(player.still_frame);
  player.moving_frame.visible = false;
  player.position.x = 540;
  player.position.y = 580;


  var entity_layer = world.getObject("Tile Layer 1");
  entity_layer.addChild(player);
  }
gameport.appendChild(renderer.view);



  function move_player() {
    player.moving_frame.visible = true;
    player.still_frame.visible = false;
  }
//changes visibility of players sprites from moving to not
  function still_player() {
    player.moving_frame.visible = false;
    player.still_frame.visible = true;

  }
// listens for keyboard inputs from the user
myAudio = new Audio('music.wav');
myAudio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
myAudio.play();
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
function is_death()
{
  water=world.getObject('water').data;
  if (water[(player.gy+dy-1)*12 + (player.gx+dx)] != 0) {
    you_won();
    return;
  }

}
//renders start screen
function animate_start_screen()
{
 renderer.render(scene1);
 requestAnimationFrame(animate_start_screen);
}
//animates the game screen
function animate_game()
{
  renderer.render(scene2);
  update_camera();
  requestAnimationFrame(animate_game);
}
//animates the winning screen
function animate_win()
{
renderer.render(scene3);
requestAnimationFrame(animate_win);

}//function that looks to see if the movement key has been released
function onKeyUp(key)
{
  still_player();
}
//function that handles key inputs
function onKeyDown(key)
{
  var dx =0;
  var dy =0;
  var new_x;
  var new_y;
  //move player calls the function to change the sprite to moving
  //is_death();
  move_player();
  //checks to see if player has moved into the winning zone.
  if(player.position.x <=150 && player.position.y <= 150)
  {
    you_won();
  }
 if(key.keyCode ===87 || key.keyCode === 38)
 {
   dy = -1;
   //checks to make sure you arent at the edge of the world
   if(player.position.y >= 0)
   {
     new_y = player.position.y -18;
     createjs.Tween.get(player.position).to({x: player.position.x, y: new_y},500);

   }
 }
   if (key.keyCode === 83 || key.keyCode === 40)
   {
     dy = 1;
       //checks to make sure you arent at the edge of the world
       if(player.position.y <= 560)
       {

          new_y = player.position.y +18;
          createjs.Tween.get(player.position).to({x: player.position.x, y: new_y},500);
       }

   }
   //65 and 37 are A and the left arrow in ascii
   if (key.keyCode === 65 || key.keyCode === 37)
   {
      dx = -1;
       //checks to make sure you arent at the edge of the world
       if (player.position.x >= 10)
       {//moves player
           new_x = player.position.x -18;
           createjs.Tween.get(player.position).to({x: new_x, y: player.position.y},500);
       }
   }

   // D Key is 68
   // Right arrow is 39
   if (key.keyCode === 68 || key.keyCode === 39)
   {
      dx = 1;
       //checks to make sure you arent at the edge of the world
       if (player.position.x <= 560)
       {
         new_x = player.position.x +18;
         createjs.Tween.get(player.position).to({x: new_x, y: player.position.y},500);
       }
   }//end of keydown
}
function update_camera() {
  scene2.x = -player.x*GAME_SCALE + GAME_WIDTH/2 - player.width/2*GAME_SCALE;
  scene2.y = -player.y*GAME_SCALE + GAME_HEIGHT/2 + player.height/2*GAME_SCALE;
  scene2.x = -Math.max(0, Math.min(world.worldWidth*GAME_SCALE - GAME_WIDTH, -scene2.x));
  scene2.y = -Math.max(0, Math.min(world.worldHeight*GAME_SCALE - GAME_HEIGHT, -scene2.y));
}
