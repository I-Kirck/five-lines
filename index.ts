
const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;

enum RawTile {
  AIR,
  FLUX,
  UNBREAKABLE,
  PLAYER,
  STONE, FALLING_STONE,
  BOX, FALLING_BOX,
  KEY1, LOCK1,
  KEY2, LOCK2
}

interface FallingState {
  isFalling(): boolean;
  moveHorizontal(tile: Tile, dx: number): void;
}

class Falling implements FallingState{
  isFalling(): boolean {return true}
  moveHorizontal(tile: Tile, dx: number): void {
      
  }
}

class Resting implements FallingState {
  isFalling(): boolean {return false}
  moveHorizontal(tile: Tile, dx: number): void {
      if (map[playery][playerx + dx].isPushable()
        && map[playery][playerx + dx + dx].isAir()
        && !map[playery + 1][playerx + dx].isAir()) {
      map[playery][playerx + dx + dx] = map[playery][playerx + dx];
      moveToTile(playerx + dx, playery);
      }
    }
}

function gameLoop() {
  let before = Date.now();
  update();
  draw();
  let after = Date.now();
  let frameTime = after - before;
  let sleep = SLEEP - frameTime;
  setTimeout(() => gameLoop(), sleep);
}

window.onload = () => {
  gameLoop();
}

const LEFT_KEY = "ArrowLeft";
const UP_KEY = "ArrowUp";
const RIGHT_KEY = "ArrowRight";
const DOWN_KEY = "ArrowDown";
window.addEventListener("keydown", e => {
  if (e.key === LEFT_KEY || e.key === "a") inputs.push(new Right());
  else if (e.key === UP_KEY || e.key === "w") inputs.push(new Up());
  else if (e.key === RIGHT_KEY || e.key === "d") inputs.push(new Left());
  else if (e.key === DOWN_KEY || e.key === "s") inputs.push(new Down());
});

interface Tile{
  isEdible(): boolean;
  isPushable(): boolean;
  draw(g: CanvasRenderingContext2D, x: number, y: number): void;
  isFlux(): boolean;
  isUnbreakable(): boolean;
  isStone(): boolean;
  isBox(): boolean;
  isKey1(): boolean;
  isKey2(): boolean;
  isFallingStone(): boolean;
  isLock1(): boolean;
  isLock2(): boolean;
  isFallingBox(): boolean;
  isAir(): boolean;
  isPlayer():boolean;
  moveHorizontal(dx: number):void;
  isStony(): boolean;
  isBoxy(): boolean;

  drop(): void;
  rest(): void;
}

interface Input {
  isRight(): boolean;
  isLeft(): boolean;
  isUp(): boolean;
  isDown(): boolean;
  handle(): void;
}

class Right implements Input{
  isRight() {return true};
  isLeft() {return false};
  isUp(){return false};
  isDown(){return false};

  handle(){
      moveHorizontal(-1);
  }

}
class Left implements Input{
  isRight() {return false};
  isLeft() {return true};
  isUp(){return false};
  isDown(){return false};

  handle(){
      moveHorizontal(1);
  }

}
class Up implements Input{
  isRight() {return false};
  isLeft() {return false};
  isUp(){return true};
  isDown(){return false};

  handle(){
      moveVertical(-1);
  }

}
class Down implements Input{
  isRight() {return false};
  isLeft() {return false};
  isUp(){return false};
  isDown(){return true};

  handle(){
      moveVertical(1);
  }

}

