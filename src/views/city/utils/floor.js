import * as THREE from 'three'
import { Earcut } from 'three/src/extras/Earcut.js'
import { createBox, createLine } from '../shared/extra'

class Floor {
    constructor({ points, height }) {
        debugger
        this.geometry = this.createGeometry(points, height)
        this.material = new THREE.MeshBasicMaterial({ color: 'green', side: THREE.DoubleSide })
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }
    createGeometry(points, height) {
        var topPoints = [];
        for (var i = 0; i < points.length; i++) {
            var vertice = points[i];
            topPoints.push([vertice[0], vertice[1] + height, vertice[2]]);
        }
        var totalPoints = points.concat(topPoints);
        var vertices = [];           //所有的顶点
        for (var i = 0; i < totalPoints.length; i++) {
            vertices.push(new THREE.Vector3(totalPoints[i][0], totalPoints[i][1], totalPoints[i][2]))
        }
        var length = points.length;
        var faces = [];
        for (var j = 0; j < length; j++) {                      //侧面生成三角形
            if (j != length - 1) {
                faces.push(new THREE.Face3(j, j + 1, length + j + 1));
                faces.push(new THREE.Face3(length + j + 1, length + j, j));
            } else {
                faces.push(new THREE.Face3(j, 0, length));
                faces.push(new THREE.Face3(length, length + j, j));
            }
        }
        var data = [];
        for (var i = 0; i < length; i++) {
            data.push(points[i][0], points[i][2]);
        }
        var triangles = Earcut.triangulate(data);
        if (triangles && triangles.length != 0) {
            for (var i = 0; i < triangles.length; i++) {
                var tlength = triangles.length;
                if (i % 3 == 0 && i < tlength - 2) {
                    faces.push(new THREE.Face3(triangles[i], triangles[i + 1], triangles[i + 2]));                            //底部的三角面
                    faces.push(new THREE.Face3(triangles[i] + length, triangles[i + 1] + length, triangles[i + 2] + length));        //顶部的三角面
                }
            }
        }
        var geometry = new THREE.Geometry();
        geometry.vertices = vertices;
        geometry.faces = faces;
        geometry.computeFaceNormals();      //自动计算法向量
        return geometry;
    }
}




//points 三维坐标数组[[x,y,z],[x,y,z],...]
export function createFloorPolygon(points) {
    debugger
    // const  points = [...originPoints, originPoints[0]]

    let groupName = 'floor-polygon-group'
    let newGroup = new THREE.Group()
    newGroup.name = groupName

    // 绘制轨迹
    for (let i = 0, l = points.length; i < l; i++) {

        let p1 = points[i]
        let p2 = points[i + 1]

        // 是否闭合
        if (i === l - 1) {
            p2 = points[0]
        }
        const line = createLine(p1, p2)

        newGroup.add(line)
    }

    points.forEach(point => {
        const boxPoint = createBox(2, 2, 2)
        boxPoint.position.set(0, 0.1, 0)
        boxPoint.userData.drawing = true
        boxPoint.name = 'drawingBox'
        const [x, y, z] = point
        boxPoint.position.set(x, y, z)
        newGroup.add(boxPoint)
    })


    // 区域 
    // 凹进去的形状显示有问题
    const geometry = new THREE.BufferGeometry();
    const verticePoints = []
    for (let i = 1, l = points.length; i < l - 1; i++) {
        verticePoints.push(points[0], points[i], points[i+1])
    }
    const vertices = new Float32Array( verticePoints.flat());

    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    const material = new THREE.MeshBasicMaterial( { color: 'blue', side: THREE.DoubleSide } );
    const mesh = new THREE.Mesh( geometry, material );
    newGroup.add(mesh)


    //  这段代码有问题
    // var shapePositons = [];
    // for (var i = 0; i < points.length; i++) {
    //     var position = points[i];
    //     shapePositons.push(new THREE.Vector3(position[0], position[1], position[2]));
    // }
    // var data = [];
    // for (var i = 0; i < points.length; i++) {
    //     var position = points[i];
    //     data.push(position[0], position[1]);
    // }
    // var faces = [];
    // var triangles = Earcut.triangulate(data);
    // if (triangles && triangles.length != 0) {
    //     for (var i = 0; i < triangles.length; i++) {
    //         var length = triangles.length;
    //         if (i % 3 == 0 && i < length - 2) {
    //             faces.push(new THREE.Face3(triangles[i], triangles[i + 1], triangles[i + 2]));
    //         }
    //     }
    // }
    // var geometry = new THREE.Geometry();
    // geometry.vertices = shapePositons;
    // geometry.faces = faces;
    // const material = new THREE.MeshBasicMaterial( { color: 'blue', side: THREE.DoubleSide } );
    // var mesh = new THREE.Mesh(geometry, material);
    // newGroup.add(mesh)
    return newGroup
}

export default Floor
