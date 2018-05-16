
function MainScene() {
  return cc.Scene.extend({
    //プロパティ
    _scale   : 32,
    _objects : [],
    //init
    onEnter:function () {
      this._super();
      

      var size = cc.director.getWinSize();
      // 背景の作成
      var bg = cc.Sprite.create(res.img_bg);
      bg.setPosition(size.width/2, size.height/2);
      var sc = this;
      sc.addChild(bg);

      for (var i = 0; i < 2; i++) {
        createSnake(sc, {x:2, y:2});
      }
      for(let x = 0; x < 20; x++) {
        for(let y = 0; y < 12; y++) {
          if(x > 0 && x < 10) continue;
          //createWall(sc, {x:x, y:y});
        }
      }
      createItem(sc, {x:5, y:5});
      createItem(sc, {x:10, y:5});
      createItem(sc, {x:11, y:5});
      createItem(sc, {x:6, y:6});
      createWall(sc, {x:4, y:5});
      // sc._objects.forEach(function(obj) {
      //   sc.addChild(obj.image, obj.zIndex());
      // });

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
                obj.move(32, sc);
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
    },
    update : function(dt) {
      var sc = this;
      sc._objects.forEach(function(obj, index) {
        if(obj.update(sc) === false) {
          obj.image.removeFromParent();
          sc._objects.splice(index, 1);
        }
      });
    }
  });
}