class Flux implements Tile{
  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#ccffcc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isEdible(){
    return true;
  };
  isPushable(): boolean {return false;}
  isFallingStone(): boolean {return false}
  isLock1(): boolean {return false}
  isLock2(): boolean {return false}
  isFlux(){return true}
  isBox(): boolean {return false}
  isKey1(): boolean {return false}
  isKey2(): boolean {return false}
  isStone(): boolean {return false}
  isUnbreakable(): boolean {return false}
  isFallingBox(): boolean {return false}
  isAir(): boolean {return false}
  isPlayer(): boolean {return false}

  moveHorizontal(dx: number): void {
    moveToTile(playerx + dx, playery);
  }

  isBoxy(): boolean {
    return false;
  }

  isStony(): boolean {
    return false;
  }

  drop(): void {}
  rest(): void {}
}
class Air implements Tile{
  draw(g: CanvasRenderingContext2D, x: number, y: number){}
  isEdible(){return true;};
  isPushable(): boolean {return false;}
  isFallingStone(): boolean {return false}
  isLock1(): boolean {return false}
  isLock2(): boolean {return false}
  isFlux(){return false}
  isBox(): boolean {return false}
  isKey1(): boolean {return false}
  isKey2(): boolean {return false}
  isStone(): boolean {return false}
  isUnbreakable(): boolean {return false}
  isFallingBox(): boolean {return false}
  isAir(): boolean {return true}
  isPlayer(): boolean {return false}
  moveHorizontal(dx: number): void {
    moveToTile(playerx + dx, playery);
  }

  isBoxy(): boolean {
    return false;
  }

  isStony(): boolean {
    return false;
  }

  drop(): void {}
  rest(): void {}
}


class Lock1 implements Tile{
  isStony(): boolean {
      return false;
  }
  isBoxy(): boolean {
      return false;
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number){
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isEdible(){
    return false;
  };
  isPushable(): boolean {return false;}
  isFallingStone(): boolean {return false}
  isLock1(): boolean {return true}
  isLock2(): boolean {return false}
  isFlux(){return false}
  isBox(): boolean {return false}
  isKey1(): boolean {return false}
  isKey2(): boolean {return false}
  isStone(): boolean {return false}
  isUnbreakable(): boolean {return false}
  isFallingBox(): boolean {return false}
  isAir(): boolean {return false}
  isPlayer(): boolean {return false}

  moveHorizontal(dx: number): void {
    removeLock1();
    moveToTile(playerx + dx, playery);
  }
  drop(): void {}
  rest(): void {}
}
class Lock2 implements Tile{
  draw(g: CanvasRenderingContext2D, x: number, y: number){
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isPushable(): boolean {return false;}
  isEdible(){
    return false;
  };
  isFallingStone(): boolean {return false}
  isLock1(): boolean {return false}
  isLock2(): boolean {return true}
  isFlux(){return false}
  isBox(): boolean {return false}
  isKey1(): boolean {return false}
  isKey2(): boolean {return false}
  isStone(): boolean {return false}
  isUnbreakable(): boolean {return false}
  isFallingBox(): boolean {return false}
  isAir(): boolean {return false}
  isPlayer(): boolean {return false}

  moveHorizontal(dx: number): void {
    removeLock2();
    moveToTile(playerx + dx, playery);
  }

  isBoxy(): boolean {
    return false;
  }

  isStony(): boolean {
    return false;
  }
  drop(): void {}
  rest(): void {}
}


class Key1 implements Tile{
    isStony(): boolean {
        return false;
    }
    isBoxy(): boolean {
       return false;
    }
  draw(g: CanvasRenderingContext2D, x: number, y: number){
    g.fillStyle = "#ffcc00";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

    moveHorizontal(dx: number) {
        if (map[playery][playerx + dx].isKey1()) {
            removeLock1();
            moveToTile(playerx + dx, playery);
        }
    }
  isPushable(): boolean {return false;}
  isEdible(): boolean {return false;}
  isFallingStone(): boolean {return false}
  isLock1(): boolean {return false}
  isLock2(): boolean {return false}
  isFlux(){return false}
  isBox(): boolean {return false}
  isKey1(): boolean {return true}
  isKey2(): boolean {return false}
  isStone(): boolean {return false}
  isUnbreakable(): boolean {return false}
  isFallingBox(): boolean {return false}
  isAir(): boolean {return false}
  isPlayer(): boolean {return false}

  drop(): void {}
  rest(): void {

  }
}
class Key2 implements Tile{
  draw(g: CanvasRenderingContext2D, x: number, y: number){
    g.fillStyle = "#00ccff";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isPushable(): boolean {return false;}
  isEdible(): boolean {return false;}
  isFallingStone(): boolean {return false}
  isLock1(): boolean {return false}
  isLock2(): boolean {return false}
  isFlux(){return false}
  isBox(): boolean {return false}
  isKey1(): boolean {return false}
  isKey2(): boolean {return true}
  isStone(): boolean {return false}
  isUnbreakable(): boolean {return false}
  isFallingBox(): boolean {return false}
  isAir(): boolean {return false}
  isPlayer(): boolean {return false}

  moveHorizontal(dx: number): void {
  }

  isBoxy(): boolean {
    return false;
  }

  isStony(): boolean {
    return false;
  }
  drop(): void {}
  rest(): void {}
}
class Stone implements Tile{
  private falling: FallingState;
  constructor(falling: FallingState) {
    this.falling = falling
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number){
    g.fillStyle = "#0000cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isPushable(): boolean {return true;}
  isEdible(): boolean {return false;}
  isFallingStone(): boolean {return this.falling.isFalling()}
  isLock1(): boolean {return false}
  isLock2(): boolean {return false}
  isFlux(){return false}
  isBox(): boolean {return false}
  isKey1(): boolean {return false}
  isKey2(): boolean {return false}
  isStone(): boolean {return true}
  isUnbreakable(): boolean {return false}
  isFallingBox(): boolean {return false}
  isAir(): boolean {return false}
  isPlayer(): boolean {return false}

  moveHorizontal(dx: number): void {
    this.falling.moveHorizontal(this, dx)
  }

  isBoxy(): boolean {return false;}

  isStony(): boolean {return true;}

  drop(){this.falling = new Falling();}
  rest(){this.falling = new Resting();}
}

class Unbreakable implements Tile{
  isStony(): boolean {
     return false;
  }
  isBoxy(): boolean {
    return false;
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number){
    g.fillStyle = "#999999";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isPushable(): boolean {return false;}
  isEdible(): boolean {return false;}
  isFallingStone(): boolean {return false}
  isLock1(): boolean {return false}
  isLock2(): boolean {return false}
  isFlux(){return false}
  isBox(): boolean {return false}
  isKey1(): boolean {return false}
  isKey2(): boolean {return false}
  isStone(): boolean {return false}
  isUnbreakable(): boolean {return true}
  isFallingBox(): boolean {return false}
  isAir(): boolean {return false}
  isPlayer(): boolean {return false}

  moveHorizontal(dx: number): void {}
  drop(): void {}
  rest(): void {}
}

class Box implements Tile{
  constructor(private falling: FallingState){}

