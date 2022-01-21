<template>
  <div class="wrapper">
    <!-- 操作栏 -->
    <div class="tool-bar" v-if="threeEngine">
      <div>
        <button type="button" @click="handleDrawingFloor">绘制楼体</button>
        <div v-show="threeEngine.status === 2">
          <button type="button" disabled>撤回</button>
          <button type="button" disabled>恢复</button>
          <button type="button" @click="handleCreateFloor">完成</button>
        </div>
      </div>

    </div>

    <!-- 容器  -->
    <div ref="threeContainer" class="three-container"></div>
  </div>
</template>

<script>
import ThreeEngine from './utils/three-engine-class'
import { createFloorPolygon, default as Floor } from './utils/floor'
import { createBox } from './shared/extra'

export default {
  name: "VirtualCity",
  data() {
      return {
        threeEngine: null,
        floors: [],
        drawingFloorPoints: []
      }
  },
  mounted() {
    this.initThreeEngine()
  },
  methods: {
    initThreeEngine() {
      const threeEngine = this.threeEngine = new ThreeEngine({
        el: this.$refs.threeContainer,
        canvasWidth: 1000,
        canvasHeight: 600
      })

      this.threeEngine= threeEngine

      const box1 = createBox(20, 40, 20)
      box1.position.set(6, 20, 6)
      threeEngine.scene.add(box1)
    },
    handleDrawingFloor() {
      this.threeEngine.status = 2
      let polygon = null
      this.threeEngine.bus.$on('click', ({selected}) => {
        const {x, y, z} = selected.point
        this.drawingFloorPoints.push([x, y, z])

        this.threeEngine.scene.remove(polygon) // 清除老的形状
        polygon = createFloorPolygon(this.drawingFloorPoints)
        this.threeEngine.scene.add(polygon) // 绘制新的形状
      })
    },
    handleCreateFloor() {
      this.threeEngine.status = 1
      const floor = new Floor({points: this.drawingFloorPoints, height: 100})
      console.log('floor', floor)
      this.threeEngine.scene.add(floor.mesh)
      this.floors.push(this.drawingFloorPoints)
      this.drawingFloorPoints = []
    }
  },
};
</script>

<style scoped>
</style>
