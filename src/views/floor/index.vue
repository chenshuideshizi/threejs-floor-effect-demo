<template>
    <div class="threeModel">
        <div ref="modelBox" id="modelBox"></div>
    </div>
</template>

<script>
import { initContainer, createBall, createWall } from './utils'
import TestMixin from './testMixin'

export default {
    name: 'Floor',
    mixins: [TestMixin],
    data() {
        return {
            scene: null
        }
    },
    mounted() {
        this.init()

        this.$nextTick(() => {
            this.test()
        })

    },
    methods: {
        test() {
            // 创建中心点小球
            if (false) {
                const centerBall = createBall()
                this.scene.add(centerBall)
            }


            const wall = createWall(
                [-70,30], 
                [50, 30]
                // [40, -60],
                // [-100, -80]
            )
            this.scene.add(wall)
        },
        init() {
            const {scene, renderer} = initContainer()
            this.scene = scene
            this.$refs.modelBox.appendChild(renderer.domElement)
        },
        // init() {
        //     const {scene, renderer} = initContainer()
        //     this.$refs.modelBox.appendChild(renderer.domElement)
        //     // 添加楼房楼层平面
        //     // addFloors(scene, borderData)

        //     const floor = createFloor(borderData)
        //     floor.position.set(-30,0,30)
        //     floor.scale.set(5,5,5)
        //     scene.add(floor)
        
        // }
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