  draw(g: CanvasRenderingContext2D, x: number, y: number){
    g.fillStyle = "#8b4513";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isEdible(): boolean {return false;}
  isPushable(): boolean {return true;}
  isFallingStone(): boolean {return false}
  isLock1(): boolean {return false}
  isLock2(): boolean {return false}
  isFlux(){return false}
  isBox(): boolean {return true}
  isKey1(): boolean {return false}
  isKey2(): boolean {return false}
  isStone(): boolean {return false}
  isUnbreakable(): boolean {return false}
  isFallingBox(): boolean {return false}
  isAir(): boolean {return false}
  isPlayer(): boolean {return false}
  moveHorizontal(dx: number) {
    this.falling.moveHorizontal(this, dx)
  }

  isBoxy(): boolean {return true;}

  isStony(): boolean {return false;}

  drop(){this.falling = new Falling();}
  rest(){this.falling = new Resting();}
}

class Player implements Tile{
  draw(g: CanvasRenderingContext2D){}
  isEdible(): boolean {return false;}
  isPushable(): boolean {return false;}
  isFallingStone(): boolean {return false}
  isLock1(): boolean {return false}
  isLock2(): boolean {return false}
  isFlux(){return false}
  isBox(): boolean {return false}
  isKey1(): boolean {return false}
  isKey2(): boolean {return false}
  isStone(): boolean {return false}
  isUnbreakable(): boolean {return false}
  isFallingBox(): boolean {return false}
  isAir(): boolean {return false}
  isPlayer(): boolean {return true}

  moveHorizontal(dx: number): void {
  }

