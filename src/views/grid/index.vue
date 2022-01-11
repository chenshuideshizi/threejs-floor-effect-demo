<template>
  <div>
    <canvas id="myCanvas" width="800" height="800"></canvas>
  </div>
</template>

<script>
export default {
  name: "CanvasGrid",
  mounted() {
    this.myCanvs();
  },
  methods: {
    myCanvs() {
      /*获取元素*/
      var myCanvas = document.querySelector("#myCanvas");
      /*获取绘图工具*/
      var ctx = myCanvas.getContext("2d");

      /*
            1. 设置网格的大小，gridSize用于确定网格之中的线之间的间隔
            2. 获取Canvas的宽度width、高度height，用于计算x轴、y轴需要绘画的条数
            3. 采用遍历的方式，绘画x轴的线条
            4. 采用遍历的方式，绘画y轴的线条
            */

      // 1. 设置网格大小
      var girdSize = 20;

      // 2. 获取Canvas的width、height
      var CanvasWidth = ctx.canvas.width;
      var CanvasHeight = ctx.canvas.height;

      // 3. 采用遍历的方式，绘画x轴的线条
      var xLineTotals = Math.floor(CanvasHeight / girdSize); // 计算需要绘画的x轴条数
      for (var i = 0; i < xLineTotals; i++) {
        ctx.beginPath(); // 开启路径，设置不同的样式
        ctx.moveTo(0, girdSize * i - 0.5); // -0.5是为了解决像素模糊问题
        ctx.lineTo(CanvasWidth, girdSize * i - 0.5);
        if (i === Math.floor(xLineTotals / 2)) {
          ctx.strokeStyle = "#000";
        } else {
          ctx.strokeStyle = "red";
        }

        ctx.fillText(i + 1, 0, girdSize * i + 2); //绘制横坐标：文字，x轴,y轴

        ctx.stroke();
      }

      // 4.采用遍历的方式，绘画y轴的线条
      var yLineTotals = Math.floor(CanvasWidth / girdSize); // 计算需要绘画y轴的条数
      for (var j = 0; j < yLineTotals; j++) {
        ctx.beginPath();
        ctx.moveTo(girdSize * j, 0);
        ctx.lineTo(girdSize * j, CanvasHeight);
        // 判断是否是中间的线
        if (j === Math.floor(yLineTotals / 2)) {
          ctx.strokeStyle = "#000";
        } else {
          ctx.strokeStyle = "red";
        }
        ctx.fillText(j + 1, girdSize * j - 2, CanvasHeight); //绘制横坐标：文字，x轴,y轴
        ctx.stroke();
      }
    },
    init() {
      var cols = [0, 1, 2, 3, 4, 5, 6]; //纵坐标
      var rows = [0, 1, 2, 3, 4, 5, 6]; //横坐标
      var step = 50; //像素跨度
      var h = 50; //margin-top
      var l = 50; //margin-left

      function draw() {
        var c = document.getElementById("chess");
        var cxt = c.getContext("2d"); //获取一个画笔
        cxt.font = "bold 13px Arial"; //画笔样式

        for (var i = 0; i < 7; i++) {
          cxt.fillText(cols[i], l + i * step, h - 10); //绘制横坐标：文字，x轴,y轴
        }

        for (var i = 0; i < 7; i++) {
          cxt.fillText(rows[i], l - 20, step * i + h + 5); //绘制纵坐标
        }

        cxt.beginPath();

        for (var i = 0; i < 7; i++) {
          //绘制行
          cxt.moveTo(l, i * step + h); //移动
          cxt.lineTo(step * 6 + l, i * step + h); //画线
        }

        for (var i = 0; i < 7; i++) {
          //绘制列
          cxt.moveTo(l + i * step, h); //移动
          cxt.lineTo(l + i * step, step * 6 + h); //画线
        }

        cxt.closePath(); //闭环
        cxt.stroke(); //绘制
      }
      draw();
    },
  },
};
</script>