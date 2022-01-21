import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import Floor from './floor'
import EventBus from '../shared/EventBus'


class ThreeEngine {
    constructor(options = {}) {
        if (!options.el) {
            return new Error('options.el is undefined')
        }

        const DEFAULT_OPTIONS = {
            canvasWidth: window.innerWidth,
            canvasHeight: window.innerHeight,
            planeWidth: 300,
            planeHeight: 200,
            planeColor: 0xFF2F92
        }

        this.options = Object.assign({}, DEFAULT_OPTIONS, options)
        this.el = typeof options.el === 'object' ? options.el : document.querySelector(options.el)

        this.basePlane = null // 地面对象
        this.isMousedown = false
        this.selected = null
        this.drawingPoints = []
        this.status = 1 // 1 展示, 2 绘制区域

        // 鼠标的当前位置
        const mouse = new THREE.Vector2();
        this.mouse = mouse


        /**
         * 创建场景
         */
        const scene = new THREE.Scene()
        this.scene = scene

        this._initLight()

        this._initCamera()

        // this._initHelper()

        this._initBasePlane()

        this._initRender()

        this._initEvent()

    }
    _initRender() {
        const { scene, camera } = this

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        })
        renderer.setSize(this.options.canvasWidth, this.options.canvasHeight)

        var controls = new OrbitControls(camera, renderer.domElement)
        controls.target = new THREE.Vector3(0, 0, 0) //控制焦点
        controls.autoRotate = false; //将自动旋转关闭

        let clock = new THREE.Clock();//用于更新轨道控制器



        const render = () => {
            let delta = clock.getDelta();
            controls.update(delta);

            camera.updateMatrixWorld();



            renderer.render(scene, camera)
            requestAnimationFrame(render)
        }
        render()


        this.renderer = renderer
        this.el.appendChild(renderer.domElement)
    }
    _initCamera() {
        const { scene } = this
        const camera = new THREE.PerspectiveCamera(70, this.options.canvasWidth / this.options.canvasHeight, 0.1, 1000000)
        camera.position.set(300, 200, 300)
        camera.lookAt(scene.position)
        this.camera = camera
    }
    _initLight() {
        const { scene } = this
        // 环境光, 均匀地照亮场景中的所有对象， 不能用于投射阴影，因为它没有方向。
        // const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        // scene.add(ambientLight);

        //直射光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(100, 100, 100).normalize();
        scene.add(directionalLight);

        var directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 50, 'green');
        scene.add(directionalLightHelper);
    }
    _initHelper() {
        const { scene } = this
        // 添加格子辅助线
        const grid = new THREE.GridHelper(400, 30, 0xcccccc, 0xcccccc);
        scene.add(grid);

    }
    _initBasePlane() {
        const { planeWidth, planeHeight, planeColor } = this.options
        const basePlane = this.utils.createBasePlane(planeWidth, planeHeight, planeColor)
        this.basePlane = basePlane
        this.scene.add(basePlane)
    }
    _initEvent() {
        const { el, renderer } = this
        const domElement = renderer.domElement
        this.utils.addEvent(domElement, 'click', onClick.bind(this))
        this.utils.addEvent(domElement, 'mousedown', onMousedown.bind(this))
        this.utils.addEvent(domElement, 'mouseup', onMouseup.bind(this))
        this.utils.addEvent(domElement, 'mouseover', onMouseover.bind(this))
        this.utils.addEvent(domElement, 'mousemove', onMousemove.bind(this))
        this.utils.addEvent(domElement, 'mouseout', onMouseout.bind(this))
        window.addEventListener( 'resize', onWindowResize );

        function onClick(event) {
            const { selected, camera } = this

            if (this.status === 2 && selected) {
                const {x, y, z} = selected.point
                console.log("x坐标:" + x);
                console.log("y坐标:" + y);
                console.log("z坐标:" + z);

                this.bus.$emit('click', {selected}, event)
            }
        }

        function onMousedown(event) {
            this.isMousedown = true

        }

        function onMouseup() {
            
        }

        function onMouseover(event) {

        }

        function onMousemove(event) {
            const { camera, scene } = this
            this.mouse.x = (event.offsetX / this.options.canvasWidth) * 2 - 1;
            this.mouse.y = - (event.offsetY / this.options.canvasHeight) * 2 + 1;

            const raycaster = new THREE.Raycaster();
       
            raycaster.setFromCamera(this.mouse, camera);
            const drawingGroup  = scene.getObjectByName('drawing-group')
            if ( false && drawingGroup) { // TODO:这段代码有问题
                const drawingGroupIntersects = raycaster.intersectObjects(drawingGroup.children);
                if (drawingGroupIntersects.length > 0) {
                    if ( this.selected != drawingGroupIntersects[0] ) {
                        // 浏览模式
                            if ( this.selected ) this.selected.object.material.color.setHex( this.selected.object.currentHex );
                            this.selected = drawingGroupIntersects[0]
                            this.selected.object.currentHex = this.selected.object.material.color.getHex();
                            this.selected.object.material.color.setHex( 0xff0000 );
    
    
                        // const { x, y, z } = intersects[0].point
                        // console.log("x坐标:" + x);
                        // console.log("y坐标:" + y);
                        // console.log("z坐标:" + z);
    
                    } else {
                        if ( this.selected ) this.selected.object.material.color.setHex( this.selected.object.currentHex );
        
                        this.selected = null;
                    }
                }
            } else {
                    const intersects = raycaster.intersectObjects(scene.children);
                    if ( intersects.length > 0 ) {
                        if ( this.selected != intersects[0] ) {
                            // 浏览模式
                                if ( this.selected ) this.selected.object.material.color.setHex( this.selected.object.currentHex );
                                this.selected = intersects[0]
                                this.selected.object.currentHex = this.selected.object.material.color.getHex();
                                this.selected.object.material.color.setHex( 0xff0000 );
        
        
                            // const { x, y, z } = intersects[0].point
                            // console.log("x坐标:" + x);
                            // console.log("y坐标:" + y);
                            // console.log("z坐标:" + z);
        
                        }
        
                    } else {
                        if ( this.selected ) this.selected.object.material.color.setHex( this.selected.object.currentHex );
        
                        this.selected = null;
        
                    }
            }



        }
        function onMouseout(event) {

        }

        function onWindowResize() {

            camera.aspect = this.options.canvasWidth / this.options.canvasHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( canvasWidth, canvasHeight );

        }
    }

    utils = {
        addEvent(el, type, handler) {
            el.addEventListener(type, (e) => {
                // console.log(`Handle Event: ${type}`)
                // console.log(e)
                handler(e)
            })
            return {
                remove: el.removeEventListener(type, handler)
            }
        },
        createBasePlane(width = 40, height = 60, color) {
            const geometry = new THREE.BoxGeometry(width, 1, height);
            const material = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
            const cube = new THREE.Mesh(geometry, material);
            cube.name = 'basePlane'

            return cube
        }
    }
    bus = new EventBus()


}

export default ThreeEngine