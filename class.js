
class Entity {
  constructor(_r, _image) {
    this.r = _r;
    this.image = _image;
  }

  releaseImage(isForce) {
    if(this.isRemoved === true || isForce === true) {
      if(this.image) this.image.removeFromParent();
      if(this.images) this.images.forEach((img) => {
        img.removeFromParent();
      });
    }
  }

  update(scene, option) {
    if(this.isRemoved === true) {
      this.releaseImage();
      return false;
    }
    if(!option) option = {};
    if(option.scale === undefined) option.scale = 32;

    if(this.image === undefined) return false;
    this.image.setPosition(option.scale * this.r.x, option.scale * this.r.y);
    if(this.images) {
      this.images.forEach((img, index) => {
        img.setPosition(
          option.scale * (this.r.x + index % 2 * 0.5 - 0.25),
          option.scale * (this.r.y + ((index <= 1) ? 1 : 0) * 0.5 - 0.25)
        );
      });
    }
    return true;
  }

  isRelate(obj) {
    return false;
  }

  canMove(objects, target, isRelate) {
    let res = true;
    objects.forEach(function(obj) {
      if(isRelate(obj)) {
        if(target.x === obj.r.x && target.y === obj.r.y) {
          res = false;
        }
      }
    });
    return res;
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

class Portal extends Entity {
  constructor(_r, _image) {
    super(_r, _image);
    this.state = 0;
  }

  isRelate(obj) {
    return (obj instanceof Snake);
  }

  checkClear(scene) {
    if(super.canMove(scene._objects, this.r, this.isRelate) === false) {
      if(this.state !== 1) {
        scene._gameState["isClear"] = true;
        this.state = 1;
        cc.audioEngine.playEffect(res.se.clear, false);
      }
    }
  }

  update(scene, option) {
    this.checkClear(scene);

    if(!option) option = {};
    this.image.removeFromParent();
    this.image = createImagePortal((this.isPowered === false) ? 1 : 0, scene._frames);
    scene.addChild(this.image, this.zIndex());
    return super.update(scene, option);
  }

  zIndex() {
    return 2;
  }
}

class SignalPortal extends Portal {
  constructor(_r, _image, _receiver) {
    super(_r, _image);
    this.receivers = _receiver;
    this.isPowered = false;
  }

  checkClear(scene) {
    if(this.isPowered) super.checkClear(scene);
  }

  catchSignal(scene) {
    let state = true;
    this.receivers.forEach((receiver) => {
      let signal = scene._signals[Number(receiver)];
      if(signal === undefined) signal = false;
      state = state && signal;
    });
    return state;
  }

  updateWithSignal(scene) {
    if(this.catchSignal(scene) === true) {
      this.isPowered = true;
    }
  }
}

class Gimmick extends Entity {
  isRelate(obj) {
    return (obj instanceof Snake) || (obj instanceof Enemy);
  }
}

class Switch extends Gimmick {
  constructor(_r, _image, _port) {
    super(_r, _image);
    this.port = _port;
    this.preState = 0;
  }

  update(scene, option) {
    let isPowered = 0;
    if(super.canMove(scene._objects, this.r, super.isRelate) === false) {
      //snakeが乗ってる
      if(this.preState === 0) {
        cc.audioEngine.playEffect(res.se.button, false);
      }
      isPowered = 1;
      scene._signals[this.port] = true;
    }
    this.preState = isPowered;

    if(!option) option = {};
    this.image.removeFromParent();
    this.image = createImageSwitch(isPowered, scene._frames);
    scene.addChild(this.image, this.zIndex());
    return super.update(scene, option);
  }

  zIndex() {
    return 2;
  }
}

class Gate extends Gimmick {
  constructor(_r, _image, _isSignal, _receiver) {
    super(_r, _image);
    this.receivers = _receiver;
    this.isWall = _isSignal;
    this.isWallOnNoSignal = _isSignal;
  }

  catchSignal(scene) {
    let state = true;
    this.receivers.forEach((receiver) => {
      let signal = scene._signals[Number(receiver)];
      if(signal === undefined) signal = false;
      state = state && signal;
    });
    return state;
  }

  changeWall(scene) {
    let state = this.catchSignal(scene);
    this.isWall = state ^ this.isWallOnNoSignal;
    if(super.canMove(scene._objects, this.r, super.isRelate) === false) {
      //snakeが乗ってる
      this.isWall = false;
    }
  }

  updateWithSignal(scene) {
    this.changeWall(scene);
  }

  update(scene, option) {
    if(!option) option = {};
    this.image.removeFromParent();
    this.image = createImageGate(((this.isWall) ? 1 : 0), scene._frames);
    scene.addChild(this.image, this.zIndex());
    return super.update(scene, option);
  }
}

class Wall extends Entity {

  removeImage() {
    if(this.image) this.image.removeFromParent();
    if(this.images) this.images.forEach((img) => {
      img.removeFromParent();
    });
  }

  reload(scene) {
    this.removeImage();
    let around = {"-1":{}, "0":{}, "1":{}};
    scene._objects.forEach((obj) => {
      if(obj instanceof Wall) {
        let r = {x: obj.r.x - this.r.x, y: obj.r.y - this.r.y};
        if(Math.abs(r.x) <= 1 && Math.abs(r.y) <= 1) {
          around[r.x][r.y] = true;
        }
      }
    });
    // this.around = around;
    this.images = createImageForWall(around, scene._frames);
    this.images.forEach((img) => {
      scene.addChild(img, this.zIndex());
    });
  }
}

class Item extends Entity {
  constructor(_r, _image) {
    super(_r, _image);
    this.isRemoved = false;
  }

  update(scene, option) {
    if(this.isRemoved) return false;
    super.update(scene, option);
    scene._objects.forEach((obj) => {
      if(obj instanceof Head) {
        if(obj.r.x === this.r.x && obj.r.y === this.r.y) {
          // removeSnake(scene);
          createSnake(scene, {}, true);
          cc.audioEngine.playEffect(res.se.item, false);
          this.isRemoved = true;
          return;
        }
      }
    });
    return this.isRemoved === false;
  }

  zIndex() {
    return 3;
  }
}

class Enemy extends Entity {
  constructor(_r, _image, _dir, _angle) {
    super(_r, _image);
    this.dir = _dir;
    this.angleOnMove = _angle;
  }
  isRelate(obj) {
    return (obj instanceof Wall)
      || (obj instanceof Snake)
      || (obj instanceof Enemy)
      || (obj instanceof Gate && obj.isWall);
  }
  switchDirection() {
    if(this.angleOnMove === undefined) this.angleOnMove = 180;
    let angle = this.angleOnMove * Math.PI / 180;

    console.log("this.dir");
    console.log(this.dir);
    this.dir = {
      x : Math.round(Math.cos(angle) * this.dir.x - Math.sin(angle) * this.dir.y),
      y : Math.round(Math.sin(angle) * this.dir.x + Math.cos(angle) * this.dir.y)
    };
    console.log(this.dir);
  }

  move(scene) {
    if(this.isMyTurn) {
      if(this.canMove(
        scene._objects,
        {x:this.dir.x + this.r.x, y:this.dir.y + this.r.y},
        this.isRelate
      )) {
        this.shift(this.dir);
      } else {
        this.switchDirection();
      }
      this.rot = getAngle(this.dir);
      this.isMyTurn = false;
    }
  }

  update(scene, option) {
    if(!option) option = {};

    this.move(scene);

    this.image.removeFromParent();
    this.image = createImageForEnemy(scene._frames);
    this.image.attr({rotation : this.rot});
    scene.addChild(this.image, this.zIndex());

    return super.update(option.scale);
  }

  zIndex() {
    return 4;
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
  isRelate(obj) {
    return (obj instanceof Wall)
      || (obj instanceof Body)
      || (obj instanceof Enemy)
      || (obj instanceof Gate && obj.isWall);
  }
  restartTime(objects) {
    objects.forEach((obj) => {
      if(obj instanceof Enemy) {
        obj.isMyTurn = true;
      }
    });
  }
  move(scene, scale) {
    if(scale === undefined) scale = 16;
    let dr = {x: 0, y: 0};
    let pre = {r:{x:this.r.x, y:this.r.y}};

    if(this.touch.stack.x >= scale) dr.x++;
    else if(this.touch.stack.x <= -scale) dr.x--;
    else if(this.touch.stack.y >= scale) dr.y++;
    else if(this.touch.stack.y <= -scale) dr.y--;

    //console.log(dr);
    if(dr.x || dr.y) {
      if(this.canMove(
        scene._objects,
        {x:dr.x + pre.r.x, y:dr.y + pre.r.y},
        this.isRelate
      )) {

        cc.audioEngine.setEffectsVolume(0.5);
        cc.audioEngine.playEffect(res.se.move, false);
        //cc.audioEngine.setEffectsVolume(1.0);
        super.shift(dr);
        super.notifyMove(scale, pre.r, dr);

        this.rot = getAngle(dr);
        this.restartTime(scene._objects);
      }

      this.releaseMoveDelta();
    }
  }

  update(scene, option) {
    if(!option) option = {};
    this.image.removeFromParent();
    this.image = createImageForSnake("head", scene._frames);
    this.image.attr({rotation : this.rot});
    scene.addChild(this.image, this.zIndex());
    return super.update(option.scale);
  }

  zIndex() {
    return 3;
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
    //console.log(scene._frames);
    this.image = createImageForSnake(this.key, scene._frames);
    this.image.attr({
      rotation : this.rot,
      scaleY : (this.isFlip) ? -1 : 1
     });
    scene.addChild(this.image, this.zIndex());
    //console.log(this.image);
    return super.update(option.scale);
  }

  zIndex() {
    return 3;
  }
}
