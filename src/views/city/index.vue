<template>
  <div ref="wrapper"></div>
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
        el: this.$refs.wrapper,
        canvasWidth: 600,
        canvasHeight: 600
      })

      const box1 = threeEngine.utils.createBox(20, 20, 20)
      box1.position.set(6, 0, 6)
      threeEngine.scene.add(box1)
    }
  },
};
</script>

<style scoped>
</style>
