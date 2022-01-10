<template>
    <div class="threeModel">
        <div ref="modelBox" id="modelBox"></div>
    </div>
</template>

<script>
import { initContainer, createFloor } from './utils'
import borderData from './floor-descript.json'

export default {
    name: 'Floor',
    data() {
        return {
            borderData: {}
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            const {scene, renderer} = initContainer()
            this.$refs.modelBox.appendChild(renderer.domElement)
            // 添加楼房楼层平面
            // addFloors(scene, borderData)

            const floor = createFloor(borderData)
            floor.position.set(-30,0,30)
            floor.scale.set(5,5,5)
            scene.add(floor)
        
        }
    }
}
</script>

<style scoped lang="scss">
    .threeModel {
        width: 100%;
        height: 100%;
        #modelBox {
            width: 100%;
            height: 100%;
        }
    }
</style>