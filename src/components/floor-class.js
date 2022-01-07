function createShape(points) {
    const vectorPoints = points.map(point => new THREE.Vector2(...point))
    return new THREE.Shape(vectorPoints)
}

export default class Floor {
    constructor (options) {
        if (!(this instanceof Floor)) {
            return new Floor(options)
        }
        this.options = options
        const shape = createShape(options.points)


    }
}

export const createFloor = (options) => {
    return new Floor(options)
}