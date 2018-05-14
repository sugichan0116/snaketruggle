
class Entity {
  constructor(_r, _image) {
    this.r = _r;
    this.image = _image;
  }

  update(scene, option) {
    if(!option) option = {};
    if(option.scale === undefined) option.scale = 32;
    //console.log(this.image, this.r);
    this.image.setPosition(option.scale * this.r.x, option.scale * this.r.y);
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
      super.notifyMove(scale, pre.r, dr);
      this.releaseMoveDelta();
    }

    if(dr.x === -1) this.rot = 0;
    if(dr.y === 1) this.rot = 90;
    if(dr.x === 1) this.rot = 180;
    if(dr.y === -1) this.rot = 270;
  }

  update(scene, option) {
    if(!option) option = {};
    super.update(option.scale);
    this.image.removeFromParent();
    this.image.attr({rotation : this.rot});
    scene.addChild(this.image, this.zIndex());
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

    console.log("ASD", pre.r, r, dr);

    if(dr.x === -1) this.rot = 0;
    if(dr.y === 1) this.rot = 90;
    if(dr.x === 1) this.rot = 180;
    if(dr.y === -1) this.rot = 270;
    this.isFlip = false;
    if(this.nextSnake === undefined) this.key = "tail";
    else {
      if(dr.x === r.x - pre.r.x && dr.y === r.y - pre.r.y) {
        this.key = "body";
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
    this.image = createSnake(this.key);
    this.image.attr({
      rotation : this.rot,
      scaleY : (this.isFlip) ? -1 : 1
     });
    scene.addChild(this.image, this.zIndex());
    super.update(option.scale);
    console.log(this.image);
  }

  zIndex() {
    return 1;
  }
}
