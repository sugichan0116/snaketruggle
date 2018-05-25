
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
    onEnter:function (stageIndex) {
      this._super();
      var sc = this;

      // 背景の作成
      var size = cc.director.getWinSize();
      var bg = cc.Sprite.create(res.img.background);
      bg.setPosition(size.width/2, size.height/2);
      sc.addChild(bg);
      bg = cc.Sprite.create(res.img.reset);
      bg.setPosition(32, size.height/2);
      bg.setScaleY(size.height / bg.getContentSize().height);
      sc.addChild(bg, 9);
      bg = cc.Sprite.create(res.img.side);
      bg.setPosition(size.width - 32, size.height/2);
      bg.setScaleY(size.height / bg.getContentSize().height);
      sc.addChild(bg, 9);
      bg = cc.Sprite.create(res.img.frame);
      bg.setPosition(size.width/2, size.height/2);
      bg.setScaleX(size.width / bg.getContentSize().width);
      bg.setScaleY(size.height / bg.getContentSize().height);
      sc.addChild(bg, 10);
      //sc.addChild(cc.Sprite.create(res.img.reset).setPosition(32, size.height/2), 9);

      this.reset();
      this._gameState["stage"] = stageIndex || 0;
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
            //resetbutton
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
      //index = 10;

      //gate
      if(index === 0) {
        return {
          size: {width:6, height:6},
          r: {x:9, y:5},
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
      //enemy
      if(index === 1) {
        return {
          size: {width:6, height:6},
          r: {x:9, y:5},
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
      //switch
      if(index === 2) {
        return {
          size: {width:6, height:6},
          r: {x:9, y:5},
          lengthOfSnake: 3,
          data: {
            "0" : "w,s(0),  ,  ,  ,  ",
            "1" : "w,  , w,G(0),w,  ",
            "2" : "w,  , w,s(1), w,  ",
            "3" : "w,  ,w,  , w,  ",
            "4" : "w,  ,  , @,  ,  ",
            "5" : "w, w,w,p(1),w, w"
          }
        };
      }
      //item & switch
      if(index === 3) {
        return {
          size: {width:6, height:4},
          r: {x:9, y:5},
          lengthOfSnake: 3,
          data: {
            "0" : "s(2),G(2),   i,   @",
            "1" : "    ,   w,   w,    ",
            "2" : "    ,   w,   w,    ",
            "3" : "    ,    ,    ,s(1)",
            "4" : "G(1),   w,   w,   w",
            "5" : "   p,   w,   w,   w"
          }
        };
      }
      //life of gate & item
      if(index === 4) {
        return {
          size: {width:6, height:1},
          r: {x:9, y:8},
          lengthOfSnake: 3,
          data: {
            "0" : "   @",
            "1" : "    ",
            "2" : "    ",
            "3" : "p(1)",
            "4" : "    ",
            "5" : "s(1)"
          }
        };
      }
      //life of gate & item
      if(index === 4) {
        return {
          size: {width:7, height:2},
          r: {x:9, y:8},
          lengthOfSnake: 3,
          data: {
            "0" : "   @,   w",
            "1" : "s(1),   w",
            "2" : "    ,   w",
            "3" : "G(1),   i",
            "4" : "    ,   w",
            "5" : "    ,   w",
            "6" : "   p,   w",
          }
        };
      }
      //enemy RARE
      if(index === 5) {
        return {
          size: {width:6, height:3},
          r: {x:9, y:5},
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
      //switch & gate
      if(index === 6) {
        return {
          size: {width:6, height:6},
          r: {x:9, y:5},
          lengthOfSnake: 4,
          data: {
            "0" : "w,  ,  , @,  ,  ",
            "1" : "w,  , w,  , w,  ",
            "2" : "w,g(0),w, ,  ,  ",
            "3" : " ,  ,  , w,  , w",
            "4" : " , w,  , w,  , w",
            "5" : "s(0),, i,w,p(0), w,"
          }
        };
      }
      // remote switch gate
      if(index === 7) {
        return {
          size: {width:6, height:5},
          r: {x:9, y:5},
          lengthOfSnake: 2,
          data: {
            "0" : "   @,    ,   w,    ,p(2&4)",
            "1" : "    ,    ,G(3),    ,    ",
            "2" : "s(1),    ,   w,    ,s(2)",
            "3" : "   w,   w,   w,   w,   w",
            "4" : "    ,    ,G(2),    ,L(R)",
            "5" : "s(3),    ,G(1),    ,s(4)"
          }
        };
      }
      //rock difficult
      if(index === 8) {
        return {
          size: {width:8, height:4},
          r: {x:9, y:5},
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
      //switch difficult
      if(index === 9) {
        return {
          size: {width:7, height:5},
          r: {x:9, y:5},
          lengthOfSnake: 8,
          data: {
            "0" : "s(2),    ,   @,    ,s(1)",
            "1" : "g(3),   w,g(1),   w,g(2)",
            "2" : "s(4),    ,s(3),    ,s(1)",
            "3" : "g(1),   w,g(4),   w,g(3)",
            "4" : "s(1),G(1),s(3),    ,s(2)",
            "5" : "g(2),   w,g(1),   w,g(2)",
            "6" : "s(3),    ,p(2&3&4),g(4),s(1)",
          }
        };
      }
      //synclo
      if(index === 10) {
        return {
          size: {width:9, height:4},
          r: {x:9, y:4},
          lengthOfSnake: 2,
          data: {
            "0" : "   @,    ,p(3),    ",
            "1" : "    ,    ,    ,s(2)",
            "2" : "   a,    ,g(1),    ",
            "3" : "   a,    ,    ,    ",
            "4" : "   w,   w,   w,   w",
            "5" : "   a,   w,s(3),g(2)",
            "6" : "    ,s(1),   w,    ",
            "7" : "    ,    ,    ,    ",
            "8" : "   w,    ,    ,    "
          }
        };
      }
      //enemy difficult
      if(index === 11) {
        return {
          size: {width:6, height:6},
          r: {x:9, y:4},
          lengthOfSnake: 18,
          data: {
            "0" : "s(3),    ,    ,    ,    ,s(1)",
            "1" : "    ,   @,    ,    ,    ,    ",
            "2" : "e(L),    ,e(L),    ,e(L),    ",
            "3" : "    ,e(R),    ,e(R),    ,e(R)",
            "4" : "    ,    ,    ,    ,p(1&2&3&4),    ",
            "5" : "s(2),    ,    ,    ,    ,s(4)"
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

      for(let x = 0; x <= 25; x++) {
        for(let y = 0; y <= 14; y++) {
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
          entityChar = entityChar.replace(new RegExp(" ", "g"), "");
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
          } else if(entityChar === "a") {
            createImitateEnemy(sc, deploy.r);
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
