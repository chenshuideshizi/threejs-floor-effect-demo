<template>
    <div class="threeModel">
        <div id="modelBox"></div>
    </div>
</template>

<script>
import borderData from './floor.json'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { createFloor } from './floor-class'
export default {
    name: 'threeModel',
    data() {
        return {
            borderData: borderData,
            _borderData: [], // 楼房基础数据
            _bounds: [], // 楼房四至
            _center: [] // 楼房中心点
        }
    },
    mounted() {
        this.initContainer()
        this.renderModel()
    },
    methods: {
        renderModel() {
            const { featureCollection } = borderData
            featureCollection.forEach(feature => {
                if (feature.type === 'floor') {
                    createFloor(feature)
                }
            })
        },
        // 创建场景
        initContainer() {
            /*创建场景对象Scene*/
            var scene = new THREE.Scene()
            // 添加楼房楼层平面
            // addFloors(scene, borderData)
            /* 光源设置*/
            // 环境光
            var ambientLight = new THREE.AmbientLight(0xffffff)
            scene.add(ambientLight)
            /**
             * 相机设置
             */
            var width = window.innerWidth //窗口宽度
            var height = window.innerHeight //窗口高度
            var k = width / height //窗口宽高比
            var s = 1500 //三维场景显示范围控制系数，系数越大，显示的范围越大
            //创建相机对象
            var camera = new THREE.PerspectiveCamera(
                45,
                window.innerWidth / window.innerHeight,
                0.1,
                1000000
            )
            camera.position.set(3000,2000,3000)
            camera.lookAt(scene.position)
            /**
             * 创建渲染器对象
             */
            var renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            })
            renderer.setSize(window.innerWidth - 300, window.innerHeight)
            document.getElementById('modelBox').appendChild(renderer.domElement)

            var controls = new OrbitControls(camera, renderer.domElement)
            controls.target = new THREE.Vector3(0, 0, 0) //控制焦点
            controls.autoRotate = true;//将自动旋转关闭
            let clock = new THREE.Clock();//用于更新轨道控制器

            // 创建一个用于测试的正方体
            var geometry = new THREE.BoxGeometry( 20, 20, 20 );
            var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
            var cube = new THREE.Mesh( geometry, material );
            scene.add( cube );

            function animate() {
                renderer.render(scene, camera)

                let delta = clock.getDelta();
                controls.update(delta);
                requestAnimationFrame(animate)
            }
            animate()
        },
        // 数据转换
        _dataAnalysis (borderData) {
            let data = []
            borderData.features.forEach(res => {
                res.geometry.coordinates.forEach(r => {
                        // 将度转换为米
                    r = r.map(re => {
                        return [(re[0]*1112000).toFixed(0)*1, (re[1]*1112000).toFixed(0)*1]
                    })
                    data.push({
                        floor: res.properties.Floor,
                        points: r
                    })
                })
            })
            this._borderData = data
        },
        // 获取模型四至
        _getModelBounds () {
            // 四至： 上右下左
            let bounds = [0,0,0,0]
            // 所有点数组
            let pointArr = []
            // 所有点经度数组
            let pointLonArr = []
            // 所有点纬度数组
            let pointLatArr = []
            // 获取所有点数组
            this._borderData.forEach(res => {
                pointArr = pointArr.concat(res.points)
            })
            // 获取经度、纬度数组
            pointArr.forEach(res => {
                pointLonArr.push(res[0])
                pointLatArr.push(res[1])
            })
            // 获取四至
            bounds = [Math.max(...pointLatArr), Math.min(...pointLonArr), Math.min(...pointLatArr), Math.max(...pointLonArr)]
            this._bounds = bounds
        },
        // 获取模型中心点
        _getModelCenter () {
            let center = [(this._bounds[1] + this._bounds[3])/2,(this._bounds[0] + this._bounds[2])/2]
            this._center = center
        },
        // 数据转换2-将数据移动至原点
        _dataAnalysisAll(){
            this._borderData.forEach(res => {
                res.points.forEach(re => {
                    re[0] = re[0] - this._center[0]
                    re[1] = re[1] - this._center[1]
                })
            })
        },



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
        background: rgba(0, 0, 0, 0.5);
    }
}
</style>