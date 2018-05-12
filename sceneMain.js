
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

      console.log(cc.Sprite.create(res.img.snake));
      var body = new Body(
        {x:2, y:1},
        cc.Sprite.create(res.img.snake, cc.rect(32 * 5, 0, 32, 32))
      );
      var head = new Head(
        {x:2, y:2},
        cc.Sprite.create(res.img.snake, cc.rect(0, 0, 32, 32)),
        body
      );
      sc._objects.push(head, body);
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
            cc.log("onTouchBegan");
            sc._objects.forEach(function(obj) {
              if(obj instanceof Head) {
                obj.releaseMoveDelta();
              }
            });
            return true;
        },

        onTouchMoved: function (touch, event) {
            cc.log("onTouchMoved");
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
            cc.log("onTouchEnded");
            return true;
        },
        onTouchCancelled: function (touch, event) {
            cc.log("onTouchCancelled");
        }
      }), this);

      //set update
      sc.scheduleUpdate();
    },
    update : function(dt) {
      var sc = this;
      sc._objects.forEach(function(obj) {
        obj.update();
      });

    }
  });
}

function addWall(scene, r) {
  scene._objects.push(new Wall(r, cc.Sprite.create(res.img.wall)));
}

class Entity {
  constructor(_r, _image) {
    this.r = _r;
    this.image = _image;
  }

  update(scale) {
    if(scale === undefined) scale = 32;
    //console.log(this.image, this.r);
    this.image.setPosition(scale * this.r.x, scale * this.r.y);
  }

  shift(dr) {
    this.r.x += dr.x;
    this.r.y += dr.y;
  }

  shiftTo(r) {
    this.r.x = r.x;
    this.r.y = r.y;
  }

  image() {
    update(32);
    return this.image;
  }

  zIndex() {
    return 0;
  }
}

class Wall extends Entity {

}

class Snake extends Entity {
  notifyMove(scale, prer) {
    console.log("A", this.nextSnake);
    if(this.nextSnake !== undefined) {
      console.log("B");
      this.nextSnake.move(scale, prer);
    }
  }
}

class Head extends Snake {
  constructor(_r, _image, _nextSnake) {
    super();
    this.r = _r;
    this.image = _image;
    this.nextSnake = _nextSnake;
    this.touch = {r : null, stack : {x:0, y:0}};
  }
  releaseMoveDelta() {
    this.touch.r = null;
    this.touch.stack = {x:0, y:0};
  }
  stackMoveDelta(touch_r) {
    if(this.touch.r != undefined) {
      this.touch.stack.x += touch_r.x - this.touch.r.x;
      this.touch.stack.y += touch_r.y - this.touch.r.y;
    }
    this.touch.r = {x: touch_r.x, y: touch_r.y};
  }
  move(scale) {
    if(scale === undefined) scale = 32;
    let dr = {x: 0, y: 0};
    let pre = {r:{x:this.r.x, y:this.r.y}};

    if(this.touch.stack.x >= scale) dr.x++;
    else if(this.touch.stack.x <= -scale) dr.x--;
    else if(this.touch.stack.y >= scale) dr.y++;
    else if(this.touch.stack.y <= -scale) dr.y--;

    //console.log(dr);
    super.shift(dr);
    if(dr.x || dr.y) {
      console.log("FFJFJ");
      super.notifyMove(scale, pre.r);
      this.releaseMoveDelta();
    }

  }

  zIndex() {
    return 2;
  }
}

class Body extends Snake {
  constructor(_r, _image, _nextSnake) {
    super();
    this.r = _r;
    this.image = _image;
    this.nextSnake = _nextSnake;
  }

  move(scale, r) {
    let pre = {r:{x:this.r.x, y:this.r.y}};
    console.log("HJORIJFOIJRFOIJROIRJOJROJI");
    super.shiftTo(r);
    super.notifyMove(scale, pre.r);
  }

  zIndex() {
    return 1;
  }
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
