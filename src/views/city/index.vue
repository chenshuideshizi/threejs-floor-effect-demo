<template>
  <div ref="wrapper"></div>
</template>

<script>
import { createCity } from "./city";
import * as THREE from 'three'
import { initThree } from "./initThree";
import { createBasePlane, createTest, createBall, createLine, createBox } from "./tools";

export default {
  name: "VirtualCity",
  data() {
      return {
          camera: null,
          scene: null,
          renderer: null,
          drawingPoints: []
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


    },
    initEvent() {
      document.addEventListener("click", this.onDocumentMouseDown);
    },
    renderDrawingPoints() {
        let groupName = 'drawing-points-group'
        let oldGroup = this.scene.getObjectByName(groupName) 
        if (oldGroup) {
            this.scene.remove(oldGroup)
        }
        let newGroup = new THREE.Group()
        newGroup.name = groupName

        // 绘制轨迹

        for(let i = 0, l = this.drawingPoints.length; i < l; i++) {
            // 是否闭合
            if (i === l -1) {
                break
            }
            let p1 = this.drawingPoints[i]
            let p2 = this.drawingPoints[i+1]
            const line = createLine(p1, p2)

            newGroup.add(line)
        }

        this.drawingPoints.forEach(point => {
            const boxPoint = createBox(0.2, 0.2, 0.2)
            boxPoint.position.set(0, 0.1, 0)
            boxPoint.userData.drawing = true
            boxPoint.name = 'drawingBox'
            console.log('drawingBox', boxPoint)
            const [x, y, z] = point
            boxPoint.position.set(x, y, z)
            newGroup.add(boxPoint)
        })
        this.scene.add(newGroup)
        
    },
    // 点击事件
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
            console.log('selected', selected)

            const {x, y, z} = selected.point
            console.log("x坐标:" + x);
            console.log("y坐标:" + y);
            console.log("z坐标:" + z);

            if (selected.object.userData.drawing) {
                debugger
                console.log(selected.object.position)
            } else {
                // 保存当前点坐标
                this.drawingPoints.push([x, y, z])
                this.renderDrawingPoints()
            }




        }
    }
  },
};
</script>

<style scoped>
</style>
