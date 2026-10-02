import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.module.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x250d44);
scene.fog = new THREE.Fog(0x250d44, 18, 60);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 8, 12);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.HemisphereLight(0xffd6f5, 0x190a2a, 1.4);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xfff0a8, 1.4);
keyLight.position.set(5, 12, 8);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(1024, 1024);
scene.add(keyLight);

const rimLight = new THREE.PointLight(0x64d9ff, 18, 50, 2);
rimLight.position.set(-10, 8, -8);
scene.add(rimLight);

const ground = new THREE.Mesh(
  new THREE.CylinderGeometry(18, 22, 2.5, 48),
  new THREE.MeshStandardMaterial({ color: 0x5ef6bf, emissive: 0x174e41, roughness: 0.85, metalness: 0.05 })
);
ground.position.y = -1.2;
ground.receiveShadow = true;
scene.add(ground);

const worldRadius = 14;
const candyPalette = [0xff7ad9, 0xffcf5a, 0x7af0ff, 0xb7ff8d, 0xff8c6d, 0xa88cff];

function addCandyHill(x, z, radius, color) {
  const hill = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 18, 18),
    new THREE.MeshStandardMaterial({ color, emissive: color, roughness: 0.8, metalness: 0.08 })
  );
  hill.position.set(x, -0.2, z);
  hill.scale.set(1.1, 0.7, 1.0);
  hill.castShadow = true;
  hill.receiveShadow = true;
  scene.add(hill);
}

for (let i = 0; i < 22; i++) {
  const angle = (i / 22) * Math.PI * 2;
  const radius = 7 + (i % 5) * 1.6;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  addCandyHill(x, z, 1.4 + (i % 3) * 0.5, candyPalette[i % candyPalette.length]);
}

function addCandyTree(x, z, color) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.35, 2.2, 10),
    new THREE.MeshStandardMaterial({ color: 0x7f4f2b, roughness: 0.8 })
  );
  trunk.position.set(x, 1.1, z);
  trunk.castShadow = true;
  scene.add(trunk);

  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(1.1, 16, 16),
    new THREE.MeshStandardMaterial({ color, emissive: color, roughness: 0.7, metalness: 0.1 })
  );
  leaves.position.set(x, 2.8, z);
  leaves.scale.set(1.4, 1.1, 1.1);
  leaves.castShadow = true;
  scene.add(leaves);
}

for (let i = 0; i < 18; i++) {
  const angle = (i / 18) * Math.PI * 2 + 0.75;
  const radius = 9 + (i % 3) * 2.2;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  addCandyTree(x, z, candyPalette[i % candyPalette.length]);
}

const player = {
  mesh: new THREE.Mesh(
    new THREE.SphereGeometry(0.95, 24, 24),
    new THREE.MeshStandardMaterial({
      color: 0xffe66d,
      emissive: 0xffc400,
      emissiveIntensity: 0.5,
      roughness: 0.35,
      metalness: 0.15
    })
  ),
  velocity: new THREE.Vector3(),
  position: new THREE.Vector3(0, 1.2, 0),
  speed: 8,
  radius: 1.1
};

player.mesh.position.copy(player.position);
player.mesh.castShadow = true;
scene.add(player.mesh);

const fairyMaterial = new THREE.MeshStandardMaterial({
  color: 0xe2fbff,
  emissive: 0x00eaff,
  emissiveIntensity: 0.9,
  roughness: 0.2,
  metalness: 0.2
});

const fairies = [];

function makeFairy(x, z, color) {
  const group = new THREE.Group();

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), fairyMaterial);
  body.position.y = 0.2;
  body.material = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 1.1,
    roughness: 0.2,
    metalness: 0.1
  });
  group.add(body);

  const wingGeo = new THREE.SphereGeometry(0.18, 10, 10, 0, Math.PI * 2, 0, Math.PI / 1.4);
  const wingMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xfff0b0,
    emissiveIntensity: 1.2,
    transparent: true,
    opacity: 0.8
  });

  const leftWing = new THREE.Mesh(wingGeo, wingMaterial);
  leftWing.position.set(-0.35, 0.55, 0.1);
  leftWing.rotation.z = 0.8;
  group.add(leftWing);

  const rightWing = leftWing.clone();
  rightWing.position.x = 0.35;
  rightWing.rotation.z = -0.8;
  group.add(rightWing);

  group.position.set(x, 1.5, z);
  group.userData = {
    baseY: 1.5,
    offset: Math.random() * Math.PI * 2,
    orbitRadius: 1.4 + Math.random() * 1.4,
    speed: 1.2 + Math.random() * 1.4,
    color
  };

  scene.add(group);
  fairies.push(group);
}

for (let i = 0; i < 3; i++) {
  const angle = (i / 3) * Math.PI * 2 + 0.7;
  const x = Math.cos(angle) * 6;
  const z = Math.sin(angle) * 6;
  makeFairy(x, z, candyPalette[(i + 1) % candyPalette.length]);
}

const collectibleGroup = new THREE.Group();
scene.add(collectibleGroup);

const collectibles = [];
const targetScore = 8;

