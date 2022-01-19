<template>
  <div class="wrapper">
    <!-- 操作栏 -->
    <div class="tool-bar" v-if="threeEngine">
      <div>
        <button type="button" @click="drawingFloor">绘制楼体</button>
        <div v-show="threeEngine.status === 2">
          <button type="button" disabled>撤回</button>
          <button type="button" disabled>恢复</button>
          <button type="button">完成</button>
        </div>
      </div>

    </div>

    <!-- 容器  -->
    <div ref="threeContainer" class="three-container"></div>
  </div>
</template>

<script>
import ThreeEngine from './utils/three-engine-class'
export default {
  name: "VirtualCity",
  data() {
      return {
        threeEngine: null
      }
  },
  mounted() {
    this.initThreeEngine()
  },
  methods: {
    initThreeEngine() {
      const threeEngine = this.threeEngine = new ThreeEngine({
        el: this.$refs.threeContainer,
        canvasWidth: 600,
        canvasHeight: 600
      })

      this.threeEngine= threeEngine

      const box1 = threeEngine.utils.createBox(20, 20, 20)
      box1.position.set(6, 0, 6)
      threeEngine.scene.add(box1)
    },
    drawingFloor() {
      this.threeEngine.status = 2
    }
  },
};
</script>

<style scoped>
</style>
