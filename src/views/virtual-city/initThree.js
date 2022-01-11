import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export function initThree() {
    var scene = new THREE.Scene()

    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.8 );    //环境光
    scene.add( ambientLight );
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.3 );       //直射光
    directionalLight.position.set( 1, 1, 0 ).normalize();
    scene.add( directionalLight );

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