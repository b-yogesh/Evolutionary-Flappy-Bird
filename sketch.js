const TOTAL = 500;

let birds = [];
let savedBirds = [];
let bImg;

let obstacles = [];

let counter = 0;

let cycles = 50;
let slider;

let gen = 0;

let bestBird;
let highScore = 0;

let toBeSaved = false;
let isSaved = false;
let runBest = false;


function preload() {
  bImg = loadImage('background.png');
  // birdBrain = loadJSON("bestBird,json");
}

function setup() {
  createCanvas(800, 450);
  slider = createSlider(1, 30, 1);
  for (let i = 0; i < TOTAL; i++) {
    birds[i] = new Bird();
  }

  SaveButton = select('#save');
  SaveButton.mousePressed(saveBestBird);
  LoadButton = select('#load');
  LoadButton.mousePressed(loadBestBird);
}


function saveBestBird() {
  print('Saving bestbird weights');
  let json = bestBird.brain.serialize();
  save(json, 'bestBird2.json');
  console.log('saved');
}

function getdata(json) {
  console.log('entered here')
  let birdBrain = NeuralNetwork.deserialize(json);
    console.log('entered here2')

  bestBird.brain = birdBrain;

  runBest = true;
  reset();
}

function loadBestBird() {
  loadJSON('bestBirdfinal.json', getdata);
}


function reset() {
  print('new generation', gen);
  gen++;
  nextGeneration();
  obstacles = [];
  counter = 0;
  toBeSaved = false;
  isSaved = false;
}


function draw() {

  for (let n = 0; n < slider.value(); n++) {


    if (counter % 90 == 0) {
      obstacles.push(new Obstacle());
    }
    counter++;



    for (let i = obstacles.length - 1; i >= 0; i--) {
      obstacles[i].move();

      for (let j = birds.length - 1; j >= 0; j--) {

        if (obstacles[i].hits(birds[j])) {
          savedBirds.push(birds.splice(j, 1)[0]);
        }

      }


      if (obstacles[i].offscreen()) {

        obstacles.splice(i, 1);
      }

    }

    if (runBest) {
      bestBird.think(obstacles);
      bestBird.move();
      for (let j = 0; j < obstacles.length; j++) {
        // Start over, bird hit pipe
        if (obstacles[j].hits(bestBird)) {
          reset();
          break;
        }
      }

      if (bestBird.offScreen()) {
        reset();
      }
    } else {


      for (let i = birds.length - 1; i >= 0; i--) {

        if (birds[i].offScreen()) {
          savedBirds.push(birds.splice(i, 1)[0]);
        }

      }


      for (let bird of birds) {
        bird.think(obstacles);
        bird.move();
      }
    }

    let tempHighScore = 0;
    if (!runBest) {
      let tempBestBird = null;
      for (let i = 0; i < birds.length; i++) {
        let s = birds[i].score;
        if (s > tempHighScore) {
          tempHighScore = s;
          tempBestBird = birds[i];
        }
      }

      if (tempHighScore > highScore) {
        highScore = tempHighScore;
        bestBird = tempBestBird;
      }
    } else {
      tempHighScore = bestBird.score;
      if (tempHighScore > highScore) {
        highScore = tempHighScore;
      }
      console.log('high score', highScore);
    }

    if(!runBest){
    if (birds.length == 0) {
      reset();
    }

    if (birds.length == 1 && !isSaved) toBeSaved = true;

    if (toBeSaved) {
      isSaved = true;
      toBeSaved = false;
    }
      }
  }

  background(bImg);


  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].show();
  }

  if (runBest) {
    bestBird.show();
  } else {

    for (let bird of birds) {
      bird.show();
    }
  }


}