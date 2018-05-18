
function MainScene() {
  return cc.Scene.extend({
    //プロパティ
    _scale   : 32,
    _objects : [],
    _frames : 0,
    _signals : {},
    //init
    onEnter:function () {
      this._super();
      var sc = this;

      // 背景の作成
      var size = cc.director.getWinSize();
      var bg = cc.Sprite.create(res.img.background);
      bg.setPosition(size.width/2, size.height/2);
      sc.addChild(bg);

      //mapの生成
      let map = {
          size: {width:8, height:6},
          r: {x:7, y:3},
          lengthOfSnake: 2,
          data: {
            // "0" : {"1":"i", "2":"w", "3":"w", "4":"i"},
            // "1" : {"0":"i", "1":"@", "3":"g(4)"},
            // "2" : {"0":"w", "2":"w", "3":"w", "5":"i"},
            // "3" : {"0":"i", "2":"s(4)", "3":"w", "4":"w", "5":"w"},
            // "4" : {"1":"w", "2":"e(R)", "5":"i"},
            // "5" : {"2":"i", "3":"w", "4":"i"}"0" : {"1":"i", "2":"w", "3":"w", "4":"i"},
            "0" : "@,  , w, w, w, w",
            "1" : " ,  ,  ,  ,  , e(D)",
            "2" : " , w, w,  , w, w",
            "3" : "w, w, w,  ,  ,  ",
            "4" : " ,  ,  ,  , w,  ",
            "5" : " , i, w,  , w,  ",
            "6" : "w, w, w,  , w,  ",
            "7" : " ,  ,G(0),,  ,s(0)"
          }
        };
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
          } else if(entityChar.indexOf("s") === 0) {
            createSwitch(sc, deploy.r, entityChar);
          } else if(entityChar.indexOf("g") === 0) {
            createGate(sc, deploy.r, entityChar, false);
          } else if(entityChar.indexOf("G") === 0) {
            createGate(sc, deploy.r, entityChar, true);
          } else if(entityChar === "i") {
            createItem(sc, deploy.r);
          } else if(entityChar === "@") {
            for (var i = 0, n = map.lengthOfSnake; i < n; i++) {
              createSnake(sc, deploy.r);
            }
          }
        });
        // Object.keys(map.data[x]).forEach((y) => {
        //   console.log(x, y);
        //   let entityChar = map.data[x][y];
        //   let deploy = {r: {
        //     x:Number(x) + map.r.x,
        //     y:Number(y) + map.r.y
        //   }};
        //   if(entityChar === "w") {
        //     createWall(sc, deploy.r);
        //   } else if(entityChar.indexOf("e") === 0) {
        //     createEnemy(sc, deploy.r, entityChar);
        //   } else if(entityChar.indexOf("s") === 0) {
        //     createSwitch(sc, deploy.r, entityChar);
        //   } else if(entityChar.indexOf("g") === 0) {
        //     createGate(sc, deploy.r, entityChar);
        //   } else if(entityChar === "i") {
        //     createItem(sc, deploy.r);
        //   } else if(entityChar === "@") {
        //     for (var i = 0, n = map.lengthOfSnake; i < n; i++) {
        //       createSnake(sc, deploy.r);
        //     }
        //   }
        // });
      });

      //壁のスムージング
      this._objects.forEach((obj) => {
        if(obj instanceof Wall) obj.reload(sc);
      });

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
    update : function(dt) {
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
        console.log("SIGNAL >>>> ", key, sc._signals[key]);
        sc._signals[key] = false;
      });
    }
  });
}
