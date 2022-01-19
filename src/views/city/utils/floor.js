import * as THREE from 'three'
import { Earcut } from 'three/src/extras/Earcut.js'

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
    // 这是代码有问题
    createPolygon(positions) {
        if (positions.length < 5) {
            return
        }
        debugger
        var shapePositons = [];
        for (var i = 0; i < positions.length; i++) {
            var position = positions[i];
            shapePositons.push(new THREE.Vector3(position[0], position[1], position[2]));
        }
        var data = [];
        for (var i = 0; i < positions.length; i++) {
            var position = positions[i];
            data.push(position[0], position[1]);
        }
        var faces = [];
        var triangles = Earcut.triangulate(data);
        if (triangles && triangles.length != 0) {
            for (var i = 0; i < triangles.length; i++) {
                var length = triangles.length;
                if (i % 3 == 0 && i < length - 2) {
                    faces.push(new THREE.Face3(triangles[i], triangles[i + 1], triangles[i + 2]));
                }
            }
        }
        var geometry = new THREE.BufferGeometry();
        geometry.vertices = shapePositons;
        geometry.faces = faces;

        const material = new THREE.MeshBasicMaterial({ color: 'green' })
        var mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh)
    }
}


export default Floor
