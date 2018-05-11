
function MainScene() {
  return cc.Scene.extend({
    _scale : 32,
    _objects: [],
    onEnter:function () {
      this._super();
      var size = cc.director.getWinSize();
      // 背景の作成
      var bg = cc.Sprite.create(res.img_bg);
      bg.setPosition(size.width/2, size.height/2);
      var sc = this;
      sc.addChild(bg);
      sc._objects.push(new Wall({x:2, y:2}, cc.Sprite.create(res.img.wall)));
      sc._objects.forEach(function(obj) {
        sc.addChild(obj.image, 1);
      });
      cc.eventManager.addListener(cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        onTouchBegan: function (touch, event) {
            cc.log("onTouchBegan");
            sc._objects.forEach(function(obj) {
              obj.shift({x:2, y:1});
            })
            return true;
        },

        onTouchMoved: function (touch, event) {
            cc.log("onTouchMoved");
        },

        onTouchEnded: function (touch, event) {
            cc.log("onTouchEnded");
        },

        onTouchCancelled: function (touch, event) {
            cc.log("onTouchCancelled");
        }
      }), this);
      sc.scheduleUpdate();
    },
    update : function(dt) {
      var sc = this;
      sc._objects.forEach(function(obj) {
        obj.update(sc._scale);
      });

    }
  });
}


class Entity {
  constructor(_r, _image) {
    this.r = _r;
    this.image = _image;
  }

  update(scale) {
    //console.log(this.image, this.r);
    this.image.setPosition(scale * this.r.x, scale * this.r.y);
  }

  shift(dr) {
    this.r.x += dr.x;
    this.r.y += dr.y;
  }

  image() {
    update(32);
    return this.image;
  }
}

class Wall extends Entity {

}

class Snake extends Entity {

}

class Head extends Snake {

}

class Body extends Snake {
  constructor() {

  }
}
