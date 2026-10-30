import * as THREE from 'three/webgpu';
import { array, pass, vec3 } from 'three/tsl';
// import { dof } from 'three/addons/tsl/display/DepthOfFieldNode.js';


import { render } from 'solid-js/web';
import ProjectScreen from './project_screen.jsx';

import { Player } from './player.js';
import { StaticObject, InteractAbleObject } from './object.js'
import { Physics } from './physics.js';
import { PhysicsDebug } from './debug.js';
import get_texture from './get_texture.js';
import { assetsReady, hideLoadingScreen, showError } from './loadingmanager.js';
import { AudioManager } from './audio.js';


async function Main() {

  const canvas = document.querySelector('#canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
  // const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  const renderer = new THREE.WebGPURenderer({ canvas, antialias: true});
  await renderer.init();


  const audiolistener = new THREE.AudioListener()
  camera.add(audiolistener)

  const audiomanager = new AudioManager(audiolistener);


  render(
    () => <ProjectScreen audiomanager={audiomanager}/>,
    document.getElementById('root')
  )




  let Interact = []

  const renderPipeline = new THREE.RenderPipeline(renderer);
  const scenePass = pass(scene, camera);

  const colorNode = scenePass.getTextureNode('output');
  // const viewZNode = scenePass.getViewZNode();
  
  

  const sun = new THREE.DirectionalLight(0xffffff, 1);
  sun.position.set(10,20,10);
  scene.add(sun)

  scene.background = new THREE.Color(0x3b414d)
  scene.fog = new THREE.FogExp2(0x3b414d, 0.0175);  

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setClearColor(0x3b414d);


  renderPipeline.outputNode = colorNode;
  // renderPipeline.outputNode = dof(
  //   colorNode,
  //   viewZNode,
  //   10.0,
  //   5.0,
  //   0.0 
  // );

  


  const physics = await Physics.create();
  const player = new Player(scene,physics,audiomanager);

  createObject()

  const debug = new PhysicsDebug(scene,physics);
  const Timer = new THREE.Timer();


  function animate() {
    requestAnimationFrame(animate);

    Timer.update();
    const delta = Timer.getDelta();

    physics.update();
    player.update(delta);
    // debug.update();

    const offset = new THREE.Vector3(0, 60, 50);
    camera.position.copy(player.mesh.position).add(offset);
    camera.lookAt(player.mesh.position);

    Interact.forEach(i => {
      i.update(player, delta)
    });
    renderPipeline.render();

  }
  animate()


  function createObject() {
    const wallRight = new StaticObject(
      scene,
      physics,
      new THREE.BoxGeometry(5,10,200),
      new THREE.MeshStandardMaterial({visible: false}),
      new THREE.Vector3(100,0,0)
    );
    const wallLeft = new StaticObject(
      scene,
      physics,
      new THREE.BoxGeometry(5,10,200),
      new THREE.MeshStandardMaterial({visible: false}),
      new THREE.Vector3(-100,0,0)
    );
    const wallBack = new StaticObject(
      scene,
      physics,
      new THREE.BoxGeometry(200,10,5),
      new THREE.MeshStandardMaterial({visible: false}),
      new THREE.Vector3(0,0,100)
    );
    const wallFront = new StaticObject(
      scene,
      physics,
      new THREE.BoxGeometry(200,10,5),
      new THREE.MeshStandardMaterial({visible: false}),
      new THREE.Vector3(0,0,-100)
    );

    const wallLeft1 = new StaticObject(
      scene,
      physics,
      new THREE.BoxGeometry(5,10,100),
      new THREE.MeshStandardMaterial({visible: false}),
      new THREE.Vector3(-85,0,70),
      new THREE.Vector3(0,Math.PI/7,0),
    );




    const ground_texture = get_texture('assets/ground.png');
    const ground = new StaticObject(
      scene,
      physics,
      new THREE.BoxGeometry(200,10.2,200),
      new THREE.MeshStandardMaterial({
        map: ground_texture,
        transparent: true,
      }),
      new THREE.Vector3(0,-10,0)
    );
    const ground1 = new StaticObject(
      scene,
      physics,
      new THREE.BoxGeometry(200,10,200),
      new THREE.MeshStandardMaterial({
        map: ground_texture,
        transparent: true,
      }),
      new THREE.Vector3(0,-10,32)
    );

    const lake_texture = get_texture('assets/lake.png')
    const lake = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(80,80),
      new THREE.MeshStandardMaterial({
        map: lake_texture, 
        transparent: true
      }),
      new THREE.Vector3(60,-4,95),
      new THREE.Vector3(-Math.PI/2,0,0),
      false,
      true
    );

    project()

    bush()
    tree()
    rock()
    ornament()
    grassandrock()
  };

  function project() {
    const serene = new InteractAbleObject(
      "Serene",
      scene,
      physics,
      new THREE.PlaneGeometry(15,15),
      new THREE.Vector3(50,0,-40),
    )

    const onebonker = new InteractAbleObject(
      "OneBonker",
      scene,
      physics,
      new THREE.PlaneGeometry(15,15),
      new THREE.Vector3(-30,0,-45),
    )

    const cosmotrack = new InteractAbleObject(
      "CosmoTrack",
      scene,
      physics,
      new THREE.PlaneGeometry(15,15),
      new THREE.Vector3(25,0,40),
    )

    const wrebos = new InteractAbleObject(
      "Wreb-os",
      scene,
      physics,
      new THREE.PlaneGeometry(15,15),
      new THREE.Vector3(5,0,-80),
    )

    const rx_pad = new InteractAbleObject(
      "Rx-pad",
      scene,
      physics,
      new THREE.PlaneGeometry(15,15),
      new THREE.Vector3(-55,0,10),
    )


    Interact.push(serene,onebonker,cosmotrack,wrebos,rx_pad)
  }



  function grassandrock() {
    const grass_texture = get_texture('assets/ornament_leveled_light.png', true, 2);
    const grassb_texture = get_texture('assets/ornament_leveled_light.png', true, 3);
    const smallrock_texture = get_texture('assets/ornament_leveled_light.png', true, 5);

    const rock = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(8,8),
      new THREE.MeshStandardMaterial({
        map: smallrock_texture, 
        transparent: true,
        depthWrite: true,
        alphaTest: 0.1,
      }),
      new THREE.Vector3(42,-4.0,-38),
      new THREE.Vector3(-0.6,0,0),
      true,
      false
    );

    const rock1 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(8,8),
      new THREE.MeshStandardMaterial({
        map: smallrock_texture, 
        transparent: true,
        depthWrite: true,
        alphaTest: 0.1,
      }),
      new THREE.Vector3(10,-4.0,30),
      new THREE.Vector3(-0.6,0,0),
      true,
      false
    );


    const grass = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(8,8),
      new THREE.MeshStandardMaterial({
        map: grass_texture, 
        transparent: true,
        depthWrite: true,
        alphaTest: 0.1,
      }),
      new THREE.Vector3(-40,-3.0,60),
      new THREE.Vector3(-0.6,0,0),
      true,
      false
    );

    const grass1 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(8,8),
      new THREE.MeshStandardMaterial({
        map: grass_texture, 
        transparent: true,
        depthWrite: true,
        alphaTest: 0.1,
      }),
      new THREE.Vector3(-20,-3.0,30),
      new THREE.Vector3(-0.6,0,0),
      true,
      false
    );

    const grassb = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(8,8),
      new THREE.MeshStandardMaterial({
        map: grassb_texture, 
        transparent: true,
        depthWrite: true,
        alphaTest: 0.1,
      }),
      new THREE.Vector3(40,-3.0,40),
      new THREE.Vector3(-0.6,0,0),
      true,
      false
    );

    const grassb1 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(8,10),
      new THREE.MeshStandardMaterial({
        map: grassb_texture, 
        transparent: true,
        depthWrite: true,
        alphaTest: 0.1,
      }),
      new THREE.Vector3(-30,-3.0,20),
      new THREE.Vector3(-0.6,0,0),
      true,
      false
    );

    const grass2 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(8,8),
      new THREE.MeshStandardMaterial({
        map: grass_texture, 
        transparent: true,
        depthWrite: true,
        alphaTest: 0.1,
      }),
      new THREE.Vector3(30,-3.0,30),
      new THREE.Vector3(-0.6,0,0),
      true,
      false
    );

    const grassb2 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(10,8),
      new THREE.MeshStandardMaterial({
        map: grassb_texture, 
        transparent: true,
        depthWrite: true,
        alphaTest: 0.1,
      }),
      new THREE.Vector3(-27,-3.0,-37),
      new THREE.Vector3(-0.6,0,0),
      true,
      false
    );

    const grassb3 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(10,8),
      new THREE.MeshStandardMaterial({
        map: grassb_texture, 
        transparent: true,
        depthWrite: true,
        alphaTest: 0.1,
      }),
      new THREE.Vector3(-60,-3.0,-20),
      new THREE.Vector3(-0.6,0,0),
      true,
      false
    );
  }

  function ornament() {
    const sign_texture = get_texture('assets/ornament_leveled_2.png', true, 3);
    const sign = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(10,20),
      new THREE.MeshStandardMaterial({
        map: sign_texture, 
        transparent: true,
        depthWrite: true,
        alphaTest: 0.1,
      }),
      new THREE.Vector3(-22,0,64),
      new THREE.Vector3(0,0.3,0),
      true,
      false
    );

    const house_texture = get_texture('assets/ornament_leveled_2.png', true, 1);
    const house = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(35,65),
      new THREE.MeshStandardMaterial({
        map: house_texture, 
        transparent: true,
        depthWrite: true,
        alphaTest: 0.1,
      }),
      new THREE.Vector3(-53,12,76),
      new THREE.Vector3(0,0.3,0),
      true,
      false
    );

    const log_texture = get_texture('assets/ornament_leveled_light.png', true, 4);
    const log = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(20,20),
      new THREE.MeshStandardMaterial({
        map: log_texture, 
        transparent: true,
        depthWrite: true,
        alphaTest: 0.1,
      }),
      new THREE.Vector3(0,-2.2,0),
      new THREE.Vector3(-0.6,0,0),
      true,
      false
    );

    const log1 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(17,17),
      new THREE.MeshStandardMaterial({
        map: log_texture, 
        transparent: true,
        depthWrite: true,
        alphaTest: 0.1,
      }),
      new THREE.Vector3(-50,-2.2,80),
      new THREE.Vector3(-0.6,0,0),
      true,
      false
    );
  }

  function bush() {
    const bush_texture = get_texture('assets/ornament_leveled_2.png', true, 0);
    const bush = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(30,30),
      new THREE.MeshStandardMaterial({
        map: bush_texture, 
        transparent: true,
        depthWrite: true,
        alphaTest: 0.1,
      }),
      new THREE.Vector3(-75,0,-10),
      new THREE.Vector3(-0.4,1.1,-Math.PI/2),
      true,
      true
    );

    const bush1 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(30,30),
      new THREE.MeshStandardMaterial({
        map: bush_texture, 
        transparent: true,
        depthWrite: true,
        alphaTest: 0.1,
      }),
      new THREE.Vector3(-70,0,-40),
      new THREE.Vector3(-0.4,1.1,-Math.PI/2),
      true,
      true
    );

    const bush2 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(30,30),
      new THREE.MeshStandardMaterial({
        map: bush_texture, 
        transparent: true,
        depthWrite: true,
        alphaTest: 0.1,
      }),
      new THREE.Vector3(60,0,47),
      new THREE.Vector3(0,-0.8,-Math.PI/2),
      true,
      true
    );

    const bush3 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(40,40),
      new THREE.MeshStandardMaterial({
        map: bush_texture, 
        transparent: true,
        depthWrite: true,
        alphaTest: 0.1,
      }),
      new THREE.Vector3(70,0,45),
      new THREE.Vector3(0,-0.7,-Math.PI/2),
      true,
      true
    );

    const bush4 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(40,40),
      new THREE.MeshStandardMaterial({
        map: bush_texture, 
        transparent: true,
        depthWrite: true,
        alphaTest: 0.1,
      }),
      new THREE.Vector3(70,0,35),
      new THREE.Vector3(0,-1.2,-Math.PI/2),
      true,
      true
    );
  }

  function rock() {
    const rock_texture = get_texture('assets/ornament_leveled_2.png', true, 2);
    const rock = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(30,30),
      new THREE.MeshStandardMaterial({
        map: rock_texture, 
        transparent: true,
        depthWrite: true,
        alphaTest: 0.1,
      }),
      new THREE.Vector3(-50,0,-80),
      new THREE.Vector3(-0.4,0.6,-Math.PI/2),
      true,
      true
    );

    const rock1 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(30,50),
      new THREE.MeshStandardMaterial({
        map: rock_texture, 
        transparent: true,
        depthWrite: true,
        alphaTest: 0.1,
      }),
      new THREE.Vector3(-65,0,-60),
      new THREE.Vector3(-0.4,1.2,-Math.PI/2),
      true,
      true
    );

    const rock2 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(30,50),
      new THREE.MeshStandardMaterial({
        map: rock_texture, 
        transparent: true,
        depthWrite: true,
        alphaTest: 0.1,
      }),
      new THREE.Vector3(-70,0,-50),
      new THREE.Vector3(-0.4,1.2,-Math.PI/2),
      true,
      true
    );


    const bigrock_texture = get_texture('assets/bigrock.png');
    const bigrock = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(120,80),
      new THREE.MeshStandardMaterial({
        map: bigrock_texture, 
        transparent: true,
        depthWrite: true,
        alphaTest: 0.1,
      }),
      new THREE.Vector3(60,20,-70),
      new THREE.Vector3(0,-0.6,0),
      true,
      true
    );
  }

  function tree() {

    const treeB_texture = get_texture('assets/ornament_leveled_2.png', true, 4);
    const treeB = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(30,40),
      new THREE.MeshStandardMaterial({
        map: treeB_texture, 
        transparent: true,
        depthWrite: true,
        alphaTest: 0.1,
      }),
      new THREE.Vector3(-55,14,60),
      new THREE.Vector3(0,0.2,0),
      true,
      false
    );

    const treeB1 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(25,25),
      new THREE.MeshStandardMaterial({
        map: treeB_texture, 
        transparent: true,
        depthWrite: true,
        alphaTest: 0.1,
      }),
      new THREE.Vector3(-75,5,65),
      new THREE.Vector3(0,0.5,0),
      true,
      false
    );


    const treeB2 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(25,25),
      new THREE.MeshStandardMaterial({
        map: treeB_texture, 
        transparent: true,
        depthWrite: true,
        alphaTest: 0.1,
      }),
      new THREE.Vector3(-65,5,85),
      new THREE.Vector3(0,0.4,0),
      true,
      false
    );



    const tree_texture = get_texture('assets/tree.png');
    const treeR1 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(30,55),
      new THREE.MeshStandardMaterial({
        map: tree_texture, 
        transparent: true,
        depthWrite: false,
        alphaTest: 0.1
      }),
      new THREE.Vector3(90,18,0),
      new THREE.Vector3(0,-0.8,0),
    );

    const treeR2 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(30,50),
      new THREE.MeshStandardMaterial({
        map: tree_texture, 
        transparent: true,
        depthWrite: false,
        alphaTest: 0.1
      }),
      new THREE.Vector3(90,18,-20),
      new THREE.Vector3(0,-0.8,0),
    );

    const treeR3 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(30,70),
      new THREE.MeshStandardMaterial({
        map: tree_texture, 
        transparent: true,
        depthWrite: false,
        alphaTest: 0.1
      }),
      new THREE.Vector3(97,20,15),
      new THREE.Vector3(0,-0.9,0),
    );

    const treeR4 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(30,50),
      new THREE.MeshStandardMaterial({
        map: tree_texture, 
        transparent: true,
        depthWrite: false,
        alphaTest: 0.1
      }),
      new THREE.Vector3(83,18,24),
      new THREE.Vector3(0,-0.8,0),
    );

    const treeF1 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(30,50),
      new THREE.MeshStandardMaterial({
        map: tree_texture, 
        transparent: true,
        alphaTest: 0.1
      }),
      new THREE.Vector3(0,16,-100),
      new THREE.Vector3(0,0,0),
    );

    const treeF2 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(20,35),
      new THREE.MeshStandardMaterial({
        map: tree_texture, 
        transparent: true,
        alphaTest: 0.1
      }),
      new THREE.Vector3(4,12,-90),
      new THREE.Vector3(0,-0.4,0),
    );

    const treeF3 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(20,40),
      new THREE.MeshStandardMaterial({
        map: tree_texture, 
        transparent: true,
        alphaTest: 0.1
      }),
      new THREE.Vector3(-8,12,-92),
      new THREE.Vector3(0,0.2,0),
    );

    const treeF_3 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(20,40),
      new THREE.MeshStandardMaterial({
        map: tree_texture, 
        transparent: true,
        alphaTest: 0.1
      }),
      new THREE.Vector3(-26,12,-89),
      new THREE.Vector3(0,0.2,0),
    );

    const treeF4 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(15,30),
      new THREE.MeshStandardMaterial({
        map: tree_texture, 
        transparent: true,
        alphaTest: 0.1
      }),
      new THREE.Vector3(-20,10,-93),
      new THREE.Vector3(0,0.3,0),
    );

    const treeF5 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(20,50),
      new THREE.MeshStandardMaterial({
        map: tree_texture, 
        transparent: true,
        alphaTest: 0.1
      }),
      new THREE.Vector3(-35,12,-90),
      new THREE.Vector3(0,0.3,0),
    );

    const treeF_5 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(20,40),
      new THREE.MeshStandardMaterial({
        map: tree_texture, 
        transparent: true,
        alphaTest: 0.1
      }),
      new THREE.Vector3(-45,10,-85),
      new THREE.Vector3(0,0.3,0),
    );

    const treeF__5 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(20,40),
      new THREE.MeshStandardMaterial({
        map: tree_texture, 
        transparent: true,
        alphaTest: 0.1
      }),
      new THREE.Vector3(-65,10,-68),
      new THREE.Vector3(0,0.9,0),
    );

    const treeF6 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(20,40),
      new THREE.MeshStandardMaterial({
        map: tree_texture, 
        transparent: true,
        alphaTest: 0.1
      }),
      new THREE.Vector3(-60,12,-78),
      new THREE.Vector3(0,0.4,0),
    );

    const treeF7 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(20,38),
      new THREE.MeshStandardMaterial({
        map: tree_texture, 
        transparent: true,
        alphaTest: 0.1
      }),
      new THREE.Vector3(-70,12,-60),
      new THREE.Vector3(0,0.4,0),
    );

    const treeL1 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(25,60),
      new THREE.MeshStandardMaterial({
        map: tree_texture, 
        transparent: true,
        alphaTest: 0.1
      }),
      new THREE.Vector3(-78,20,-40),
      new THREE.Vector3(0,0.6,0),
    );

    const treeL2 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(30,50),
      new THREE.MeshStandardMaterial({
        map: tree_texture, 
        transparent: true,
        alphaTest: 0.1
      }),
      new THREE.Vector3(-83,16,-30),
      new THREE.Vector3(0,0.6,0),
    );

    const treeL3 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(30,50),
      new THREE.MeshStandardMaterial({
        map: tree_texture, 
        transparent: true,
        alphaTest: 0.1
      }),
      new THREE.Vector3(-83,16,-30),
      new THREE.Vector3(0,0.6,0),
    );

    const treeL4 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(25,35),
      new THREE.MeshStandardMaterial({
        map: tree_texture, 
        transparent: true,
        alphaTest: 0.1
      }),
      new THREE.Vector3(-83,12,-20),
      new THREE.Vector3(0,0.6,0),
    );

    const treeL5 = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(25,35),
      new THREE.MeshStandardMaterial({
        map: tree_texture, 
        transparent: true,
        alphaTest: 0.1
      }),
      new THREE.Vector3(-83,8,0),
      new THREE.Vector3(0,1,0),
    );

  }


}




Main();




