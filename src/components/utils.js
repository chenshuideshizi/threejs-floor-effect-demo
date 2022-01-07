import * as THREE from 'three'

// 创建平面集合
export function createShape(data) {
    var shape = new THREE.Shape();
    data.forEach((e, i) => {
        if (i === 0) {
            shape.moveTo(...e);
        } else {
            shape.lineTo(...e);
        }
    })
    return shape
}

// 创建楼层平面组
export function createPolyoneGroup() {
    var group = new THREE.Group();
    group.rotation.set(-1.6, 0, 0);
    // group.position.set(-30,0,30);
    // group.scale.set(5,5,5);
    return group
}

// 创建透明平面
export function createPolyline(shape, h, opacity = 0.1, color = 'rgb(0, 0,255, 0)') {
    var geometry = new THREE.ShapeGeometry(shape);
    var cubeMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: opacity,
        side: THREE.DoubleSide  // 强制双面
    });
    var mesh = new THREE.Mesh(geometry, cubeMaterial);

    mesh.position.z = h * 20;
    // mesh.scale.set(1,1,1);
    mesh.scale.set(1, 1, 1);
    mesh.rotation.set(0, 0, 0);

    return mesh
}
// 创建边缘平面
export function createPolygonline(group, data, h = 0) {
    var material = new THREE.LineBasicMaterial({
        color: 'rgba(53,166,255,0.8)',
        linewidth: 1,
        side: THREE.DoubleSide  // 强制双面
    });
    // var geometry = new THREE.Geometry() // API 已废弃
    var geometry = new THREE.BufferGeometry()
    for (let item of data) {
        geometry.vertices.push(
            new THREE.Vector3(...item, h * 20)
        )
    }
    var line = new THREE.Line(geometry, material)
    // line.scale.set(0.8,0.8,1);
    // line.position.set(-10,-10,0);
    group.add(line)
}

// 创建墙面
export function createWall(group, data) {
    var material = new THREE.LineBasicMaterial({
        color: 0xffc000
    });
    let points = data.points
    let wallData = []
    for (let i = 0; i < points.length; i++) {
        if (i + 1 < points.length) {
            wallData.push([points[i], points[i + 1]])
        }
    }
    for (let item of wallData) {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3(...item[1], 0),
            new THREE.Vector3(...item[1], data.floor * 20),
            new THREE.Vector3(...item[0], data.floor * 20),
            new THREE.Vector3(...item[0], 0),
            new THREE.Vector3(...item[1], 0)
        );
        var line = new THREE.Line(geometry, material);
        group.add(line)
    }
}

// 添加楼群
export function addFloors(scene, data) {
    // 数据处理/基础数据计算
    // this._dataAnalysis(data)
    // this._getModelBounds()
    // this._getModelCenter()
    // this._dataAnalysisAll()
    // 新建楼房组
    var group = new THREE.Group();
    group.rotation.set(-1.6, 0, 0);
    scene.add(group)
    // 添加楼层
    data.features.forEach(floorConfig => {
        console.log('floorConfig', floorConfig)
        addFloor(group, floorConfig)
        // 添加楼房黄色边框墙
        // this.createWall(group, res)
    })
}
// 添加单个楼
export function addFloor(group, data) {
    debugger
    let shape = createShape(data.points)
    for (let i = 0; i < data.floor; i++) {
        // 添加透明层
        let mesh
        if (i === data.floor || i === 0) {
            // 添加楼层顶部和底部效果
            // mesh = this.createPolyline(shape, i, 0.9, 'rgb(14,98,173)')
        } else {
            mesh = this.createPolyline(shape, i)
        }
        group.add(mesh);
        // 添加楼层边界
        createPolygonline(group, data.points, i)
    }
}