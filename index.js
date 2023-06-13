import * as THREE from "three";
// This addon here helps me to add controls of he canvas to html
import { OrbitControls } from "three-addons";
// This Here Will Create the Scene
const scene = new THREE.Scene();
// This Here Will Create a Camera object For us ;
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(4.61, 2.74, 8);
// This here will create a renderer for us;
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
});
// This will tell renderer to render shadows too
renderer.shadowMap.enabled = true;
// This is the size we want canvas to get renederd
renderer.setSize(window.innerWidth, window.innerHeight, false);
// We add it to our html
document.body.appendChild(renderer.domElement);

// This will let us have controls on our object
// This is how we use orbi control addon
const controls = new OrbitControls(camera, renderer.domElement);

// The main thing is this daaaaaaaaamn class
// I need to undrestand this so bad

// Here we say create a class named Box and extend eveerything in THREE.Mesh in it too
// This Class Will build a Mesh using The inputs
class Box extends THREE.Mesh {
  // Constructor is the basic of every class
  // The arguments are passed like Box(Width , Height , Depth , ....)
  constructor({
    // Width Of Element
    width,
    // Height Of Element
    height,
    // Depth of element
    depth,
    // Color Of element
    color,
    // The Speed Of Element
    velocity = {
      x: 0,
      y: 0,
      z: 0,
    },
    // The Position of Element
    position = {
      x: 0,
      y: 0,
      z: 0,
    },
    zAcceleration = false,
  }) {
    // Here We Create Boxes And Stuff Using What user puts in
    //In other words this.somthing is like creating a variable
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({ color: color });
    // IDK Exactly What this do but its cool
    super(geometry, material);
    // We set Properties to use out side of our class
    this.height = height;
    this.width = width;
    this.depth = depth;
    // Position is set using the set method in THREE.Mesh
    this.position.set(position.x, position.y, position.z);
    this.right = this.position.x + this.width / 2;
    this.left = this.position.x - this.width / 2;
    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;
    this.front = this.position.z + this.depth / 2;
    this.back = this.position.z - this.depth / 2;
    this.velocity = velocity;
    this.gravity = -0.005;
    this.zAcceleration = zAcceleration;
    // bunch of random Properties to set Gravity
  }
  // We Use This Update method to Run The Class EachTime The Page Refreshes (FPS)
  updateSides() {
    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;
    this.right = this.position.x + this.width / 2;
    this.left = this.position.x - this.width / 2;
    this.front = this.position.z + this.depth / 2;
    this.back = this.position.z - this.depth / 2;
  }
  update(ground) {
    this.updateSides();
    if (this.zAcceleration) {
      this.position.z += 0.05;
    }
    this.position.x += this.velocity.x;
    this.position.z += this.velocity.z;

    // Detect for collision x axis

    this.applyGravity(ground);
  }
  // Just To Underestand What does this lines of code do
  // OtherWise we Can use them in Update Tooo
  applyGravity(ground) {
    this.velocity.y += this.gravity;
    // This is where we hit the ground
    if (
      boxCollision({
        box1: this,
        box2: ground,
      })
    ) {
      const friction = 0.5;
      this.velocity.y *= friction;
      this.velocity.y = -this.velocity.y;
    } else this.position.y += this.velocity.y;
  }
}
// Test the collisions
function boxCollision({ box1, box2 }) {
  const xCollision = box1.right >= box2.left && box1.left <= box2.right;
  const zCollision = box1.front >= box2.back && box1.back <= box2.front;
  const yCollision =
    box1.bottom + box1.velocity.y <= box2.top && box1.top >= box2.bottom;

  return xCollision && zCollision && yCollision;
}
// Here We Created Cube
const cube = new Box({
  width: 1,
  height: 1,
  depth: 1,
  color: "#00ff00",
  velocity: {
    x: 0,
    y: -0.01,
    z: 0,
  },
  position: {
    x: 0,
    y: 0,
    z: 2,
  },
});
// This will set to the cube that it can cast shadows too
cube.castShadow = true;
// We Add The Cube To Our Scene
scene.add(cube);

// This is just how we can create stuff without using Classes
// const ground = new THREE.Mesh(
//   new THREE.BoxGeometry(5, 0.5, 10),
//   new THREE.MeshStandardMaterial({ color: 0x0000ff })
// );

// We Created A Ground For Our Cube
const ground = new Box({
  width: 8,
  height: 0.5,
  depth: 40,
  color: "#0369a1",
  position: {
    x: 0,
    y: -2,
    z: 0,
  },
});
// We Tell Ground That it can recevie shadows from cube or anything else
ground.receiveShadow = true;
scene.add(ground);

// We Add Light Or Otherwise the cube and ground wont be displayed beacuse of MeshStandardMaterial
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.z = 1;
light.position.y = 5;
light.castShadow = true;
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
// scene.add(amLight);

// This is For Movement Code
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};
window.addEventListener("keydown", function (event) {
  switch (event.code) {
    case "KeyA":
      keys.a.pressed = true;
      break;
    case "KeyD":
      keys.d.pressed = true;
      break;
    case "KeyW":
      keys.w.pressed = true;
      break;
    case "KeyS":
      keys.s.pressed = true;
      break;
    case "Space":
      cube.velocity.y = 0.15;
      break;
  }
});
window.addEventListener("keyup", function (event) {
  switch (event.code) {
    case "KeyA":
      keys.a.pressed = false;
      break;
    case "KeyD":
      keys.d.pressed = false;
      break;
    case "KeyW":
      keys.w.pressed = false;
      break;
    case "KeyS":
      keys.s.pressed = false;
      break;
  }
});

const enemies = [];

let frames = 0;
let spawnRate = 200;

function animate() {
  // These 2 hear should be so the page get refreshed and somthing get displayed to our page
  const animationId = requestAnimationFrame(animate);
  renderer.render(scene, camera);

  //Cube Movment
  cube.velocity.x = 0;
  cube.velocity.z = 0;
  if (keys.a.pressed) {
    cube.velocity.x = -0.05;
  } else if (keys.d.pressed) {
    cube.velocity.x = 0.05;
  }
  if (keys.w.pressed) {
    cube.velocity.z = -0.05;
  } else if (keys.s.pressed) {
    cube.velocity.z = 0.05;
  }
  cube.update(ground);
  enemies.forEach((enemy) => {
    enemy.update(ground);
    if (
      boxCollision({
        box1: cube,
        box2: enemy,
      })
    ) {
      window.cancelAnimationFrame(animationId);
    }
  });
  if (frames % spawnRate === 0) {
    if (spawnRate > 20) {
      spawnRate -= 20;
    }
    const enemy = new Box({
      width: 1,
      height: 1,
      depth: 1,
      position: {
        x: (Math.random() - 0.5) * 8,
        y: 0,
        z: -15,
      },
      velocity: {
        x: 0,
        y: 0,
        z: 0.02,
      },
      color: "red",
      zAcceleration: true,
    });
    enemy.castShadow = true;
    // We Add The Cube To Our Scene
    scene.add(enemy);
    enemies.push(enemy);
  }
  frames++;
}

animate();
