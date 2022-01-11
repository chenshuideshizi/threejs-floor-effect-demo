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

/**
 * 创建一个小球
 * @returns 
 */
export function createBall() {
    // new THREE.SphereGeometry(球半径, 水平分割面的数量, 垂直分割面的数量)
    let ball = new THREE.SphereGeometry( 5 , 32 , 32 ); // 创建小球
    let ballColor = new THREE.MeshPhongMaterial( { color: 0xff0000 } ); //创建材质色，用来给球上色的
    let sphere = new THREE.Mesh( ball , ballColor ); //给球上色
    return sphere
}

export function createGeometry(points = []) {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(points);
    
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    const material = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.DoubleSide } ); // doubleSide 很重要
    const mesh = new THREE.Mesh( geometry, material );

    return mesh 
}

export function createSimgleWall(point1, point2,height = 99) {
    const pointArr = [
        point1[0], 0,  point1[1], // left-bottom
        point1[0], height,  point1[1], // left-top
        point2[0],  height,  point2[1], // right-top

        point2[0],  height,  point2[1], // right-top
        point2[0],  0,  point2[1], // right-bottom
        point1[0],  0,  point1[1], // left-bottom
    ]

    const wall = createGeometry(pointArr);

    return wall 
}

export function createFloor({points, height}) {
    var group = new THREE.Group();
    // 通过地面的平面坐标，生成所有墙面组成的点，点是顺时针
    for(let i = 0, l = points.length; i < l; i++) {
        let wall
        if (i === points.length - 1) {
            wall = createSimgleWall(points[i], points[0], height)
        } else {
            wall = createSimgleWall(points[i], points[i+1], height)
        }
        group.add(wall)
    }

    return group
}

// export function createWall(point1, point2,height = 1) {
//     const geometry = new THREE.BufferGeometry();

//     const walls = []
//     const y = 99
//     for (let i = 0; i  < points.length - 1; i++) {
//         const [x, z] = points[i]
//         verticePoints.push(x, y, z)
//     }
//     const vertices = new Float32Array( [
//         -1.0, -1.0,  2.0,
//          1.0, -1.0,  1.0,
//          1.0,  1.0,  1.0,
    
//          1.0,  1.0,  1.0,
//         -1.0,  1.0,  1.0,
//         -1.0, -1.0,  1.0
//     ] );
    

//     geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
//     const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
//     const mesh = new THREE.Mesh( geometry, material );
//     return mesh

// }