  isBoxy(): boolean {
    return false;
  }

  isStony(): boolean {
    return false;
  }

  drop(): void{}
  rest(): void{}
}

let playerx = 1;
let playery = 1;

let rawMap: RawTile[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 3, 0, 1, 1, 2, 0, 2],
  [2, 4, 2, 6, 1, 2, 0, 2],
  [2, 8, 4, 1, 1, 2, 0, 2],
  [2, 4, 1, 1, 1, 9, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];

let inputs: Input[] = [];

let map: Tile[][];
function assertExhausted(x: never): never {
  throw new Error("Unexpected object" + x);
}

function transformTile(tile: RawTile){
  switch (tile){
    case RawTile.AIR: return new Air();
    case RawTile.BOX: return new Box(new Resting());
    case RawTile.FALLING_BOX: return new Box(new Falling());
    case RawTile.UNBREAKABLE: return new Unbreakable();
    case RawTile.FLUX: return new Flux();
    case RawTile.FALLING_STONE: return new Stone(new Falling());
    case RawTile.KEY1: return new Key1();
    case RawTile.KEY2: return new Key2();
    case RawTile.PLAYER: return new Player();
    case RawTile.LOCK1: return new Lock1();
    case RawTile.LOCK2: return new Lock2();
    case RawTile.STONE: return new Stone(new Resting());
    default: assertExhausted(tile);
  }
}

function transformMap(){
  map = new Array(rawMap.length);
  for(let y = 0; y < rawMap.length; y++){
    map[y] = new Array (rawMap[y].length);
    for(let x = 0; x < rawMap[y].length; x++){
      map[y][x] = transformTile(rawMap[y][x]);
    }
  }
}

window.onload = () => {
  transformMap();
  gameLoop();
}

function removeLock1() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].isLock1()) {
        map[y][x] = new Air();
      }
    }
  }
}

function removeLock2() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].isLock2()) {
        map[y][x] = new Air();
      }
    }
  }
}

function moveToTile(newx: number, newy: number) {
  map[playery][playerx] = new Air();
  map[newy][newx] = new Player();
  playerx = newx;
  playery = newy;
}

function moveHorizontal(dx: number) {
  map[playery][playerx + dx].moveHorizontal(dx);
}

function moveVertical(dy: number) {
  if (map[playery + dy][playerx].isFlux()
    || map[playery + dy][playerx].isAir()) {
    moveToTile(playerx, playery + dy);
  } else if (map[playery + dy][playerx].isKey1()) {
    removeLock1();
    moveToTile(playerx, playery + dy);
  } else if (map[playery + dy][playerx].isKey2()) {
    removeLock2();
    moveToTile(playerx, playery + dy);
  }
}

function update() {
  handleInputs();
  updateMaps();
}

function handleInputs(){
  while (inputs.length > 0) {
    let input = inputs.pop();
    input.handle();
  }
}

function updateMaps(){
  for (let y = map.length - 1; y >= 0; y--) {
    for (let x = 0; x < map[y].length; x++) {
      updateTile(x,y);
    }
  }
}
function updateTile(x: number,y: number){
  if ((map[y][x].isStony())
      && map[y + 1][x].isAir()
    || 
    (map[y][x].isBoxy())
    && map[y + 1][x].isAir()){
    map[y][x].drop();
    map[y + 1][x] = map[y][x]
    map[y][x] = new Air;
  }  else if (map[y][x].isFallingStone() || map[y][x].isFallingBox()) {
    map[y][x].rest();
  }
}

function drawPlayer(g: CanvasRenderingContext2D){
  g.fillStyle = "#ff0000";
  g.fillRect(playerx * TILE_SIZE, playery * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}
function draw() {
  let g = createGraphics();
  drawMap(g);
  drawPlayer(g);
}

function createGraphics(){
  let canvas = document.getElementById("GameCanvas") as HTMLCanvasElement;
  let g = canvas.getContext("2d");
  g.clearRect(0, 0, canvas.width, canvas.height);
  return g;
}

function drawMap(g: CanvasRenderingContext2D) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x].draw(g, x, y);
    }
  }

}