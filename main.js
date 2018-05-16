const resPath = "Resources/";

var res = {
  img : {
    wall : resPath + "wall.png",
    snake : resPath + "snake.png",
    memo : resPath + "memory.png"
  },
  se : {
    item : resPath + "getPoint.mp3"
  }
}

window.onload = function() {
  cc.game.onStart = function() {
    //load resources
    var preload_res = [
      res.img.wall,
      res.img.snake,
      res.img.memo,
      res.se.item
    ];
    cc.LoaderScene.preload(preload_res, function() {
      var MyScene = MainScene();
      cc.director.runScene(new MyScene());
    }, this);
  };
  cc.game.run("gameCanvas");
}
