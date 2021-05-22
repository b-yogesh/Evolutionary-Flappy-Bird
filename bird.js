class Bird {
  constructor(brain) {
    this.r = 25;
    this.x = this.r+25;
    this.y = height - this.r;
    this.velocity = 0;
    this.gravity = 1;

    this.score = 0;
    this.fitness = 0;
    if (brain) {
      this.brain = brain.copy();

    } else {
      this.brain = new NeuralNetwork(5, 4, 2);
    }
  }

  jump() {
    // if(this.y == height - this.r)
    this.velocity += -14;
  }

  think(obstacles) {

    let closest = null;
    let record = Infinity;
    for (let i = 0; i < obstacles.length; i++) {
      let diff = obstacles[i].x + obstacles[i].w - this.x;
      if (diff > 0 && diff < record) {
        record = diff;
        closest = obstacles[i];
      }
    }
    if (closest != null) {
      let inputs = [];
      // x position of closest pipe
      inputs[0] = map(closest.x, this.x, width, 0, 1);
      // top of closest pipe opening
      inputs[1] = map(closest.top, 0, height, 0, 1);
      // bottom of closest pipe opening
      inputs[2] = map(closest.bottom, 0, height, 0, 1);
      // bird's y position
      inputs[3] = map(this.y, 0, height, 0, 1);
      // bird's y velocity
      inputs[4] = map(this.velocity, -6, 6, 0, 1);

      let output = this.brain.predict(inputs);
      if (output[0] > output[1] ) {
        this.jump();
      }
    }
  }


  mutate() {
    this.brain.mutate(0.1);
  }
  
  offScreen(){
    return (this.y > height || this.y < 0)
}
  move() {
    this.score++;
    this.y += this.velocity;
    this.velocity += this.gravity;
    // this.y = constrain(this.y, 0, height - this.r);
  }

  show() {
    fill(100, 50);
    circle(this.x, this.y, this.r);
  }


}