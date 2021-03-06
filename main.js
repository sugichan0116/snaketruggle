const resPath = "Resources/";

var res = {
  img : {
    wall : resPath + "wall.png",
    snake : resPath + "snake.png",
    memo : resPath + "memory.png",
    crawler : resPath + "crawler.png",
    button : resPath + "switch.png",
    gate : resPath + "gate.png",
    portal : resPath + "portal.png",
    background : resPath + "back.png"
  },
  se : {
    item : resPath + "getPoint.mp3",
    move : resPath + "move.mp3",
    button : resPath + "button.mp3",
    clear : resPath + "clear.mp3"
  }
}

window.onload = function() {
  cc.game.onStart = function() {
    //load resources
    var preload_res = [
      res.img.wall,
      res.img.snake,
      res.img.memo,
      res.img.crawler,
      res.img.background,
      res.img.button,
      res.img.portal,
      res.img.gate,
      res.se.item,
      res.se.button,
      res.se.clear,
      res.se.move
    ];
    cc.LoaderScene.preload(preload_res, function() {
      var MyScene = MainScene();
      cc.director.runScene(new MyScene());
    }, this);
  };
  cc.game.run("gameCanvas");
}
