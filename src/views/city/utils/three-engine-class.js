import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

class ThreeEngine {
    constructor(options = {}) {
        if (!options.el) {
            return new Error('options.el is undefined')
        }
        this.options = options
        this.el = typeof options.el === 'object' ? options.el : document.querySelector(options.el)

        this.basePlane = null
        this.isMousedown = false
        this.selected = null

        // 鼠标的当前位置
        const mouse = new THREE.Vector2();
        this.mouse = mouse

        const raycaster = new THREE.Raycaster();

        /**
         * 创建场景
         */
        const scene = new THREE.Scene()

        /**
         * 创建光照效果
         */

        //环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        //直射光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
        directionalLight.position.set(1, 1, 0).normalize();
        scene.add(directionalLight);


        /**
         * 创建相机对象
         */
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000000)
        camera.position.set(300, 200, 300)
        camera.lookAt(scene.position)

        /**
         * 添加格子辅助线
         */
        const grid = new THREE.GridHelper(400, 30, 0xcccccc, 0xcccccc);
        scene.add(grid);

        this.scene = scene
        this.camera = camera

        this.initBasePlane()
        this.initEvent()

        /**
         * 创建渲染器对象
         */
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        })
        renderer.setSize(window.innerWidth, window.innerHeight)

        var controls = new OrbitControls(camera, renderer.domElement)
        controls.target = new THREE.Vector3(0, 0, 0) //控制焦点
        controls.autoRotate = false;//将自动旋转关闭
        let clock = new THREE.Clock();//用于更新轨道控制器

        const self = this
        function render() {
            let delta = clock.getDelta();
            controls.update(delta);
        
        
            // update the picking ray with the camera and mouse position
            raycaster.setFromCamera(mouse, camera);
        
            // calculate objects intersecting the picking ray
            const intersects = raycaster.intersectObjects(scene.children);
        
            if (intersects.length > 0) {
                debugger
                if ( self.selected != intersects[ 0 ].object ) {
                    console.log(intersects[0])
                    if ( self.selected ) self.selected.material.color =  self.selected.currentColor 
        
                    self.selected = intersects[ 0 ].object;
                    self.selected.currentColor = self.selected.material.color;
                    self.selected.material.color.set(0xffffff)
        
        
                    const { x, y, z } = intersects[0].point
                    console.log("x坐标:" + x);
                    console.log("y坐标:" + y);
                    console.log("z坐标:" + z);
        
                }
        
        
        
            } else {
        
                if ( self.selected ) self.selected.material.color = self.selected.currentColor 
        
                self.selected = null;
            }
        
            renderer.render(scene, camera)
            requestAnimationFrame(render)
        }
        render()

        this.el.appendChild(renderer.domElement)
        this.renderer = renderer

    }
    initBasePlane() {
        const basePlane = this.utils.createBasePlane()
        this.basePlane = basePlane
        this.scene.add(basePlane)
    }
    initEvent() {
        const { el } = this
        this.utils.addEvent(el, 'mousedown', onMouseDown.bind(this))
        this.utils.addEvent(el, 'mouseover', onMouseOver.bind(this))
        this.utils.addEvent(el, 'mousemove', onMouseMove.bind(this))
        this.utils.addEvent(el, 'mouseout', onMouseOut.bind(this))

        function onMouseDown(event) {
            this.isMousedown = true
        }

        function onMouseOver(event) {

        }

        function onMouseMove(event) {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        }
        function onMouseOut(event) {

        }
    }
    utils = {
        addEvent(el, type, handler) {
            el.addEventListener(type, handler)
            return {
                remove: el.removeEventListener(type, handler)
            }
        },
        createBasePlane(width = 40, height = 60) {
            const geometry = new THREE.BoxGeometry(width, 1, height);
            const material = new THREE.MeshLambertMaterial({ color:  0xffffff, side: THREE.DoubleSide });
            const cube = new THREE.Mesh(geometry, material);
            cube.name = 'basePlane'

            return cube
        },
        createBall(r = 5) {
            // new THREE.SphereGeometry(球半径, 水平分割面的数量, 垂直分割面的数量)
            let ball = new THREE.SphereGeometry(r, 32, 32); // 创建小球
            let ballColor = new THREE.MeshPhongMaterial({ color: 0xff0000 }); //创建材质色，用来给球上色的
            let sphere = new THREE.Mesh(ball, ballColor); //给球上色
            return sphere
        },
        createBox(width = 1, height = 1, depth = 1) {
            const geometry = new THREE.BoxGeometry(width, height, depth);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const cube = new THREE.Mesh(geometry, material);
            return cube
        },
        createLine(point1, point2) {
            const geometry = new THREE.Geometry();
            const material = new THREE.LineBasicMaterial({ vertexColors: true });
            const color = new THREE.Color(0xFF0000);

            // 线的材质可以由2点的颜色决定
            const p1 = new THREE.Vector3(...point1);
            const p2 = new THREE.Vector3(...point2);
            geometry.vertices.push(p1);
            geometry.vertices.push(p2);
            geometry.colors.push(color, color);

            var line = new THREE.Line(geometry, material);
            return line
        }
    }


}

export default ThreeEngine