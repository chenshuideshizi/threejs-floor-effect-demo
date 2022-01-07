import * as THREE from 'three'
function createShape(points) {
    const vectorPoints = points.map(point => new THREE.Vector2(...point))
    return new THREE.Shape(vectorPoints)
}

function createPolyline(shape) {
    var geometry = new THREE.ShapeGeometry(shape);
    var cubeMaterial = new THREE.MeshBasicMaterial({
        color: 'red',
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide  // 强制双面
    });
    var mesh = new THREE.Mesh(geometry, cubeMaterial);

    mesh.position.z = 1 * 20;
    // mesh.scale.set(1,1,1);
    mesh.scale.set(1, 1, 1);
    mesh.rotation.set(0, 0, 0);

    return mesh
}

export default class Floor {
    constructor (options) {
        if (!(this instanceof Floor)) {
            return new Floor(options)
        }
        this.options = options
        var group = new THREE.Group();
        const shape = createShape(options.points)
        const mesh = createPolyline(shape)
        group.add(mesh)
        this.group = group
    }
}

export const createFloor = (options) => {
    return new Floor(options).group
}