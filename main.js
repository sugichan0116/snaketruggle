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
    reset : resPath + "reset.png",
    side : resPath + "reset_r.png",
    frame : resPath + "frame.png",
    title : resPath + "title.png",
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
      res.img.reset,
      res.img.side,
      res.img.frame,
      res.img.title,
      res.se.item,
      res.se.button,
      res.se.clear,
      res.se.move
    ];
    // Pass true to enable retina display, disabled by default to improve performance
    cc.view.enableRetina(false);
    // Adjust viewport meta
    cc.view.adjustViewPort(true);
    // Setup the resolution policy and design resolution size
    cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);
    // The game will be resized when browser size change
    cc.view.resizeWithBrowserSize(true);

    cc.LoaderScene.preload(preload_res, function() {

      console.log(TitleScene);
      cc.director.runScene(new TitleScene());
    }, this);
  };
  cc.game.run("gameCanvas");
}
