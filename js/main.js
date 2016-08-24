//me初始化定义为true>>黑棋
//也就是我方为黑棋，电脑为白棋
var me = true;
var isGameOver = false;
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

//总赢法数组
var wins = [];
//初始化三维数组
for (var i = 0; i < 15; i++) {
    wins[i] = [];
    for (var j = 0; j < 15; j++) {
        wins[i][j] = [];
    }
}

//赢法数
var count = 0;
//统计所有横线赢法
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i][j + k][count] = true;
        }
        count++;
    }
}
//统计所有竖线赢法
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[j + k][i][count] = true;
        }
        count++;
    }
}
//统计所有正斜线赢法
for (var i = 0; i < 11; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j + k][count] = true;
        }
        count++;
    }
}
//统计所有反斜线赢法
for (var i = 0; i < 11; i++) {
    for (var j = 14; j > 3; j--) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j - k][count] = true;
        }
        count++;
    }
}

//双方赢法统计数组
var myWin = [];
var computerWin = [];
for (var i = 0; i < count; i++) {
    myWin[i] = 0;
    computerWin[i] = 0;
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

//我的黑棋落子——点击棋盘落子
gobang.addEventListener('click', function (e) {
    //如果游戏结束或者不是我方下棋
    if (isGameOver || !me) {
        return;
    }
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x / 30);
    var j = Math.floor(y / 30);
    //判断是否有棋子
    if (gobangBoard[i][j] == 0) {
        oneStep(i, j, me);
        gobangBoard[i][j] = 1;
        //落子后对赢法进行更新
        for (var k = 0; k < count; k++) {
            //如果第k种赢法在[i][j]这个位置是有子的
            if (wins[i][j][k]) {
                myWin[k]++;
                computerWin[k] = 6;
                //如果第[k]种赢法已经加到5了
                if (myWin[k] == 5) {
                    window.alert('你赢了！');
                    isGameOver = true;
                }
            }
        }
        //如果游戏没有结束
        if (!isGameOver) {
            //换棋子颜色
            me = !me;
            //电脑下棋
            computerAI();
        }

    }
})

//计算机的白棋落子——自动落子
function computerAI() {
    //定义赢法得分，供比较
    var myScore = [];
    var comScore = [];

    //定义最高分数以及对应点的坐标
    var maxScore = 0;
    var x = 0, y = 0;

    //初始化二维数组
    for (var i = 0; i < 15; i++) {
        myScore[i] = [];
        comScore[i] = [];
        for (var j = 0; j < 15; j++) {
            myScore[i][j] = 0;
            comScore[i][j] = 0;
        }
    }
    //遍历棋盘
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            if (gobangBoard[i][j] == 0) {
                for (var k = 0; k < count; k++) {
                    //如果可行，给该赢法加分
                    if (wins[i][j][k]) {
                        //我的赢法加分——黑棋
                        if (myWin[k] == 1) {
                            //如果连上1颗子
                            myScore[i][j] += 200;
                        } else if (myWin[k] == 2) {
                            //如果连上2颗子
                            myScore[i][j] += 400;
                        } else if (myWin[k] == 3) {
                            //如果连上3颗子
                            myScore[i][j] += 3000;
                        } else if (myWin[k] == 4) {
                            //如果连上4颗子
                            myScore[i][j] += 10000;
                        }
                        //计算机的赢法加分——白棋
                        if (computerWin[k] == 1) {
                            //如果连上1颗子
                            comScore[i][j] += 220;
                        } else if (computerWin[k] == 2) {
                            //如果连上2颗子
                            comScore[i][j] += 420;
                        } else if (computerWin[k] == 3) {
                            //如果连上3颗子
                            comScore[i][j] += 3200;
                        } else if (computerWin[k] == 4) {
                            //如果连上4颗子
                            comScore[i][j] += 20000;
                        }
                    }
                }
                //我的最优下法
                if (myScore[i][j] > maxScore) {
                    maxScore = myScore[i][j];
                    x = i;
                    y = j;
                } else if (myScore[i][j] == maxScore) {
                    if (comScore[i][j] > comScore[x][y]) {
                        x = i;
                        y = j;
                    }
                }
                //计算机的最优下法
                if (comScore[i][j] > maxScore) {
                    maxScore = comScore[i][j];
                    x = i;
                    y = j;
                } else if (comScore[i][j] == maxScore) {
                    if (myScore[i][j] > myScore[x][y]) {
                        x = i;
                        y = j;
                    }
                }
            }
        }
    }
    //让计算机落子
    oneStep(x, y, false);
    gobangBoard[x][y] = 2;
    //落子后对赢法进行更新
    for (var k = 0; k < count; k++) {
        //如果第k种赢法在[i][j]这个位置是有子的
        if (wins[x][y][k]) {
            computerWin[k]++;
            myWin[k] = 6;
            //如果第[k]种赢法已经加到5了
            if (computerWin[k] == 5) {
                setTimeout(function(){
                    window.alert('你输了！');
                },700);
                isGameOver = true;
            }
        }
    }
    //如果游戏没有结束
    if (!isGameOver) {
        //换棋子颜色
        me = !me;
    }
}









