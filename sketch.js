/*
PLAYER 1 CONTROLS
MOVEMENT: WASD
ATTACK: E
PROJECTILE: Q

PLAYER 2 CONTROLS
MOVEMENT: Up, Down, Left, Right
ATTACK: SHIFT
PROJECTILE: /

INSTRUCTIONS: FIGHT!!!

*/

let player1;
let player2;
let projectileImage;
let backgroundImg;
let gumIdle, gumMelee, gumRun, gumJump, gumShoot;
let bullets1;
let bullets2;
let gojoIdle, gojoRun, gojoJump, gojoMelee, gojoProjectile;
let isGrounded = true;
let isGrounded2 = true;
let health1 = 100; // Player 1's starting health
let health2 = 100; // Player 2's starting health
let healthBarWidth = 90; // Maximum health bar width

let lastShotTime1 = 0; // Time when the last bullet was fired
let shotCooldown1 = 500; // Cooldown

let lastShotTime2 = 0;
let shotCooldown2 = 500;

function preload() {
  gojoIdle = loadAnimation("assets/IGojo.png", {
    width: 26,
    height: 75,
    frames: 1,
  });
  gojoRun = loadAnimation("assets/DGojo.png", {
    width: 64,
    height: 69,
    frames: 1,
  });
  gojoMelee = loadAnimation("assets/goPunch.png", {
    width: 35,
    height: 66,
    frames: 9,
  });
  gojoJump = loadAnimation("assets/JGojo.png", {
    width: 28,
    height: 71,
    frames: 1,
  });
  gojoProjectile = loadAnimation("assets/LGojo.png", {
    width: 42,
    height: 63,
    frames: 1,
  });
  gumMelee = loadAnimation("assets/Agum.png", {
    width: 42,
    height: 63,
    frames: 10,
  });
  gumIdle = loadAnimation("assets/Igum.png", {
    width: 40,
    height: 63,
    frames: 60,
  });
  gumRun = loadAnimation("assets/Rgum.png", {
    width: 40,
    height: 60,
    frames: 1,
  });
  gumJump = loadAnimation("assets/Jgum.png", {
    width: 40,
    height: 60,
    frames: 1,
  });
  gumShoot = loadAnimation("assets/Lgum.png", {
    width: 29,
    height: 60,
    frames: 10,
  });

  bulletImage = loadImage("assets/GGojo.png");
  ballImage = loadImage("assets/BGum.png");
  backgroundImg = loadImage("assets/gumBack.png");
}

function updateBullets() {
  // Check collisions for player 1's bullets (bullets1)
  bullets1.forEach((bullet) => {
    if (bullet.collides(player2)) {
      health2 -= 10; // Decrease health of player 2
      bullet.remove(); // Remove the bullet after collision
    }
  });

  // Check collisions for player 2's bullets (bullets2)
  bullets2.forEach((bullet) => {
    if (bullet.collides(player1)) {
      health1 -= 10; // Decrease health of player 1
      bullet.remove(); // Remove the bullet after collision
    }
  });
}

function setup() {
  new Canvas(500, 400);
  player1 = new Sprite(100, 200, 32, 50);
  player2 = new Sprite(375, 200, 32, 50);
  bullets1 = new Group();
  bullets2 = new Group();
  gojoRun.frameDelay = 6;
  player1.rotationLock = true;
  player1.addAni("idle", gojoIdle);
  player1.addAni("run", gojoRun);
  player1.addAni("jump", gojoJump);
  player1.addAni("attack", gojoMelee);
  player1.addAni("projectile", gojoProjectile);

  player2.rotationLock = true;
  player2.addAni("idle2", gumIdle);
  player2.addAni("attack2", gumMelee);
  player2.addAni("run2", gumRun);
  player2.addAni("jump2", gumJump);
  player2.addAni("shoot", gumShoot);
  gumRun.frameDelay = 6;

  // Create platform sprites
  platforms = new Group();
  platforms.color = "brown";
  let platform1 = new platforms.Sprite(width / 2, 275, 500, 25, "static");
  world.gravity.y = 8;
}

