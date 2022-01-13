<template>
  <div ref="wrapper"></div>
</template>

<script>
import { createCity } from "./city";
import * as THREE from 'three'
import { initThree } from "./initThree";
import { createBasePlane, createTest, createBall } from "./tools";

export default {
  name: "VirtualCity",
  data() {
      return {
          camera: null,
          scene: null,
          renderer: null
      }
  },
  mounted() {
    this.initEvent();
    this.init();
  },
  methods: {
    init() {
      const { scene, renderer, camera } = initThree();
      this.scene = scene
      this.camera = camera
      this.renderer = renderer

      this.$refs.wrapper.appendChild(renderer.domElement);

      // 创建地面
      const basePlane = createBasePlane();
      scene.add(basePlane);

      const testMesh = createTest();
      scene.add(testMesh);

      // const city = createCity()
      // scene.add(city)
    },
    initEvent() {
      document.addEventListener("click", this.onDocumentMouseDown);
    },
    onDocumentMouseDown(event) {
        event.preventDefault();
        const {camera, scene} = this
        var vector = new THREE.Vector3();//三维坐标对象
        vector.set(
            (event.clientX / window.innerWidth ) * 2 - 1,
            - (event.clientY / window.innerHeight ) * 2 + 1,
            0.5
        );
        vector.unproject( camera );
        var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        var intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            var selected = intersects[0];//取第一个物体
            const {x, y, z} = selected.point
            console.log("x坐标:"+selected.point.x);
            console.log("y坐标:"+selected.point.y);
            console.log("z坐标:"+selected.point.z);

            // 在当前位置绘制一个点
            const ball = createBall(1)
            ball.position.set(x, y, z)
            scene.add(ball)
        }
    }
  },
};
</script>

<style scoped>
</style>
