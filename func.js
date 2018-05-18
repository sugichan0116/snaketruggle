function logObj(scene) {
  console.log(scene._frames, scene._objects.filter((obj) => {
    return obj instanceof Wall === false
  }));
}

function createSnake(scene, r) {
  function createHead(scene, r) {
      let head = new Head(r, createImageForSnake("head"));
      scene._objects.push(head);
      addChild(scene, head);
  }
  let pre;
  scene._objects.forEach((obj) => {
    if(obj instanceof Snake === false) return;
    console.log("dddd : ", obj);
    if(obj.nextSnake === undefined) pre = obj;
  });
  if(pre === undefined) return createHead(scene, r);

  var snake = new Body(
    {},
    createImageForSnake("body")
  );
  if(true) snake.preSnake = pre;
  snake.frame = scene._frames;
  pre.nextSnake = snake;
  scene._objects.push(snake);
  addChild(scene, snake);
}

function removeSnake(scene) {
  scene._objects.forEach((obj) => {
    if(obj instanceof Snake) {
      if(obj.nextSnake === undefined) {
        obj.isRemoved = true;
        for (target of scene._objects) {
          if(target instanceof Snake) {
            if(target.nextSnake === obj) {
              delete target.nextSnake;
            }
          }
        }
      }
    }
  });
}

function createImageForWall(around) {
  let images = [];
  //0,0 => -1, 1
  //1,0 =>  1, 1
  //0,1 => -1,-1
  //1,1 =>  1,-1
  for(let y = 0; y < 2; y++) {
    for(let x = 0; x < 2; x++) {
      let level = 0,
          dx = (x === 0) ? -1 : 1,
          dy = (y === 0) ? 1 : -1;
      if(around[dx][0] && around[0][dy]) {
        if(around[dx][dy]) {
          level = 4;
        } else {
          level = 3;
        }
      } else {
        if(around[dx][0]) {
          level = 2;
        } else if(around[0][dy]) {
          level = 1;
        }
      }

      images.push(cc.Sprite.create(res.img.wall, cc.rect(16 * x, 16 * y + 32 * level, 16, 16)));
    }
  }

  return images;
}

function createImageForSnake(key, frame) {
  let index = 0;
  if(key === "head") index = 0;
  if(key === "body") index = 1;
  if(key === "corner") index = 2;
  if(key === "tail") index = 3;
  //console.log("A: ", key, index);

  return cc.Sprite.create(res.img.snake, cc.rect(32 * index, 32 * (frame % 4), 32, 32));
}

function createImageForEnemy(frame) {
  return cc.Sprite.create(res.img.crawler, cc.rect(0, 32 * (frame % 1), 32, 32));
}

function getAngle(dr) {
  let rot = 0;
  if(dr.x === -1) rot = 0;
  if(dr.y === 1) rot = 90;
  if(dr.x === 1) rot = 180;
  if(dr.y === -1) rot = 270;

  return rot;
}

function addChild(scene, obj) {
  scene.addChild(obj.image, obj.zIndex());
}

function createEnemy(scene, r, entityChar) {
  let dir = {x:0, y:0};
  if(entityChar.indexOf("(U)") !== -1) {
    dir.y = 1;
  }
  if(entityChar.indexOf("(D)") !== -1) {
    dir.y = -1;
  }
  if(entityChar.indexOf("(R)") !== -1) {
    dir.x = 1;
  }
  if(entityChar.indexOf("(L)") !== -1) {
    dir.x = -1;
  }
  let enemy = new Enemy(r, cc.Sprite.create(res.img.memo), dir);
  scene._objects.push(enemy);
  addChild(scene, enemy);
}

function createItem(scene, r) {
  let item = new Item(r, cc.Sprite.create(res.img.memo));
  scene._objects.push(item);
  addChild(scene, item);
}

function createWall(scene, r) {
  let wall = new Wall(r, cc.Sprite.create(res.img.wall, cc.rect(0, 0, 32, 32)));
  scene._objects.push(wall);
  addChild(scene, wall);
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
