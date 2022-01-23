import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

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
        this._status = 1 // 1 展示, 2 绘制区域

        // 鼠标的当前位置
        const mouse = new THREE.Vector2();
        this.mouse = mouse

        this.objects = [] // 所有的物体


        /**
         * 创建场景
         */
        const scene = new THREE.Scene()
        this.scene = scene

        this._initLight()

        this._initCamera()

        this._initHelper()

        this._initBasePlane()

        this._initRender()

        this._initEvent()

        // 标定中的物体
        const rollOverGeo = new THREE.BoxGeometry(4, 4, 4);
        const rollOverMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true });
        this.rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
        this.rollOverMesh.visible = false
        this.scene.add(this.rollOverMesh);

    }
    get status () {
        return this._status
    }
    set status (val) {
        if  (val === 1) {
            this.rollOverMesh.visible = false
        } else if (val === 2) {
            this.rollOverMesh.visible = true
        }
        this._status = val
    }
    _initRender() {
        const { scene, camera } = this

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        })
        renderer.shadowMap.enabled = true;
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
        camera.position.set(100, 100, 0)
        camera.lookAt(scene.position)
        this.camera = camera
    }
    _initLight() {
        const { scene } = this
        // 环境光, 均匀地照亮场景中的所有对象， 不能用于投射阴影，因为它没有方向。
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        //直射光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(10, 10, 10).normalize();
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.zoom = 40; // tighter shadow map
        
        scene.add(directionalLight);
        this.directionalLight = directionalLight
    }
    _initHelper() {
        const { scene } = this
        // 添加格子辅助线
        const grid = new THREE.GridHelper(200, 50, 0xcccccc, 0xcccccc);
        scene.add(grid);

        // 相机 Helper
        const cameraHelper = new THREE.CameraHelper( this.directionalLight.shadow.camera );
        scene.add( cameraHelper );
    }
    _initBasePlane() {
        const { planeWidth, planeHeight, planeColor } = this.options
        const basePlane = this.utils.createBasePlane(planeWidth, planeHeight, planeColor)
        this.basePlane = basePlane
        this.scene.add(basePlane)
        this.objects.push(this.basePlane)
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
                    const intersects = raycaster.intersectObjects(this.objects);
                    if ( intersects.length > 0 ) {
                        if ( this.selected != intersects[0] ) {
                            // 浏览模式
                            if ( this.selected ) this.selected.object.material.color.setHex( this.selected.object.currentHex );
                            this.selected = intersects[0]
                            this.selected.object.currentHex = this.selected.object.material.color.getHex();
                            this.selected.object.material.color.setHex( 0xff0000 );
    
                            this.rollOverMesh.position.copy(this.selected.point).add(this.selected.face.normal);
                            this.rollOverMesh.position.divideScalar(4).floor().multiplyScalar(4).addScalar(2); // 重点1，实现目标物体在一个网格中
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
            const material = new THREE.MeshPhongMaterial({ color, side: THREE.DoubleSide });
            material.transparent = true 
            material.opacity = 0.5

            const cube = new THREE.Mesh(geometry, material);
            cube.receiveShadow = true;
            cube.name = 'basePlane'

            return cube
        }
    }
    bus = new EventBus()


}

export default ThreeEngine