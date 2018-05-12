const resPath = "Resources/";

var res = {
  img : {
    wall : resPath + "wall.png",
    snake : resPath + "snake.png"
  },
  se : {

  }
}

window.onload = function() {
  cc.game.onStart = function() {
    //load resources
    var preload_res = [
      res.img.wall,
      res.img.snake
    ];
    cc.LoaderScene.preload(preload_res, function() {
      var MyScene = MainScene();
      cc.director.runScene(new MyScene());
    }, this);
  };
  cc.game.run("gameCanvas");
}
