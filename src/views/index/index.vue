<template>
    <div class="threeModel" ref="wrapper">

    </div>
</template>

<script>
import { initContainer, createBall, createFloor } from './utils'
export default {
    name: 'Index',
    data() {
        return {

        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            const { scene, renderer} = initContainer()
            this.scene = scene
            this.$refs.wrapper.appendChild(renderer.domElement)

            const ball  = createBall()
            scene.add(ball)

            const floorPlanePoints = [
                        [-100, 20],

                        [-90, 20],
                        [-90, 30],
                        [-70, 30],
                        [-60, 20],

                        [100, 20],
                        [100, -20],
                        [-100, -20]
            ]
            const floor =  createFloor(floorPlanePoints)
            scene.add(floor)
        }
    }
}
</script>

<style scoped lang="scss">

</style>