function makeIceCream(x, z, tint) {
  const group = new THREE.Group();

  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.45, 1.2, 16),
    new THREE.MeshStandardMaterial({ color: 0xf4c77d, emissive: 0x9f6500, emissiveIntensity: 0.2 })
  );
  cone.rotation.x = Math.PI;
  cone.position.y = 0.25;
  group.add(cone);

  const scoopMaterial = new THREE.MeshStandardMaterial({
    color: tint,
    emissive: tint,
    emissiveIntensity: 0.5,
    roughness: 0.25,
    metalness: 0.1
  });

  for (let i = 0; i < 3; i++) {
    const scoop = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), scoopMaterial);
    scoop.position.y = 0.95 + i * 0.22;
    scoop.position.x = (i % 2 === 0 ? 0.12 : -0.12) * i;
    group.add(scoop);
  }

  group.position.set(x, 0.8, z);
  group.userData = { baseY: 0.8, bob: Math.random() * Math.PI * 2, id: collectibles.length }; 
  collectibleGroup.add(group);
  collectibles.push(group);
}

const spawnPositions = [
  [2.5, 5.5], [-3.5, 7], [7, 0], [0, -7], [-6, -2], [5, -5], [-8, 4], [8, 7],
  [4, 9], [-2, 9], [9, -2], [-9, -7]
];

spawnPositions.forEach(([x, z], index) => {
  const tint = candyPalette[index % candyPalette.length];
  makeIceCream(x, z, tint);
});

const clock = new THREE.Clock();
const keyState = {};
window.addEventListener('keydown', (event) => {
  keyState[event.key.toLowerCase()] = true;
});
window.addEventListener('keyup', (event) => {
  keyState[event.key.toLowerCase()] = false;
});

const scoreEl = document.getElementById('score');
const fairyCountEl = document.getElementById('fairy-count');
const messageEl = document.getElementById('message');
let score = 0;

function setMessage(text) {
  messageEl.textContent = text;
}

function updatePlayer(dt) {
  const direction = new THREE.Vector3();
  if (keyState['w']) direction.z -= 1;
  if (keyState['s']) direction.z += 1;
  if (keyState['a']) direction.x -= 1;
  if (keyState['d']) direction.x += 1;

  if (direction.lengthSq() > 0) {
    direction.normalize();
    player.velocity.x = direction.x * player.speed;
    player.velocity.z = direction.z * player.speed;
  } else {
    player.velocity.x *= 0.75;
    player.velocity.z *= 0.75;
  }

  player.position.x += player.velocity.x * dt;
  player.position.z += player.velocity.z * dt;

  const maxRadius = worldRadius - 1.5;
  player.position.x = THREE.MathUtils.clamp(player.position.x, -maxRadius, maxRadius);
  player.position.z = THREE.MathUtils.clamp(player.position.z, -maxRadius, maxRadius);

  player.mesh.position.copy(player.position);

  const targetCamera = new THREE.Vector3(player.position.x + 5, player.position.y + 6, player.position.z + 9);
  camera.position.lerp(targetCamera, 1.2 * dt);
  camera.lookAt(player.position.x, player.position.y + 1.5, player.position.z);
}

function updateFairies(dt) {
  fairies.forEach((fairy, index) => {
    fairy.rotation.y += dt * 1.5;
    const angle = clock.elapsedTime * fairy.userData.speed + index * 2.2;
    fairy.position.x = fairy.userData.baseX + Math.cos(angle) * fairy.userData.orbitRadius;
    fairy.position.z = fairy.userData.baseZ + Math.sin(angle) * fairy.userData.orbitRadius;
    fairy.position.y = fairy.userData.baseY + Math.sin(angle * 2.1) * 0.5;
    fairy.children[1].rotation.z = Math.sin(clock.elapsedTime * 12 + index) * 1.2;
    fairy.children[2].rotation.z = -Math.sin(clock.elapsedTime * 12 + index) * 1.2;
  });
}

function updateCollectibles(dt) {
  collectibles.forEach((item) => {
    item.rotation.y += dt * 1.4;
    item.position.y = item.userData.baseY + Math.sin(clock.elapsedTime * 3 + item.userData.bob) * 0.25;

    const dist = item.position.distanceTo(player.position);
    if (dist < 1.1) {
      item.visible = false;
      item.position.set(999, 999, 999);
      score += 1;
      scoreEl.textContent = score;
      const glow = new THREE.PointLight(0xffd9f2, 5, 8, 2);
      glow.position.copy(item.position);
      scene.add(glow);
      setTimeout(() => scene.remove(glow), 180);
    }
  });

  fairyCountEl.textContent = String(fairies.length);

  if (score >= targetScore) {
    setMessage('You collected every ice cream! The candy fairies cheer for you!');
  } else {
    setMessage(`Collect all the glowing ice creams! ${score}/${targetScore} found.`);
  }
}

function animate() {
  const dt = Math.min(clock.getDelta(), 0.033);
  updatePlayer(dt);
  updateFairies(dt);
  updateCollectibles(dt);
  renderer.render(scene, camera);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onResize);

const initialPositions = fairies.map((f) => ({ x: f.position.x, z: f.position.z }));
fairies.forEach((fairy, index) => {
  fairy.userData.baseX = initialPositions[index].x;
  fairy.userData.baseZ = initialPositions[index].z;
  fairy.userData.baseY = fairy.position.y;
});

renderer.setAnimationLoop(animate);
