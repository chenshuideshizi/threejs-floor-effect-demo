import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 创建场景
export function initContainer(borderData) {
    var scene = new THREE.Scene()

    // 环境光
    var ambientLight = new THREE.AmbientLight(0xffffff)
    scene.add(ambientLight)

    //创建相机对象
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000000)
    camera.position.set(300, 200, 300)
    camera.lookAt(scene.position)

    // 添加格子辅助线
    let grid = new THREE.GridHelper( 400, 30, 0xcccccc, 0xcccccc );
    scene.add( grid );
    
    // new THREE.SphereGeometry(球半径, 水平分割面的数量, 垂直分割面的数量)
    // let ball = new THREE.SphereGeometry( 5 , 32 , 32 ); // 创建小球
    // let ballColor = new THREE.MeshPhongMaterial( { color: 0xff0000 } ); //创建材质色，用来给球上色的
    // let sphere = new THREE.Mesh( ball , ballColor ); //给球上色
    // scene.add( sphere ); //把球加入到场景


    /**
     * 创建渲染器对象
     */
    var renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    })
    renderer.setSize(window.innerWidth, window.innerHeight)

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

    return {
        scene,
        renderer
    }
}



export function createFloor(floorData) {
    debugger
    var group = new THREE.Group();
    floorData.features.forEach(feature => {
        const {properties} = feature
        const { type, coordinates } = feature.geometry

        const points = transformUnit(coordinates)
        console.log('points', points)

        const shape = createShape(points)
        const mesh = createPolyline(shape)

        group.add(mesh);
    })


    return group

    function transformUnit(coordinates) {
        return coordinates
        // return coordinates.map(item => {
        //     debugger
        //     return item.map(item2 => {
        //         return (item2 * 1112000).toFixed(0) * 1
        //     })
        // })
    }
    function createShape(points) {
        var shape = new THREE.Shape();
        points.forEach((e,i) => {
            if (i === 0) {
                shape.moveTo( ...e);
            } else {
                shape.lineTo( ...e);
            }
        })
        return shape
    }
}

        // 创建透明平面
export function createPolyline(shape, h = 10, opacity = 1, color='rgb(0, 0,255, 0)'){
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
}
        // 创建边缘平面
export function createPolygonline(group, data, h=0){
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
        }