
function MainScene() {
  return cc.Scene.extend({
    //プロパティ
    _scale : 32,
    _objects: [],
    //init
    onEnter:function () {
      this._super();

      var size = cc.director.getWinSize();
      // 背景の作成
      var bg = cc.Sprite.create(res.img_bg);
      bg.setPosition(size.width/2, size.height/2);
      var sc = this;
      sc.addChild(bg);

      var body3 = new Body(
        {x:0, y:0},
        createSnake("tail")
      );
      var body2 = new Body(
        {x:0, y:1},
        createSnake("body"),
        body3
      );
      var body = new Body(
        {x:1, y:1},
        createSnake("body"),
        body2
      );
      var head = new Head(
        {x:2, y:1},
        createSnake("head"),
        body
      );
      sc._objects.push(head, body, body2, body3);
      for(let x = 0; x < 20; x++) {
        for(let y = 0; y < 12; y++) {
          if(x === 10) continue;
          addWall(sc, {x:x, y:y});
        }
      }
      sc._objects.forEach(function(obj) {
        sc.addChild(obj.image, obj.zIndex());
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
                obj.move();
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
      sc._objects.forEach(function(obj) {
        obj.update(sc);
      });

    }
  });
}

function createSnake(key) {
  let index = 0;
  if(key === "head") index = 0;
  if(key === "body") index = 1;
  if(key === "corner") index = 2;
  if(key === "tail") index = 3;
  //console.log("A: ", key, index);

  return cc.Sprite.create(res.img.snake, cc.rect(32 * index, 0, 32, 32));
}

function addWall(scene, r) {
  scene._objects.push(new Wall(r, cc.Sprite.create(res.img.wall)));
}

function addPoint(r1, r2) {
  r1.x += r2.x;
  r1.y += r2.y;
  return
}

function subPoint(r1, r2) {
  r1.x -= r2.x;
  r1.y -= r2.y;
}
