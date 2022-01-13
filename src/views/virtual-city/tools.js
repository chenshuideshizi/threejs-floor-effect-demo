import * as THREE from 'three'
import Earcut from 'earcut'

export function createBasePlane (width= 40, height = 60) {
    const geometry = new THREE.BoxGeometry( width, 1, height );
    const material = new THREE.MeshBasicMaterial( {color: 'rgba(190,20,128,0.5)', side: THREE.DoubleSide} );
    const cube = new THREE.Mesh( geometry, material );
    return cube
}

export function createBall(r = 5) {
    // new THREE.SphereGeometry(球半径, 水平分割面的数量, 垂直分割面的数量)
    let ball = new THREE.SphereGeometry( r , 32 , 32 ); // 创建小球
    let ballColor = new THREE.MeshPhongMaterial( { color: 0xff0000 } ); //创建材质色，用来给球上色的
    let sphere = new THREE.Mesh( ball , ballColor ); //给球上色
    return sphere
}


// 创建一个坚着的长方体
export function createTest () {
    const length = 12, width = 12;

    const shape = new THREE.Shape();
    shape.moveTo( 0,0 );
    shape.lineTo( 0, width );
    shape.lineTo( length, width );
    shape.lineTo( length, 0 );
    shape.lineTo( 0, 0 );
    
    const extrudeSettings = {
        steps: 2, // 用于沿拉伸样条线深度细分线段的点数
        depth: 4, // 挤出形状的深度
        bevelEnabled: false, // 对形状应用斜切
        bevelThickness: 0, // 斜面进入原始形状的深度
        bevelSize: 1, // 与斜面延伸的形状轮廓的距离
        bevelOffset: 0, // 与倒角开始的形状轮廓的距离
        bevelSegments: 1 // 斜面层数
    };
    
    const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const mesh = new THREE.Mesh( geometry, material ) ;
    return mesh
}

export function createLine(point1, point2) {
    const geometry = new THREE.Geometry();
    const material = new THREE.LineBasicMaterial( { vertexColors: true } );
    const color = new THREE.Color( 0xFF0000 );

    // 线的材质可以由2点的颜色决定
    const p1 = new THREE.Vector3(...point1);
    const p2 = new THREE.Vector3(...point2);
    geometry.vertices.push(p1);
    geometry.vertices.push(p2);
    geometry.colors.push( color, color );

    var line = new THREE.Line( geometry, material );
    return line
}