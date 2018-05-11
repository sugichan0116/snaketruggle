

var res = {
  img_bg : "Resources/bg.png",
  img_coin : "Resources/pluskun.png",
  img_enemy : "Resources/rectman.png",
  img_snake : "Resources/snake.png",
  se_hitwall : "Resources/hitWall.mp3",
  se_getPoint : "Resources/getPoint.mp3",
  se_dead : "Resources/dead.mp3",
  se_changeDir : "Resources/changeDirection.mp3"
}

window.onload = function() {
  cc.game.onStart = function() {
    //load resources
    var preload_res = [
      res.img_bg,
      res.img_coin,
      res.img_enemy,
      res.img_snake,
      res.se_hitwall,
      res.se_getPoint,
      res.se_dead,
      res.se_changeDir
    ];
    cc.LoaderScene.preload(preload_res, function() {
      var MyScene = MainScene();
      cc.director.runScene(new MyScene());
    }, this);
  };
  cc.game.run("gameCanvas");
}
