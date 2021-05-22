class Obstacle {
  constructor() {

    let spacing = random(100, 140);
    let centery = random(spacing, height - spacing);

    this.top = centery - spacing / 2;
    this.bottom = height - (centery + spacing / 2);
    this.x = width;
    this.w = 60;
    this.speed = 3;
    this.y = height - this.bottom;
  }

  hits(bird) {  
    return collideRectCircle (this.x, 0, this.w, this.top, bird.x, bird.y, bird.r, bird.r) || collideRectCircle (this.x, height - this.bottom, this.w, this.bottom, bird.x, bird.y, bird.r, bird.r);
  }

  show() {
    stroke(255);
    fill(76,86,95);
    rect(this.x, 0, this.w, this.top); 
    rect(this.x, height - this.bottom, this.w, this.bottom);
  }

  move() {
    this.x -= this.speed;
  }
  
  offscreen() {
    if (this.x < -this.w) {
      return true;
    } else {
      return false;
    }
  }
}   