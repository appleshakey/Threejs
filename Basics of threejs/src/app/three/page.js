"use client";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { useEffect, useRef } from "react";
// import * as dat from "dat.gui";

export default function Three() {
  const containerRef = useRef(null);
  useEffect(() => {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const orbit = new OrbitControls(camera, renderer.domElement);

    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);

    camera.position.z = 5;
    camera.position.x = 3;
    camera.position.y = 20;

    orbit.update();
    //cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const planeGeometry = new THREE.PlaneGeometry(30, 30);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;

    const gridHelper = new THREE.GridHelper(30);
    scene.add(gridHelper);

    // const loader = new GLTFLoader();

    // loader.load("/car/scene.gltf", function (object) {
    //   scene.add(object.scene);
    // });
    const textureLoader = new THREE.TextureLoader().load("/nebula.jpg");
    // scene.background = textureLoader.load("/stars.jpg");
    textureLoader.colorSpace = THREE.SRGBColorSpace;
    scene.background = textureLoader;

    const sphereGeometry = new THREE.SphereGeometry(5, 30, 30);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      map: textureLoader,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    sphere.position.set(-10, 10, 0);
    sphere.castShadow = true;

    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const directionLight = new THREE.DirectionalLight(0xffffff, 5);
    scene.add(directionLight);
    directionLight.position.set(-30, 20, 0);
    directionLight.castShadow = true;

    const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
    const plane2Material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
    });

    const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
    scene.add(plane2);
    plane2.position.set(10, 10, 15);

    const sphere2Geometry = new THREE.SphereGeometry(4);

    const vShader = `void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0)
      }`;

    const fShader = `
      void main(){
        gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0)
      }`;
    const sphere2Material = new THREE.ShaderMaterial({
      vertexShader: vShader,
      fragmentShader: fShader,
    });

    const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
    scene.add(sphere2);
    // const dLightHelper = new THREE.DirectionalLightHelper(directionLight, 10);
    // scene.add(dLightHelper);

    // const dLightShadowHelper = new THREE.CameraHelper(
    //   directionLight.shadow.camera
    // );

    // const spotLight = new THREE.SpotLight(0xffffff);
    // scene.add(spotLight);
    // spotLight.position.set(-100, 100, 0);
    // spotLight.castShadow = true;

    // const sLightHelper = new THREE.SpotLightHelper(spotLight);
    // scene.add(sLightHelper);

    // const gui = dat.GUI();
    // const options = {
    //   sphereColor: "#ffea00",
    // };

    // gui.addColor(options, "sphereColor").onChange(function (e) {
    //   sphere.material.color.set(e);
    // });

    // //line
    // const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

    // const points = [];
    // points.push(new THREE.Vector3(-3, 0, 0));
    // points.push(new THREE.Vector3(0, 3, 0));
    // points.push(new THREE.Vector3(3, 0, 0));

    // const linegeometry = new THREE.BufferGeometry().setFromPoints(points);
    // const line = new THREE.Line(linegeometry, lineMaterial);
    // scene.add(line);
    let step = 0;
    let speed = 0.01;

    const sphereid = sphere.id;
    const rayCaster = new THREE.Raycaster();
    const mousePosition = new THREE.Vector2();
    window.addEventListener("mousemove", function (e) {
      mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosition.y = -(e.clientY / innerHeight) * 2 + 1;
    });

    function animate(time) {
      requestAnimationFrame(animate);

      cube.rotation.x = time / 1000;
      cube.rotation.y = time / 1000;
      step += speed;
      sphere.position.y = 10 * Math.abs(Math.sin(step));

      rayCaster.setFromCamera(mousePosition, camera);
      const intersects = rayCaster.intersectObjects(scene.children);
      console.log(intersects);
      for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.id == sphereid) {
          intersects[i].object.material.color.set(0xff0000);
        }
      }

      plane2.geometry.attributes.position.array[0] = 10 * Math.random();
      plane2.geometry.attributes.position.array[1] = 10 * Math.random();
      plane2.geometry.attributes.position.array[2] = 10 * Math.random();
      const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
      plane2.geometry.attributes.position.array[lastPointZ] =
        10 * Math.random();
      plane2.geometry.attributes.position.needsUpdate = true;
      // if (flag == 0) sphere.material.color.set(0xffffff);

      renderer.render(scene, camera);
    }

    window.addEventListener("resize", function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return () => {
      animate();
    };
  }, []);
  return <div ref={containerRef}></div>;
}
