import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
export default {
    data(){
        return{
            _borderData: [], // 楼房基础数据
            _bounds: [], // 楼房四至
            _center: [] // 楼房中心点
        }
    },
    methods: {

        // 创建场景
        initContainer(borderData) {
            /*创建场景对象Scene*/
            var scene = new THREE.Scene()
            // 添加楼房楼层平面
            this.addFloors(scene, borderData)
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

            function animate() {
                renderer.render(scene, camera)

                let delta = clock.getDelta();
                controls.update(delta);
                requestAnimationFrame(animate)
            }
            animate()
        },

        // 添加楼群
        addFloors(scene, data) {
            // 数据处理/基础数据计算
            this._dataAnalysis(data)
            this._getModelBounds()
            this._getModelCenter()
            this._dataAnalysisAll()
            // 新建楼房组
            var group = new THREE.Group();
            group.rotation.set(-1.6,0,0);
            scene.add(group)
            // 添加楼层
            this._borderData.forEach(res => {
                this.addFloor(group,res)
                // 添加楼房黄色边框墙
                this.createWall(group, res)
            })
        },
        // 添加单个楼
        addFloor (group, data) {
            let shape = this.createShape(data.points)
            let i = 0
            let addG = setInterval(() => {
                if (i<data.floor) {
                    // 添加透明层
                    let mesh;
                    if (i === data.floor || i === 0) {
                        // 添加楼层顶部和底部效果
                        // mesh = this.createPolyline(shape, i, 0.9, 'rgb(14,98,173)')
                    } else {
                        mesh = this.createPolyline(shape, i)
                    }
                    group.add(mesh);
                    // 添加楼层边界
                    this.createPolygonline(group, data.points, i)
                    i++
                } else{
                    if(addG){
                        clearInterval(addG)
                    }
                }
            }, 30)
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

        // 创建平面集合
        createShape (data) {
            var shape = new THREE.Shape();
            data.forEach((e,i) => {
                if (i === 0) {
                    shape.moveTo( ...e);
                } else {
                    shape.lineTo( ...e);
                }
            })
            return shape
        },
        // 创建楼层平面组
        createPolyoneGroup () {
            var group = new THREE.Group();
            group.rotation.set(-1.6,0,0);
            // group.position.set(-30,0,30);
            // group.scale.set(5,5,5);
            return group
        },

        // 创建透明平面
        createPolyline(shape, h, opacity = 0.1, color='rgb(0, 0,255, 0)'){
            var geometry = new THREE.ShapeGeometry( shape );
            var cubeMaterial=new THREE.MeshBasicMaterial({
                color:  color,
                transparent:true,
                opacity:opacity,
                side:THREE.DoubleSide  // 强制双面
            });
            var mesh = new THREE.Mesh( geometry, cubeMaterial );

            mesh.position.z = h*20;
            // mesh.scale.set(1,1,1);
            mesh.scale.set(1,1,1);
            mesh.rotation.set(0,0,0);

            return mesh
        },
        // 创建边缘平面
        createPolygonline(group, data, h=0){
            var material = new THREE.LineBasicMaterial({
                color: 'rgba(53,166,255,0.8)',
                linewidth: 1,
                side:THREE.DoubleSide  // 强制双面
            });
            var geometry = new THREE.Geometry()
            for (let item of data) {
                geometry.vertices.push(
                    new THREE.Vector3(...item, h*20)
                )
            }
            var line = new THREE.Line(geometry, material)
            // line.scale.set(0.8,0.8,1);
            // line.position.set(-10,-10,0);
            group.add(line)
        },

        // 创建墙面
        createWall(group, data){
            var material = new THREE.LineBasicMaterial({
                color: 0xffc000
            });
            let points = data.points
            let wallData = []
            for (let i=0;i< points.length;i++) {
                if(i + 1 < points.length){
                    wallData.push([points[i], points[i+1]])
                }
            }
            for (let item of wallData) {
                var geometry = new THREE.Geometry();
                geometry.vertices.push(
                    new THREE.Vector3( ...item[1], 0 ),
                    new THREE.Vector3( ...item[1], data.floor*20 ),
                    new THREE.Vector3( ...item[0], data.floor*20 ),
                    new THREE.Vector3( ...item[0], 0 ),
                    new THREE.Vector3( ...item[1], 0 )
                );
                var line = new THREE.Line( geometry, material );
                group.add(line)
            }
        },

    }
}