function draw() {
  clear();
  image(backgroundImg, 0, 0, width, height);
  camera.on();

  // Set text color to white and size to 32 for larger text
  fill(255); // White color
  textSize(19); // Larger font size
  text("Player 1 Health", 20, 60);
  text("Player 2 Health", 360, 60);

  updateBullets();

  // Draw Player 1's Health Bar
  fill(255, 0, 0); // Red for Player 1
  rect(20, 20, (health1 / 100) * healthBarWidth, 20); // Health bar width proportional to health

  // Draw Player 2's Health Bar
  fill(0, 0, 255); // Blue for Player 2
  rect(375, 20, (health2 / 100) * healthBarWidth, 20); // Health bar width proportional to health

  // Player 1 controls
  if (kb.pressing("a")) {
    player1.vel.x = -4;
    player1.mirror.x = true;
    if (isGrounded) {
      player1.changeAni("run");
    }
    player1.ani.play();
  } else if (kb.pressing("d")) {
    player1.vel.x = 4;
    player1.mirror.x = false;
    if (isGrounded) {
      player1.changeAni("run");
    }
    player1.ani.play();
  } else {
    if (isGrounded) {
      player1.changeAni("idle");
    }
    player1.vel.x = 0;
    player1.ani.play();
  }

  if (kb.pressing("w") && isGrounded) {
    player1.vel.y = -5;
    player1.changeAni("jump");
    isGrounded = false;
  }

  if (kb.pressing("Q")) {
    player1.changeAni("projectile");
  }

  if (kb.pressing("E") && player1.vel.y != 4) {
    player1.changeAni("attack");
    if (player1.collides(player2)) {
      health2 -= 10; // Player 1 hits Player 2
    }
  }

  let currentTime1 = Date.now(); // Get the current time (in milliseconds)
  if (
    kb.pressing("Q") &&
    player1.vel.y != 4 &&
    currentTime1 - lastShotTime1 > shotCooldown1
  ) {
    let bullet1 = new bullets1.Sprite(player1.x, player1.y, 5);
    bullet1.image = bulletImage;
    if (player1.mirror.x) {
      bullet1.direction = 180;
      bullet1.x = bullet1.x - 20;
    } else {
      bullet1.direction = 0;
      bullet1.x = bullet1.x + 20;
    }
    bullet1.speed = 25;
    bullet1.life = 14;
    lastShotTime1 = currentTime1;
  }

  // Player 2 controls
  if (kb.pressing("arrowUp") && isGrounded2) {
    player2.vel.y = -4;
    player2.changeAni("jump2");
    isGrounded2 = false;
  } else if (kb.pressing("arrowLeft")) {
    player2.vel.x = -4;
    player2.mirror.x = true;
    player2.changeAni("run2");
  } else if (kb.pressing("arrowRight")) {
    player2.vel.x = 4;
    player2.mirror.x = false;
    player2.changeAni("run2");
  } else if (kb.pressing("shift")) {
    player2.changeAni("attack2");
    if (player2.collides(player1)) {
      health1 -= 10; // Player 2 hits Player 1
    }
  } else if (kb.pressing("/")) {
    player2.changeAni("shoot");
  } else if (isGrounded2) {
    player2.vel.x = 0;
    player2.changeAni("idle2");
  }

  // Bullet collision checks
  if (bullets1.length > 0) {
    for (let i = 0; i < bullets1.length; i++) {
      let bullet = bullets1[i];

      if (bullet.collides(player2)) {
        health2 -= 10; // Decrease health of player 2
        bullet.remove(); // Remove bullet after collision
      }
    }
  }

  let currentTime2 = Date.now();
  if (
    kb.pressing("/") &&
    player2.vel.y != 4 &&
    currentTime2 - lastShotTime2 > shotCooldown2
  ) {
    let bullet2 = new bullets2.Sprite(player2.x, player2.y, 5);
    bullet2.image = ballImage;
    if (player2.mirror.x) {
      bullet2.direction = 180;
      bullet2.x = bullet2.x - 20;
    } else {
      bullet2.direction = 0;
      bullet2.x = bullet2.x + 20;
    }
    bullet2.speed = 25;
    bullet2.life = 14;
    lastShotTime2 = currentTime2;

    if (bullets2.length > 0) {
      for (let i = 0; i < bullets2.length; i++) {
        let bullet = bullets2[i];
        if (bullet.collides(player1)) {
          health1 -= 10; // Decrease health of player 1
          bullet.remove(); // Remove bullet after collision
        }
      }
    }
  }

  if (player1.collides(platforms)) {
    isGrounded = true;
  }
  if (player2.collides(platforms)) {
    isGrounded2 = true;
  }

  if (health1 <= 0 || health2 <= 0) {
    noLoop(); // Stop the game loop

    // Set text color to white and size to 32 for larger text
    fill(255); // White color
    textSize(50); // Larger font size

    // Display the winner message
    if (health1 <= 0) {
      text("Player 2 Wins!", width / 2 - 100, height / 2); // Adjusted x position for better centering
    } else if (health2 <= 0) {
      text("Player 1 Wins!", width / 2 - 100, height / 2); // Adjusted x position for better centering
    }
  }
  if (player1.x > 500) {
    player1.x = 10;
  }
  if (player1.x < 0) {
    player1.x = 500;
  }

  if (player2.x > 500) {
    player2.x = 10;
  }
  if (player2.x < 0) {
    player2.x = 500;
  }
}