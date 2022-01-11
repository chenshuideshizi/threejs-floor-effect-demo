import * as THREE from 'three'
import Earcut from 'earcut'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FaceColors } from 'three'
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

export function createFloor(planePoints) {

}

export function createBall() {
    // new THREE.SphereGeometry(球半径, 水平分割面的数量, 垂直分割面的数量)
    let ball = new THREE.SphereGeometry( 5 , 32 , 32 ); // 创建小球
    let ballColor = new THREE.MeshPhongMaterial( { color: 0xff0000 } ); //创建材质色，用来给球上色的
    let sphere = new THREE.Mesh( ball , ballColor ); //给球上色
    return sphere
}
