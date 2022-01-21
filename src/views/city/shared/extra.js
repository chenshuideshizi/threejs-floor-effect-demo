import * as THREE from 'three'
import { Earcut } from 'three/src/extras/Earcut.js'

export function _renderDrawingPoints() {
    let groupName = 'drawing-group'
    let oldGroup = this.scene.getObjectByName(groupName)
    if (oldGroup) {
        this.scene.remove(oldGroup)
    }
    let newGroup = new THREE.Group()
    newGroup.name = groupName

    // 绘制轨迹

    for (let i = 0, l = this.drawingPoints.length; i < l; i++) {
        // 是否闭合
        if (i === l - 1) {
            break
        }
        let p1 = this.drawingPoints[i]
        let p2 = this.drawingPoints[i + 1]
        const line = this.utils.createLine(p1, p2)

        newGroup.add(line)
    }

    this.drawingPoints.forEach(point => {
        const boxPoint = this.utils.createBox(2, 2, 2)
        boxPoint.position.set(0, 0.1, 0)
        boxPoint.userData.drawing = true
        boxPoint.name = 'drawingBox'
        const [x, y, z] = point
        boxPoint.position.set(x, y, z)
        newGroup.add(boxPoint)
    })
    this.scene.add(newGroup)

}

export function createBall(r = 5) {
    // new THREE.SphereGeometry(球半径, 水平分割面的数量, 垂直分割面的数量)
    let ball = new THREE.SphereGeometry(r, 32, 32); // 创建小球
    let ballColor = new THREE.MeshPhongMaterial({ color: 0xff0000 }); //创建材质色，用来给球上色的
    let sphere = new THREE.Mesh(ball, ballColor); //给球上色
    return sphere
}

export function createBox(width = 1, height = 1, depth = 1) {
    const geometry = new THREE.BoxGeometry( width, height, depth );
    const material = new THREE.MeshStandardMaterial( { color:  0x0096FF })
    const cube = new THREE.Mesh( geometry,  material);
    return cube
}

export function createLine(point1, point2) {
    const geometry = new THREE.Geometry();
    const material = new THREE.LineBasicMaterial({ vertexColors: true, linewidth: 1 });
    const color = new THREE.Color(0x424242);

    // 线的材质可以由2点的颜色决定
    const p1 = new THREE.Vector3(...point1);
    const p2 = new THREE.Vector3(...point2);
    geometry.vertices.push(p1);
    geometry.vertices.push(p2);
    geometry.colors.push(color, color);

    var line = new THREE.Line(geometry, material);
    return line
}