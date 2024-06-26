// x軸は右方向が正　y軸は下方向が正
var crossoring = "anonymous";
var bg;
var canvas = [];
var context = [];
var rPress = 0; //入力
var lPress = 0;
var uPress = 0;
var dPress = 0;
var road = [];
var imgm;
var imgt;
var imge;
var imgf;
var posx = 100;
var posy = 500;
var nn = 0;
var enemy = [];
var gamemode = 1; //ゲームオーバー判定
var counter = 0; //走行距離

function init() {
    canvas[0] = document.getElementById('canvas');
    canvas[1] = document.getElementById('canvas2');
    context[0] = canvas[0].getContext('2d');
    context[1] = canvas[1].getContext('2d');
    document.addEventListener("keydown", keyDownHandler, false); //キーボードのキーが押されたときそれぞれの関数を呼び出す(204行目)
    document.addEventListener("keyup", keyUpHandler, false);

    imgm = new Image();
    imgm.src = "image0.png";
    imgt = new Image();
    imgt.src = "image2.png";
    imge = new Image();
    imge.src = "image3.png";
    imgf = new Image();
    imgf.src = "image4.png";

    //道路作成
    var s = 2; //始まり         |  |  |                
    var e = 42; //終わり        |  |  |
    var m = 22; //中央線        |  |  |
    var t = 0; //ずらし         |__|__|
     //                         s  m  e


    for (var i = 0; i < 1500; i++) {
        road[i] = new Array(50);
        if (i == 150) t = 1; 
        if (i == 250) t = 0;
        if (i == 450) t = 1;
        if (i == 500) t = 0;
        if (i == 650) t = 1;
        if (i == 750) t = 0;
        if (i == 850) t = -1;
        if (i == 950) t = 0;
        if (i == 1050) t = -1;
        if (i == 1150) t = 0;
        if (i == 1350) t = -1;
        if (i == 1400) t = 0;

        if (i % 5 == 0) { 
            s = s + t;  //tの分だけ道路がずれる
            e = e + t;
            m = m + t;
        }
        for (var f = 0; f < s; f++) {
            road[i][f] = 0; //fがs-1の間道路の左側の幅を0
        }
        road[i][s - 1] = 3; //左境界
        for (var f = s; f < e; f++) {
            road[i][f] = 1; //道路
        }
        road[i][e - 1] = 3; //右境界

        if (i % 20 > 10) {
            road[i][m] = 2; //中央線
        }
        for (var f = e; f < 50; f++) {
            road[i][f] = 0; //fがeから49までの間右側の幅を0
        }
    }

    for (var i = 0; i < 5; i++) {
        enemy[i] = {}; //敵オブジェクト
        enemy[i].n = 0;
        enemy[i].x = getRandomInt(100) + 100;
        enemy[i].y = 700 * i - 3000; //上からくるように設定
        enemy[i].img = (i == 0) ? imgt : imge;
    }
    bg = 1; //背景の初期化
    Onanime();
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max); //Math.random: 0以上1未満の浮動小数点のランダムな数生成
    // 0以上 max 未満の浮動小数点数を生成
}

var yp = 0;

