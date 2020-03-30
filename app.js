// AZUL: #b3f0ff
// VERMELHO: #ff704d
// CINZA:  #d9d9d9

colorSystem = {green:"#b4f7b0",red:"#ff704d", grey:"#d9d9d9", black:"#590000"}

function setup() {
  createCanvas(720, 400);

  arraySystem = [];

  particleSystem = new particleSystem(500);
  //colorSystem = {green:"#b3f0ff",red:"#ff704d", grey:"#d9d9d9"}
}

function draw() {
  background(51);
  particleSystem.run();
}


class Particle{
    constructor(id,diameter){
        this.id = id;
        this.acceleration = createVector(0, 0);
        this.velocity = createVector(random(-0.5,0.5), random(-0.5, 0.5));
        this.position = createVector(random(0,width), random(0, height));
        this.diameter = diameter
        this.color = colorSystem.grey;
        this.infected = false;
        this.immune = false;
        this.alive = true;

        this.myPromisse = () => new Promise((resolve,reject)=>{
          setTimeout(()=> this.chose(),20000)
        })

    }
    run(){
        this.update();
        this.display();
        this.checkColision();
    };
      
      // Method to update position
    update(){
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);
    };

    chose(){
      if(Math.random() > 0.10){
        this.isImmune();
      }
      else{
        this.isDead();
      }
    }
    
    isInfected(){
      this.color = colorSystem.red;
      this.infected = true;

      this.myPromisse().then(response =>{
        //console.log(response);
      })
    }

    isImmune(){
      this.color = colorSystem.green;
      this.infected = false;
      this.immune = true
    }
      
    isDead(){
      this.color = colorSystem.black;
      this.alive = false
      this.velocity.x = 0;
      this.velocity.y = 0;
    }

    display(){
        //stroke(255, 255);
        strokeWeight(0);
        fill(this.color);
        ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
    };

    checkColision(){
      if(this.position.x <= 0 + this.diameter/2 || this.position.x >= width - this.diameter/2){
        this.velocity.x *= -1;
      }
      if(this.position.y <= 0 + this.diameter/2 || this.position.y >= height  - this.diameter/2){
        this.velocity.y *= -1;
      }

      for(let i = this.id+1; i < arraySystem.length; i++){
        let dx = arraySystem[i].position.x - this.position.x;
        let dy = arraySystem[i].position.y - this.position.y;
        let distance = sqrt(dx * dx + dy * dy);
        let minDist = arraySystem[i].diameter / 2 + this.diameter / 2;

        if (distance <= minDist) {
          let angle = atan2(dy, dx);
          let targetX = this.position.x + cos(angle) * minDist;
          let targetY = this.position.y + sin(angle) * minDist;
          let ax = (targetX - arraySystem[i].position.x) * 0.05;
          let ay = (targetY - arraySystem[i].position.y) * 0.05;
          this.velocity.x -= ax;
          this.velocity.y -= ay;
          arraySystem[i].velocity.x += ax;
          arraySystem[i].velocity.y += ay;

          if(arraySystem[i].infected === true && this.infected === false && this.immune === false){
            this.isInfected();
            
          }
          if(this.infected === true && arraySystem[i].infected === false && arraySystem[i].immune === false){
            arraySystem[i].isInfected()
          }

          if(this.alive === false){
            this.velocity.x = 0;
            this.velocity.y = 0;
          }
          if(arraySystem[i].alive === false){
            arraySystem[i].velocity.x = 0;
            arraySystem[i].velocity.y = 0;
          }
        }
      }
    }
}

class particleSystem{
    constructor(n){

      for(let i = 1; i < n+1; i++){
        arraySystem.push(new Particle(i,5))
      }
    }

    run(){
      for(let particle of arraySystem){
        particle.run()
      }
    }
}
