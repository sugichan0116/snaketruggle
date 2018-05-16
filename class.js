
class Entity {
  constructor(_r, _image) {
    this.r = _r;
    this.image = _image;
  }

  update(scene, option) {
    if(!option) option = {};
    if(option.scale === undefined) option.scale = 32;
    //console.log(this.image, this.r);
    if(this.image === undefined) return false;
    this.image.setPosition(option.scale * this.r.x, option.scale * this.r.y);
    return true;
  }

  shift(dr) {
    this.r.x += dr.x;
    this.r.y += dr.y;
  }

  shiftTo(r) {
    this.r.x = r.x;
    this.r.y = r.y;
  }

  zIndex() {
    return 0;
  }
}

class Wall extends Entity {

}

class Item extends Entity {
  constructor(_r, _image) {
    super(_r, _image);
    this.isRemoved = false;
  }

  update(scene, option) {
    if(this.removed) return false;
    super.update(scene, option);
    scene._objects.forEach((obj) => {
      if(obj instanceof Head) {
        if(obj.r.x === this.r.x && obj.r.y === this.r.y) {
          createSnake(scene);
          cc.audioEngine.playEffect(res.se.item, false);
          this.isRemoved = true;
          return;
        }
      }
    });
    return this.isRemoved === false;
  }
}

class Snake extends Entity {
  notifyMove(scale, prer, dr) {
    if(this.nextSnake !== undefined) {
      this.nextSnake.move(scale, prer, dr);
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
    this.rot = 0;
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
  canMove(objects, target) {
    let res = true;
    objects.forEach(function(obj) {
      if(obj instanceof Wall || obj instanceof Body) {
        if(target.x === obj.r.x && target.y === obj.r.y) {
          res = false;
        }
      }
    });
    return res;
  }
  move(scale, scene) {
    if(scale === undefined) scale = 32;
    let dr = {x: 0, y: 0};
    let pre = {r:{x:this.r.x, y:this.r.y}};

    if(this.touch.stack.x >= scale) dr.x++;
    else if(this.touch.stack.x <= -scale) dr.x--;
    else if(this.touch.stack.y >= scale) dr.y++;
    else if(this.touch.stack.y <= -scale) dr.y--;

    //console.log(dr);
    if(dr.x || dr.y) {
      console.log(dr, this.touch.stack, this.canMove(scene._objects, {x:dr.x + pre.r.x, y:dr.y + pre.r.y}));
      if(this.canMove(scene._objects, {x:dr.x + pre.r.x, y:dr.y + pre.r.y})) {

        super.shift(dr);
        super.notifyMove(scale, pre.r, dr);

        if(dr.x === -1) this.rot = 0;
        if(dr.y === 1) this.rot = 90;
        if(dr.x === 1) this.rot = 180;
        if(dr.y === -1) this.rot = 270;
      }

      this.releaseMoveDelta();
    }
  }

  update(scene, option) {
    if(!option) option = {};
    super.update(option.scale);
    this.image.removeFromParent();
    this.image.attr({rotation : this.rot});
    scene.addChild(this.image, this.zIndex());
    return true;
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
    this.rot = 0;
    this.key = "body";
    this.isFlip = false;
  }

  move(scale, r, dr) {
    let pre = {r:{x:this.r.x, y:this.r.y}};
    super.shiftTo(r);
    super.notifyMove(scale, pre.r, {x:r.x - pre.r.x, y:r.y - pre.r.y});

    //console.log("ASD", pre.r, r, dr);

    if(dr.x === -1) this.rot = 0;
    if(dr.y === 1) this.rot = 90;
    if(dr.x === 1) this.rot = 180;
    if(dr.y === -1) this.rot = 270;
    this.isFlip = false;
    if(this.nextSnake === undefined) this.key = "tail";
    else {
      if(dr.x === r.x - pre.r.x && dr.y === r.y - pre.r.y) {
        this.key = "body";
        if((pre.r.x + pre.r.y) % 2 === 0) {
          this.isFlip = true;
        }
      } else {
        this.key = "corner";
        if(dr.x * (r.y - pre.r.y) - dr.y * (r.x - pre.r.x) > 0) {
          this.isFlip = true;
        }
      }
    }
  }

  update(scene, option) {
    if(!option) option = {};
    this.image.removeFromParent();
    //console.log("frjifjrijfirjfijrifjrijfirjifjriji", this.image);
    this.image = createImage(this.key);
    this.image.attr({
      rotation : this.rot,
      scaleY : (this.isFlip) ? -1 : 1
     });
    scene.addChild(this.image, this.zIndex());
    super.update(option.scale);
    //console.log(this.image);
    return true;
  }

  zIndex() {
    return 1;
  }
}
