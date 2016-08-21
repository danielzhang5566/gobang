//me初始化定义为true——黑棋
var me = true;
var gobang = document.getElementById('canvas');
var context = gobang.getContext('2d');

//用一个二维数组存储棋盘上的棋子
var gobangBoard = [];
//初始化棋盘，[0]为没有棋子，[1]为黑棋，[2]为白棋
for (var i = 0; i < 15; i++) {
    gobangBoard[i] = [];
    for (var j = 0; j < 15; j++) {
        gobangBoard[i][j] = 0;
    }
}

context.strokeStyle = '#BFBFBF'

var logo = new Image();
logo.src = 'img/shan.png';
//要等图片加载完才能开始画背景
logo.onload = function () {
    //先画背景logo
    context.drawImage(logo, 0, 0, 450, 450);
    //再画棋盘的线
    drawLine();
}

//画棋盘的线
function drawLine() {
    for (var i = 0; i < 15; i++) {
        //画竖线
        context.moveTo(15 + i * 30, 15);
        context.lineTo(15 + i * 30, 435);
        context.stroke();
        //画横线
        context.moveTo(15, 15 + i * 30);
        context.lineTo(435, 15 + i * 30);
        context.stroke();
    }
}

/**
 * 每走一步棋要做的事情：
 * 在canvas上画出黑棋/白棋
 *
 * @param    {int}  i       对应canvas的x
 * @param    {int}   j      对应canvas的y
 * @param    {boolean}  me  代表黑棋(true)还是白棋(false)
 * @returns  void
 */
function oneStep(i, j, me) {
    context.beginPath();
    context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
    context.closePath();
    var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
    if (me) {
        gradient.addColorStop(0, '#0A0A0A');
        gradient.addColorStop(1, '#636766');
    } else {
        gradient.addColorStop(0, '#D1D1D1');
        gradient.addColorStop(1, '#F9F9F9');
    }

    context.fillStyle = gradient;
    context.fill();
}

//点击棋盘落棋子
gobang.addEventListener('click', function (e) {
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x / 30);
    var j = Math.floor(y / 30);
    //判断是否有棋子
    if(gobangBoard[i][j] == 0) {
        oneStep(i, j, me);
        if(me) {
            gobangBoard[i][j] = 1;
            console.log(gobangBoard);
        }else {
            gobangBoard[i][j] = 2;
            console.log(gobangBoard);
        }
        //换棋子颜色
        me = !me;
    }
})











