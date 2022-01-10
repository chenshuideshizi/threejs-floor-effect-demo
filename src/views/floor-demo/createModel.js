import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
export default {
    data(){
        return{
            _borderData: [], // 楼房基础数据
            _bounds: [ // 楼房四角
                [116.396168,39.997583], // left-top
                [116.397003,39.997604], // right-top
                [116.397066,39.996032], // bottom-right
                [116.396217,39.996001] // bottom-left
            ], 
            _center: [116.396622,39.996875] // 楼房中心点
        }
    },
    created() {

    },
    methods: {
        // 创建场景
        initContainer(borderData) {
            // 创建场景
            var scene = new THREE.Scene()

            // 添加楼房楼层平面
            this.addFloors(scene, borderData)

            // 环境光
            var ambientLight = new THREE.AmbientLight(0xffffff)
            scene.add(ambientLight)

            // 创建相机对象
            var camera = new THREE.PerspectiveCamera(
                45,
                window.innerWidth / window.innerHeight,
                0.1,
                1000000
            )
            camera.position.set(300,200,300)
            camera.lookAt(scene.position)

            // 添加格子辅助线
            let grid = new THREE.GridHelper( 400, 30, 0xcccccc, 0xcccccc );
            scene.add( grid );

            // 创建渲染器对象
            var renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            })
            renderer.setSize(window.innerWidth, window.innerHeight)
            document.getElementById('modelBox').appendChild(renderer.domElement)

            // 控制器
            var controls = new OrbitControls(camera, renderer.domElement)
            controls.target = new THREE.Vector3(0, 0, 0) //控制焦点
            controls.autoRotate = false;//将自动旋转关闭
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
            // 新建楼房组
            var group = new THREE.Group();
            group.rotation.set(-1.6,0,0);
            scene.add(group)
            // 添加楼层
            this._borderData.features.forEach(feature => {
                this.addFloor(group,feature)
                // 添加楼房黄色边框墙
                this.createWall(group, feature)
            })
        },
        // 添加单个楼
        addFloor (group, feature) {
            const coordinates = feature.geometry.coordinates
            const floor = feature.properties.Floor
            const points = coordinates.map(r => {
                // 将度转换为米
                r = r.map(re => {
                    return [(re[0]*1112000).toFixed(0)*1, (re[1]*1112000).toFixed(0)*1]
                })

                return ({
                    floor: Floor,
                    points: r
                })
            })

            let shape = this.createShape(points)
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

        // 创建平面集合
        createShape (points) {
            var shape = new THREE.Shape();
            points.forEach((e,i) => {
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