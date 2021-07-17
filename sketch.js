var trex, trex_running, trex_choque;
var piso, invisiblepiso, pisoImage;
var nube;
var o1, o2, o3, o4, o5, o6;
var puntaje_trex,
  puntaje_final = 0;
var estado = "inicio";
var GameOver, GO;
var restart, reinicio;
var TrexColl, T_thorn;
var Creditos, Creditos_Hector;
var puntaje_final = 0;
var jump;
var die;
function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  T_thorn = loadImage("trex_collided.png");
  GameOver = loadImage("GameOver.png");
  restart = loadImage("restart.png");
  pisoImage = loadImage("ground2.png");
  nube = loadImage("cloud.png");
  Creditos_Hector = loadImage("Creditos.JPG");

  o1 = loadImage("obstacle1.png");

  o2 = loadImage("obstacle2.png");

  o3 = loadImage("obstacle3.png");

  o4 = loadImage("obstacle4.png");

  o5 = loadImage("obstacle5.png");

  o6 = loadImage("obstacle6.png");

  jump = loadSound("jump.mp3");

  die = loadSound("die.mp3");
}

function setup() {
  createCanvas(600, 200);
  puntaje_trex = 0;

  //crea un suelo invisible
  invisiblepiso = createSprite(200, 190, 400, 10);
  invisiblepiso.visible = false;

  //crea el sprite del suelo
  piso = createSprite(200, 180, 400, 20);
  piso.addImage("piso", pisoImage);
  piso.velocityX = -4;
  piso.x = piso.width / 2;

  //crea el sprite del Trex
  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("running", trex_running);

  trex.scale = 0.5;
  trex.setCollider("rectangle", 0, 0, 50, -50);
  trex.debug = true;

  //se crean los sprites para finalizar el juego
  TrexColl = createSprite(50, 170);
  TrexColl.addImage("choque", T_thorn);
  TrexColl.scale = 0.6;
  TrexColl.visible = false;

  GO = createSprite(300, 100);
  GO.addImage("F", GameOver);
  GO.scale = 0.2;
  GO.visible = false;

  reinicio = createSprite(300, 160);
  reinicio.addImage("F", restart);
  reinicio.scale = 0.4;
  reinicio.visible = false;

  Creditos = createSprite(500, 50);
  Creditos.addImage("logo", Creditos_Hector);
  //crea GRUPOS de nubes y GRUPOS de obstaculos
  grupoNubes = new Group();
  grupoObstaculos = new Group();
}

function draw() {
  //establece el color del fondo
  background("white");

  if (estado == "inicio") {
    //llamada a funciones exrternas
    cielo();
    obstaculos();
    puntaje();

    //salta cuando se presiona la barra espaciadora y está en el piso
    if (trex.collide(invisiblepiso)) {
      if (keyDown("space") && trex.y >= 158) {
        trex.velocityY = -15;

        jump.play();
      }
    }
    //agrega gravedad
    trex.velocityY = trex.velocityY + 0.8;

    //piso infinito
    if (piso.x < 0) {
      piso.x = piso.width / 2;
    }

    if (grupoObstaculos.isTouching(trex)) {
      estado = "final";

      die.play();
    }
  } //cierra el estado inicio
  if (estado == "final") {
    puntaje_final = puntaje_trex;

    text("Puntuación: " + puntaje_final, 25, 15);

    TrexColl.x = trex.x;
    TrexColl.y = trex.y;
    piso.velocityX = 0;
    grupoObstaculos.setVelocityXEach(0);
    grupoNubes.setVelocityXEach(0);
    trex.velocityY = 0;
    trex.visible = false;

    reinicio.visible = true;

    GO.visible = true;

    grupoNubes.setLifetimeEach(-1);
    grupoObstaculos.setLifetimeEach(-1);
    puntaje_final = 0;

    TrexColl.visible = true;
    trex.visible = false;

    if (mousePressedOver(reinicio)) {
      reset();
    }
  }

  //evita que el Trex caiga
  trex.collide(invisiblepiso);

  drawSprites();
  console.log(piso.velocityX);
}

function cielo() {
  // Cada ciertos cuadros (frames) se crea una nube y se destruye
  if (frameCount % 60 === 0) {
    var nubes = createSprite(600, random(10, 100));
    nubes.addImage("volando", nube);
    nubes.scale = 0.2;
    nubes.velocityX = -5;
    nubes.lifetime = 150;
    grupoNubes.add(nubes); // ver39
  }
}

function obstaculos() {
  var tipo_obstaculo, obstaculo;
  tipo_obstaculo = Math.round(random(1, 4));
  if (frameCount % 40 == 0) {
    obstaculo = createSprite(600, 160);
    obstaculo.scale = 0.1;
    obstaculo.velocityX = -(4 + puntaje_trex / 100);
    piso.velocityX = obstaculo.velocityX;
    obstaculo.depth = trex.depth;

    switch (tipo_obstaculo) {
      case 1:
        obstaculo.addImage(o1);
        break;

      case 2:
        obstaculo.addImage(o2);
        break;

      case 3:
        obstaculo.addImage(o3);
        break;

      case 4:
        obstaculo.addImage(o4);
        obstaculo.scale = 0.08;

        break;
    }
    obstaculo.lifetime = 150;
    grupoObstaculos.add(obstaculo);
  }
}

function puntaje() {
  // puntaje_trex =  Math.round(frameCount);
  puntaje_trex = puntaje_trex + Math.round(getFrameRate() / 60);
  text("Puntuación: " + puntaje_trex, 25, 15);
}

function reset() {
  estado = "inicio";
  puntaje_trex = 0;
  GO.visible = false;
  reinicio.visible = false;
  trex.visible = true;
  TrexColl.visible = false;

  piso.velocityX = -4;

  grupoObstaculos.destroyEach();
  grupoNubes.destroyEach();
}
