function init() {
  let container = document.querySelector(".scene");

  //Creating a scene
  let scene = new THREE.Scene();

  const fov = 35; //field of vision
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 2000;


  //Camera Setup
  let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(5, 2, 20);
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", onWindowResize);

  //Renderer
  let renderer = new THREE.WebGL1Renderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);

  //Lighting
  const ambient = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambient);
  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(10, 10, 100);
  scene.add(light);

  //Load Model
  let loader = new THREE.GLTFLoader();
  loader.load("./3d_house/scene.gltf", function (gltf) {
      scene.add(gltf.scene);
      const house = gltf.scene.children[0];

    //Animation
    function animate() {
      requestAnimationFrame(animate);
      house.rotation.z += 0.0005;
      renderer.render(scene, camera);
    }
    animate();
  });
}

init();
