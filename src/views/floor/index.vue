<template>
    <div class="threeModel">
        <div ref="modelBox" id="modelBox"></div>
    </div>
</template>

<script>
import { initContainer, createBall, createSimgleWall, createFloor } from './utils'
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
            if (true) {
                const centerBall = createBall()
                this.scene.add(centerBall)
            }

            // 创建单个球体
            if (false) {
                const singleWall = createSimgleWall(
                    [-70,30], 
                    [50, 30]
                )
                singleWall.position.set(-30,0,30)
                this.scene.add(singleWall)
            }


            // 创建一栋楼
            if (true) {
                const floor1 = createFloor({
                    points: [
                        [-100, 20],

                        [-90, 20],
                        [-90, 30],
                        [-70, 30],
                        [-60, 20],

                        [100, 20],
                        [100, -20],
                        [-100, -20]
                    ],
                    height: 50
                })
                this.scene.add(floor1)
            }

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