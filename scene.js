
var MainScene = (function () {
  return cc.Scene.extend({
    //プロパティ
    _scale   : 32,
    _objects : [],
    _frames : 0,
    _signals : {},
    _isReset : false,
    _gameState : {},
    //init
    onEnter:function () {
      this._super();
      var sc = this;

      // 背景の作成
      var size = cc.director.getWinSize();
      var bg = cc.Sprite.create(res.img.background);
      bg.setPosition(size.width/2, size.height/2);
      sc.addChild(bg);
      bg = cc.Sprite.create(res.img.reset);
      bg.setPosition(32, size.height/2);
      sc.addChild(bg, 9);
      //sc.addChild(cc.Sprite.create(res.img.reset).setPosition(32, size.height/2), 9);

      this.reset();
      this._gameState["stage"] = 6;
      this.generate();

      //タッチ処理
      cc.eventManager.addListener(cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        onTouchBegan: function (touch, event) {
            //cc.log("onTouchBegan");
            sc._objects.forEach(function(obj) {
              if(obj instanceof Head) {
                obj.releaseMoveDelta();
              }
            });
            let r = touch.getLocation();
            if(r.x < 64) {
              sc._isReset = true;
            }
            return true;
        },

        onTouchMoved: function (touch, event) {
            //cc.log("onTouchMoved");
            sc._objects.forEach(function(obj) {
              if(obj instanceof Head) {
                //console.log(obj.touch.stack);
                obj.stackMoveDelta(touch.getLocation());
                obj.move(sc);
              }
            });
            return true;
        },
        onTouchEnded: function (touch, event) {
            //cc.log("onTouchEnded");
            return true;
        },
        onTouchCancelled: function (touch, event) {
            //cc.log("onTouchCancelled");
        }
      }), this);

      //set update
      sc.scheduleUpdate();
      sc.schedule(() => {
        sc._frames++;
      }, 0.1);
    },
    mapdata : function (index) {

      if(index === 0) {
        return {
          size: {width:6, height:6},
          r: {x:7, y:3},
          lengthOfSnake: 2,
          data: {
            "0" : "@, w, w, w, w, w",
            "1" : " , w, w, w, w, w",
            "2" : " , w, w, w, w, w",
            "3" : " , w, w, w, w, w",
            "4" : " ,  ,  ,  ,  , p",
            "5" : " , w, w, w, w, w"
          }
        };
      }
      if(index === 1) {
        return {
          size: {width:6, height:6},
          r: {x:7, y:3},
          lengthOfSnake: 2,
          data: {
            "0" : "@, w, w, w, w, w",
            "1" : " ,  ,  ,  ,  , w",
            "2" : " , w, w, w,  , w",
            "3" : " , w, w, w,  , w",
            "4" : "R(R),  ,  ,  ,  , w",
            "5" : "w, w, w, w, p, w"
          }
        };
      }
      if(index === 2) {
        return {
          size: {width:6, height:7},
          r: {x:7, y:3},
          lengthOfSnake: 2,
          data: {
            "0" : " ,  ,  , @, w, w, w",
            "1" : " , w, w,  , w, w, w",
            "2" : " ,  ,  ,  ,  , s(0),  ",
            "3" : "w, w, w,  , w,  ,  ",
            "4" : "w, w, w, p(0), w, w, w",
            "5" : "w,R(L),,  , w, w, w"
          }
        };
      }
      if(index === 3) {
        return {
          size: {width:6, height:6},
          r: {x:7, y:3},
          lengthOfSnake: 3,
          data: {
            "0" : "w, w, w,  ,,L(R)",
            "1" : "w, w, w,  , w,  ",
            "2" : "w, w, w,  , w,  ",
            "3" : ",s(0),w,  , w,  ",
            "4" : " ,  ,  , @,g(0),",
            "5" : "w, w,w,p(0),w, w"
          }
        };
      }
      if(index === 4) {
        return {
          size: {width:6, height:3},
          r: {x:7, y:3},
          lengthOfSnake: 4,
          data: {
            "0" : "w, p, w",
            "1" : "w,e(L), w",
            "2" : "w, @, w",
            "3" : "  ,  ,  ",
            "4" : "  ,  ,  ",
            "5" : "  ,  ,  "
          }
        };
      }
      if(index === 5) {
        return {
          size: {width:6, height:6},
          r: {x:7, y:3},
          lengthOfSnake: 4,
          data: {
            "0" : "w,  ,  , @,  ,  ",
            "1" : "w,  , w,  , w,  ",
            "2" : "w,g(0),w, ,  ,  ",
            "3" : " ,  ,  , w,  , w",
            "4" : " , w,  , w,  , w",
            "5" : " ,  ,s(0),w,p(0), w,"
          }
        };
      }
      if(index === 6) {
        return {
          size: {width:8, height:4},
          r: {x:7, y:3},
          lengthOfSnake: 3,
          data: {
            "0" : "w,  , i, w",
            "1" : " ,  , i, w",
            "2" : "i,  ,  , w",
            "3" : "w, @, w, w",
            "4" : "w,s(0),w,w",
            "5" : "w,  , w, w",
            "6" : " ,  , w, p",
            "7" : " , i,G(0),g(0)",
          }
        };
      }

    },
    generate : function () {
      let sc = this;
      //mapの生成
      let map = this.mapdata(this._gameState["stage"]);
      if(map === undefined) {
        sc.nextTo();
        return;
      }

      for(let x = 0; x <= 20; x++) {
        for(let y = 0; y <= 12; y++) {
          if(map.size.width > x - map.r.x &&
             x - map.r.x >= 0 &&
             map.size.height > y - map.r.y &&
             y - map.r.y >= 0) continue;
          createWall(sc, {x:x, y:y});
        }
      }
      Object.keys(map.data).forEach((x) => {
        let line = map.data[x].split(",");
        line.forEach((entityChar, y) => {
          entityChar = entityChar.replace(" ", "");
          let deploy = {r: {
            x:Number(x) + map.r.x,
            y:Number(y) + map.r.y
          }};
          if(entityChar === "w") {
            createWall(sc, deploy.r);
          } else if(entityChar.indexOf("e") === 0) {
            createEnemy(sc, deploy.r, entityChar);
          } else if(entityChar.indexOf("R") === 0) {
            createEnemy(sc, deploy.r, entityChar, 90);
          } else if(entityChar.indexOf("L") === 0) {
            createEnemy(sc, deploy.r, entityChar, -90);
          } else if(entityChar.indexOf("s") === 0) {
            createSwitch(sc, deploy.r, entityChar);
          } else if(entityChar.indexOf("g") === 0) {
            createGate(sc, deploy.r, entityChar, false);
          } else if(entityChar.indexOf("G") === 0) {
            createGate(sc, deploy.r, entityChar, true);
          } else if(entityChar === "i") {
            createItem(sc, deploy.r);
          } else if(entityChar.indexOf("p") === 0) {
            createPortal(sc, deploy.r, entityChar);
          } else if(entityChar === "@") {
            for (var i = 0, n = map.lengthOfSnake; i < n; i++) {
              createSnake(sc, deploy.r);
            }
          }
        });
      });

      //壁のスムージング
      this._objects.forEach((obj) => {
        if(obj instanceof Wall) obj.reload(sc);
      });

    },
    nextTo : function () {
      let transition = cc.TransitionFade.create(1.0, new TitleScene());
      cc.director.runScene(transition);
      cc.eventManager.removeAllListeners();
      this.removeAllChildren();
    },
    reset : function () {
      this._isReset = false;
      this._frames = 0;
      this._signals = {};
      this._objects.forEach((obj) => {
        obj.releaseImage(true);
      })
      this._objects = [];

    },
    nextStage : function () {
      this._gameState["stage"]++;
      this._gameState["isClear"] = false;
      this.scheduleOnce(() => {
        this._isReset = true;
      }, 1.0);
    },
    update : function() {
      var sc = this;
      sc._objects.forEach((obj) => {
        obj.update(sc);
      });
      //removedの除外
      sc._objects = sc._objects.filter((obj) => {
        obj.releaseImage();
        return obj.isRemoved !== true;
      });
      sc._objects.forEach((obj) => {
        if(obj.updateWithSignal !== undefined) {
          obj.updateWithSignal(sc);
        }
      });
      //signalのclean
      Object.keys(sc._signals).forEach((key) => {
        sc._signals[key] = false;
      });
      if(sc._isReset === true) {
        sc.reset();
        this.generate();
      }
      if(sc._gameState["isClear"]) sc.nextStage();
    }
  });
})();

var TitleScene = (function () {
  return cc.Scene.extend({
    //pro

    //init
    onEnter : function () {
      this._super();
      let scene = this;

      var size = cc.director.getWinSize();
      var bg = cc.Sprite.create(res.img.title);
      bg.setPosition(size.width/2, size.height/2);
      this.addChild(bg);

      this.scheduleUpdate();
      //タッチ処理
      cc.eventManager.addListener(cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        onTouchBegan: function (touch, event) {
            cc.log("onTouchBegan");
            scene.nextTo();
            return true;
        }
      }), this);

    },
    nextTo : function () {
      console.log(MainScene);
      let transition = cc.TransitionFade.create(1.0, new MainScene());
      cc.director.runScene(transition);
      cc.eventManager.removeAllListeners();
      this.removeAllChildren();
    },
    update : function () {

    }
  });
})();