function Onanime() {
    if (gamemode == 1) {
        yp++; //道路のスクロール位置を管理する変数
        counter++;
        posx += rPress; //矢印キーが入力されたときに移動
        posx -= lPress;
        posy += dPress;
        posy -= uPress;
    }

    var xx = Math.round(posx / 8); //Math.round: 小数点以下四捨五入
    var yy = Math.round((800 - posy) / 8); //自分の座標を道路に合わせて変換
    nn = road[yp + yy][xx];
    if (nn == 1 || nn == 2 || nn == 3) { //道路の中にいるかチェック　いなかったらゲームオーバー
    } else {
        gamemode = 0;
    }

    for (i = 0; i < 5; i++) {
        var yoko = Math.abs(enemy[i].x - posx); //敵と自分の距離計算
        var tate = Math.abs(enemy[i].y - posy);
        if (yoko < 32 && tate < 32) { 
            gamemode = 0;
        }
        if (gamemode == 1) {
            enemy[i].y += getRandomInt(5); //敵が下に移動
        } else {
            enemy[i].y -= 10; //ゲームオーバーの時に敵が逃げていく表現
        }
        xx = Math.round(enemy[i].x / 8); //敵の座標を道路に合わせて変換
        yy = Math.round((800 - enemy[i].y) / 8);

        if (enemy[i].y == 0) { //敵が道路以外の場所にいるとき道路を走るように移動
            if (road[yp + yy][xx] != 1) { 
                for (var ii = 0; ii < 100; ii++) {
                    if (road[yp + yy][ii] == 2) {
                        enemy[i].x = ii * 8;
                    }
                }
            }
        }
        if (xx > 0 && yy > 0 && yp + yy < 1400) {
            enemy[i].n = road[yp + yy][xx];
            for (var ii = 0; ii < 100; ii++) {
                if (road[yp + yy][ii] == 2) {  //中央線に近い時ランダムで左右に移動
                    var xt = (i % 2 == 0) ? 4 : -4;
                    if (ii < xx + xt) { //中央線より右側の時
                        enemy[i].x -= 2;
                        enemy[i].y += 2;
                    } else { //中央線より左側の時
                        enemy[i].x += 2;
                        enemy[i].y += 2;
                    }
                }
            }
        }
        if (enemy[i].y > 800) enemy[i].y = -200; //敵が下の画面外に行ったとき上の画面外に配置
    }
    if (yp > 1400) yp = 0; //道路の読み直し
    draw(yp);
    requestAnimationFrame(Onanime); //道路を読み直した際にOnanimeを実行
}

function draw(yp) { //番号毎に色の塗り分け
    context[bg].fillStyle = "Black";
    context[bg].fillRect(0, 0, 800, 800);
    context[bg].fillStyle = "Green"; //黒->緑で背景を緑に
    context[bg].fillRect(0, 0, 800, 800);
    for (var x = 0; x < 100; x++) {
        for (var y = 0; y < 100; y++) {
            if (road[y + yp][x] == 1) {
                context[bg].fillStyle = "Gray";
                context[bg].fillRect(x * 8, 800 - (y * 8), 8, 8);
            }
            if (road[y + yp][x] == 2) {
                context[bg].fillStyle = "white";
                context[bg].fillRect(x * 8, 800 - (y * 8), 8, 8);
            }
            if (road[y + yp][x] == 3) {
                context[bg].fillStyle = "Black";
                context[bg].fillRect(x * 8, 800 - (y * 8), 8, 8);
            }
        }
    }
    context[bg].drawImage(imgm, posx - 32, posy - 32, 64, 64);
    if (gamemode == 0) context[bg].drawImage(imgf, posx - 20, posy - 20, 64, 64);

    for (i = 0; i < 5; i++) {
        context[bg].drawImage(enemy[i].img, enemy[i].x - 32, enemy[i].y - 32, 64, 64);
    }
    context[bg].font = "30px HS UI Gothic";
    context[bg].fillStyle = "Black";
    context[bg].fillText(counter + "m", 10, 50);
    Render();
}

function Render() {
    canvas[1 - bg].style.display = 'none'; //1-bgで元の背景である黒でカウンター表示
    canvas[bg].style.display = 'block';
    bg = 1 - bg;
}

function keyUpHandler(e) {
    if (e.key == "ArrowRight") {
        rPress = 0;
    } else if (e.key == "ArrowLeft") {
        lPress = 0;
    } else if (e.key == "ArrowUp") {
        uPress = 0;
    } else if (e.key == "ArrowDown") {
        dPress = 0;
    }
}

function keyDownHandler(e) {
    if (e.key == "ArrowRight") {
        rPress = 3;
    } else if (e.key == "ArrowLeft") {
        lPress = 3;
    } else if (e.key == "ArrowUp") {
        uPress = 3;
    } else if (e.key == "ArrowDown") {
        dPress = 3;
    }
}

