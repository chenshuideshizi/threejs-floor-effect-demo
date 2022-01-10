import * as THREE from 'three'
export default {
    data(){
        return{

        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initTest()
        })
    },
    methods: {
        initTest() {
            // this.testGeometry()
        },
        testGeometry() {
            // var geometry = new THREE.Geometry();

            // geometry.vertices.push(
            //     new THREE.Vector3( -10,  10, 0 ),
            //     new THREE.Vector3( -10, -10, 0 ),
            //     new THREE.Vector3(  10, -10, 0 )
            // );
            // this.scene.add(geometry)

            const geometry = new THREE.BufferGeometry();
            // create a simple square shape. We duplicate the top left and bottom right
            // vertices because each vertex needs to appear once per triangle.
            const vertices = new Float32Array( [
                -1.0, -1.0,  2.0,
                 1.0, -1.0,  1.0,
                 1.0,  1.0,  1.0,
            
                 1.0,  1.0,  1.0,
                -1.0,  1.0,  1.0,
                -1.0, -1.0,  1.0
            ] );
            
            // itemSize = 3 because there are 3 values (components) per vertex
            geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
            const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
            const mesh = new THREE.Mesh( geometry, material );
            this.scene.add(mesh)
        }

    }
}

