/*
****************************************

Made by Primož Pečar, fri vsš 2 letnik
    Kontakt: pppecar@gmail.com
 ʕ•ᴥ•ʔ Pls hire me as a gamedev ʕ•ᴥ•ʔ

****************************************
*/


/*  CREDITS / SHOUT OUT
 * Lanea Zimmerman, dirt tiles used in this game, also the moon and background
 * Buch @ https://opengameart.org/users/buch; the knight as the enemy
 */

//Globalni variabli, uporabljeni čez cel projekt
//Čeprav uporabljam EMCA script 6, je problem na iOS-u, saj mu ni všeč da so globalne spremenjljivke definirane z let/const
//popravil tako da uporabim var
var canvas, ctx, width, height,
    player, enemy, camera,
    hudElements, audio;

var tileSide = 0,
    gravity = 0.2,
    player_hp=3,
    num_of_platforms=5,
    powerJumps=5,
    player_coins=0;

var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

/*
 // keys --> Array za tipke, za telefon in računalnik
 // map --> Array za celotno mapo, potrebno za postavitev elementov
 // tiles --> Array za same slikice, potrebno za izris
 // width/height se nastavita na podlagi resolucije ekrana
 */
const keys = [];
const map = [];
const tiles = [];
let widthCols = -1;
let heightCols = -1;

//Spremenljivka za čekiranje, ali smo na telefonu
let onphone=false;
let shakeEvents=false;

function checkIfRunningOnPhone(){
    //Regex za preverjanje ali je trenutna naprava na telefonu
    window.mobilecheck = function() {
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    };
    return window.mobilecheck();
}

/***************************************** INIT FUNCTIONS *********************************************/
window.onload=init;
function init(){
    initGame();
    draw();
}
/*
* EVENT LISTENERJI ZA SCREEN ROTATE IN KEY KONTROLE
* Ko se stran nalozi, doda update, kateri se konstantno izvaja
* Dodamo resize listener, za rotacijo naprav/ekrana
* Dodamo listenerje za tipke, uporabljamo sicer up,left,right,space
* Za mobile kontrole left, right, action, jump
* */

window.addEventListener("load",function(){
    update();
});
window.addEventListener('resize', handleWindowResize,false);

document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
});

function getRandomIntInclusive(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

/*
 * Inicializacija same igre
 * onphone --> preverimo, če je trenutna naprava telefon, na podlagi tega spremenimo način igranja
 * initCanvas --> nastavimo vse globalne variable, da jih kličemo čez projekt za izris
 * initCamera --> inicializiramo kamero za pogled na svet
 * initPlayer --> inicializiramo playerja, njegove funkcije
 * initTiles --> inicializiramo tile-sette, za izris
 * createTileMap --> naredimo naključno generiranje mape, različni objekti, powerup-i
 * makeMapDynamic --> dodamo različne elemente v že obstoječo mapo
 * generateRandomPowerUps --> dodamo lune, za platforme
 *
 */

const initGame = function(){
    onphone=checkIfRunningOnPhone();
    initCanvas();
    initCamera();
    initHudElements();
    initPlayer();
    initTiles();
    initAudio();
    createTileMap();
    makeMapDynamic();
    generateRandomPowerUps();

    switch(Math.floor( (Math.random()*100)%3+1)) {
        case 1: audio.music.track1.play(); break;
        case 2: audio.music.track2.play(); break;
        case 3: audio.music.track3.play(); break;
    }

    function initCanvas() {
        canvas=document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        width=canvas.width;
        height=canvas.height;
        canvas.tabIndex=1;
        shakeEvents=true;

        /*
         * Zabavna game mehanika, če teseš telefon se ti naključno generira mapa, omogoča lažje platformanje
         *
         */
        if(shakeEvents){
            window.addEventListener('devicemotion', function (e) {
                let x =e.accelerationIncludingGravity.x;
                let y = e.accelerationIncludingGravity.y;
                let z = e.accelerationIncludingGravity.z;
                if(Math.abs(y)>10 && Math.abs(x)>10 && Math.abs(z)){
                    try{
                    window.navigator.vibrate(200);
                    }
                catch(err){
                    //Grd način za reševanje vibrate težav na iOS napravah, sicer deluje normalno
                    }
                    num_of_platforms=0;
                    mytiles.innerHTML=0;
                    createTileMap();
                    makeMapDynamic();
                    clearPlayerArea();
                }
            })
        }

        //Nastavitev velikosti blokcov, spreminja glede na velikost zaslona
        if(height>width){
            tileSide=Math.round(height/25);
        }
        else{
            tileSide=Math.round(width/25);
        }
        //Viewpoint igralca, rabimo za izris igralne površine
        widthCols=Math.ceil(width/tileSide);
        heightCols=Math.ceil(height/tileSide);
    }

    /*
     * Kamera skrbi za "pogled" na določen del sveta in rendera samo tisti specifičen del.
     * Player se vedno nahaja na relativnemCentru (glede na X).
     */
    function initCamera() {
        camera = {
            x: 0,
            y: 0,
            width: canvas.width/tileSide,
            height: canvas.height/tileSide,
            relativeCenter: Math.floor(canvas.width/tileSide/2)
        }
    }

    /*
     * HUDelements vključuje onscreen text za kovančiče, platforme, game over screen, ipd.
     * Na začetku izrišemo samo highscore. Hud updejtamo samo po potrebi, ne vsak frame, da
     * da pridobimo malo na performancah.
     */
    function initHudElements() {
        hudElements = {
            lives: document.getElementById("hp"),
            coins: document.getElementById("coin"),
            platforms: document.getElementById("plat"),
            debug: document.getElementById("debug"),
            gameOverDisplay: document.getElementById("end"),

            update: function() {
                hudElements.lives.innerHTML = player_hp;
                hudElements.coins.innerHTML = player_coins;
                hudElements.platforms.innerHTML=num_of_platforms;
            }
        }
        hudElements.update();
    }

    /*
    *   Naredimo 10000x100 array, v katerega damo na spodnji in zgornji rob tile-e, se uporabi le za začetek, da zgradimo
    *   spawnpoint za igralca, hočemo da je enak.
    *   Dodamo nekaj začetnih elementov, v resnici so se uporabljali za začetno debugganje, rabil sem testirati
    *   collision detection na več različnih situacijah.
    *
     */
    function createTileMap(){
        for(let i=0; i<100; i++){
            if(i===heightCols){
                map.push(Array.apply(null, new Array(100)).map(Number.prototype.valueOf,1));
            }
            else{
                map.push(Array.apply(null, new Array(10000)).map(Number.prototype.valueOf,0));
            }
        }

        const preSet = [
            [0,0,1,0,0],
            [0,1,1,1,0],
            [1,1,1,1,1]];
        for(let x=0; x<20; x++){
            let putWhereX= 16;
            for(let i=0; i<preSet.length; i++){
                for(let j=0; j<preSet[i].length;j++){
                    if(preSet[i][j]==1){
                        map[11+i][putWhereX+j]=1
                    }
                }
            }
            putWhereX+=20
        }
        //Dodamo zgornji del blokcov, tako igralec ne mora ven iz mape
        for(let h=0; h<100000; h++){
                map[1][h]=1;
        }
    }
    return {
        initCanvas
    };

    //Funkcija za inicializacijo tile-ov
    function initTiles(){

        let sky = new Image();
        sky.src="./imgs/sky-temp.png";
        tiles.push(sky);
        let ground = new Image();
        ground.src="./imgs/ground-tile.png";
        tiles.push(ground);
        let walk1 = new Image();
        walk1.src="./imgs/walk1.png";
        tiles.push(walk1);
        let walk2 = new Image();
        walk2.src="./imgs/walk2.png";
        tiles.push(walk2);
        let walk3 = new Image();
        walk3.src="./imgs/walk3.png";
        tiles.push(walk3);
        let walk4 = new Image();
        walk4.src="./imgs/walk4.png";
        tiles.push(walk4);
        let moon = new Image();
        moon.src="./imgs/moon-temp.png";
        tiles.push(moon);
        let sun = new Image();
        sun.src="./imgs/sun.png";
        tiles.push(sun);
        let plpic = new Image();
        plpic.src="./imgs/abomination.png";
        tiles.push(plpic);
        let back_new= new Image();
        back_new.src="./imgs/tree_70x128.png";
        tiles.push(back_new);
        let back_cloud= new Image();
        back_cloud.src="./imgs/back_proper.png";
        tiles.push(back_cloud);
        let speed= new Image();
        speed.src="./imgs/speed.png";
        tiles.push(speed);

    }
    //player size, player speed, player jump
    /*
     * Naredimo mapo dinamično, v tem smislu da nalimamo naključna zaporedja blokcov na različne dele mape
     * potreboval bi testerje, saj se mi zdi da pri premajhnih napravah lahko pride do takega zaporedja, da playerja
     * zapre v kot, iz katerega ne more naprej
     *
     */
    function makeMapDynamic(){
        //bottom line heightCols-6
        //powerup a vsake 30+10 blockov
        //Generacija naključnih zidov
        let numberOfRandomWalls=100;
        let distanceBetweenWalls=30;
        for(let i=0 ;i<numberOfRandomWalls; i++){
            let height = calculateRandomHeight();
            for(let j=0; j<6; j++){
                map[height+j][distanceBetweenWalls]=1
            }
            distanceBetweenWalls+=70+calculateRandomIntervalForPlatforms();
        }
        //Generacija naključnih platform
        let numberofRandomPlatforms=100;
        let distanceBetweenPlatforms=40;
        for(let x=0; x<numberofRandomPlatforms; x++){
            let width = calculatRandomWidth();
            for(let y=0; y<width; y++){
                map[heightCols][distanceBetweenPlatforms+y]=1;
            }
            distanceBetweenPlatforms+=60+calculateRandomIntervalForPlatforms();
        }
        //Generacija naključnih lebdečih platform
        let numberOfFloatingPlatforms=100;
        let distanceBetweenFloatingPlatforms=25;
        for(let j=0; j<numberOfFloatingPlatforms; j++){
            let Rwidth = calculatRandomWidth();
            let Rheight = calculateRandomHeight();
            for(let h=0; h<Rwidth; h++){
                map[Rheight][distanceBetweenFloatingPlatforms+h]=1
            }
            distanceBetweenFloatingPlatforms+=30+calculateRandomIntervalForPlatforms();
        }

        //Generacija kvadratov
        let numberOfSquares=500;
        let distanceBetweenSquares=25;
        for(let j=0; j<numberOfSquares; j++){
            let Rheight = calculateRandomHeight();
            map[Rheight][distanceBetweenSquares]=1;
            map[Rheight][distanceBetweenSquares+1]=1;
            map[Rheight+1][distanceBetweenSquares]=1;
            map[Rheight+1][distanceBetweenSquares+1]=1;
            distanceBetweenSquares+=distanceBetweenSquares+calculateRandomIntervalForPlatforms();
        }
        let numberOftrees=100000;
        let distanceBetweenTrees=40;
        for(let t=0; t<numberOftrees; t++){
            map[heightCols-1][distanceBetweenTrees]=9;
            distanceBetweenTrees+=10;
        }

    }
    //Generacija power-upov, in sicer lune, ki povečajo št. platform ki jih lahko igralec postavi
    function generateRandomPowerUps() {
        let numOfPowerUps=100;
        let distBetwPowerUps=30;
        for(let i=0; i<numOfPowerUps; i++){
            let rHeight=calculateRandomHeight();
            if(!checkIfIsFloor(rHeight,distBetwPowerUps))
                map[rHeight][distBetwPowerUps]=2;
            distBetwPowerUps+=30;
        }
        //Število sonc, globalna valuta v moji videoigri, hvala Andrej
        let numOfCoins=500;
        let distBetwCoin=15;
        for(let j=0; j<numOfCoins; j++) {
            let rHeight = calculateRandomHeight();
            if (!checkIfIsFloor(rHeight, distBetwCoin))
                map[rHeight][distBetwCoin] = 3;
            distBetwCoin += 30;
        }
        //Življena za playerja
        let numOfHearts=100;
        let distBetwHeart=150;
        for(let j=0; j<numOfHearts; j++){
            let rHeight=calculateRandomHeight();
            if(!checkIfIsFloor(rHeight,distBetwHeart))
                map[rHeight][distBetwHeart]=7;
            distBetwHeart+=150;
        }

        let numOfSpeed=10;
        let distBetwSpeed=250;
        for(let j=0; j<numOfSpeed; j++){
            let rHeight=calculateRandomHeight();
            if(!checkIfIsFloor(rHeight,distBetwSpeed))
                map[rHeight][distBetwSpeed]=11;
            distBetwSpeed+=250;
        }
    }
    //Funkcije, za naključne elemente v igri
    function calculateRandomIntervalForPlatforms(){
        return Math.floor((Math.random() * 3)+1);
    }

};

/*
 * Inicializacija igralca, nastavimo hitrost, ali skače, število air jumpov
 * funkcijo za izris
 *
 */
function initPlayer() {
    player = {
        x : 2*widthCols/3,
        y : heightCols/2,
        width : 1,
        height : 1,
        speed : 0.15,
        airborne: false,
        canBuild: false,
        numofjumps: powerJumps,
        draw: function(){
            let onScreenX = this.x - camera.x;
            ctx.drawImage(tiles[8], onScreenX*tileSide, this.y*tileSide, this.width*tileSide, this.height*tileSide);
        }
    }
}

/*
 * Dodal sem zvoke za boljšo uporabniško izkušnjo, edini problem je ta, da na telefonu nemoreš predvajati
 * zvokov brez dovoljenja igralca, za to je to feature, ki je podprt samo na PC-ju.
 *
 */
function initAudio() {
    audio = {}

    let jump1 = new Audio(); jump1.src="./sounds/jump1.wav";
    let jump2 = new Audio(); jump2.src="./sounds/jump2.wav";
    audio.jump1 = jump1;
    audio.jump2 = jump2;
    
    let pickup1 = new Audio(); pickup1.src='./sounds/pickup1.wav';
    let pickup2 = new Audio(); pickup2.src='./sounds/pickup2.wav';
    audio.pickup1 = pickup1;
    audio.pickup2 = pickup2;

    let powerup1 = new Audio(); powerup1.src='./sounds/powerup1.wav';
    let powerup2 = new Audio(); powerup2.src='./sounds/powerup2.wav';
    audio.powerup1 = powerup1;
    audio.powerup2 = powerup2;

    let gamewin = new Audio(); gamewin.src="./sounds/gamewin.mp3";
    let gamelose = new Audio(); gamelose.src="./sounds/gameover.mp3";
    audio.gamewin = gamewin;
    audio.gamelose = gamelose;
    
    let hit1 = new Audio(); hit1.src="./sounds/hit1.wav";
    let hit2 = new Audio(); hit2.src="./sounds/hit2.wav";
    audio.hit1 = hit1;
    audio.hit2 = hit2;

    music = {}
    audio.music = music;

    let track1 = new Audio(); track1.src='./sounds/track1.mp3'; track1.loop = true; track1.volume = 0.35;
    let track2 = new Audio(); track2.src='./sounds/track2.mp3'; track2.loop = true; track2.volume = 0.35;
    let track3 = new Audio(); track3.src='./sounds/track3.mp3'; track3.loop = true; track3.volume = 0.35;
    audio.music.track1 = track1;
    audio.music.track2 = track2;
    audio.music.track3 = track3;
}

/************************** END INIT *********************************/


/* IZRIS VSEGA
*  pobrišemo canvas, izrišemo mapo, izrišemo sovreažnika če je v viewframe-u, izrišemo igralca
*  EDIT: Imel 2 canvasa, enega za background, vendar se je izkazalo, da je to veliko večji preformance hit kot pa gain
*  tako da sem to idejo zanemaril.
* */

const draw = function (){
    ctx.clearRect(0,0, width, height);
    
    drawTileMap();
    
    enemy.movement();
    enemy.collisionWith(player.x, player.y, player.width, player.height);
    enemy.x-=0.15;
    enemy.draw();

    /*let currEnemy=checkIfEnemyInRange();
    if(currEnemy instanceof Object){
        if(Math.floor(currEnemy.x)===Math.floor(player.x) && Math.floor(currEnemy.y)===Math.floor(player.y) ||
            Math.ceil(currEnemy.x)===Math.ceil(player.x) && Math.ceil(currEnemy.y)===Math.ceil(player.y) ||
            Math.floor(currEnemy.x)===Math.floor(player.x) && Math.ceil(currEnemy.y)===Math.ceil(player.y) ||
            Math.ceil(currEnemy.x)===Math.ceil(player.x) && Math.floor(currEnemy.y)===Math.floor(player.y)){
            killPlayer()
        }
        currEnemy.draw();
        currEnemy.movement();
        currEnemy.x-=0.2

    }
    */
    player.draw();

    // draw debug hud
    hudElements.debug.innerHTML = 
        "Player (x,y,air,build): (" + Math.round(player.x*1000)/1000 + "," + Math.round(player.y*1000)/1000 + ",<br />" + player.airborne + "," + player.canBuild + ")<br/>" + 
        "Camera (x,y,rcnt): (" + Math.round(camera.x*1000)/1000 + "," + Math.round(camera.y*1000)/1000 + "," + camera.relativeCenter + ")<br/>" +
        "Misc (mHoldD,nJmpPsbl): (" + mouseHoldDown + "," + nextJumpPossible + ")<br />";

    /*
     * Funkcija za izris same mape, +3, -3 zaradi tega ker moramo pre-renderat vsaj nekaj frame-ov naprej, da je
     * smooth transition med premikanjem.
     * Also sky tile-i se ne rederajo ker samo tolčejo performance, canvas background naredi isti efekt.
     */

    function drawTileMap(){
        let startX = Math.floor(camera.x);
        let endX = startX + camera.width;
        let offsetX = -camera.x + startX;

        for (let h = 0; h < map.length; h++) {
            for (let r = startX-3; r <= endX+3; r++) {
                let tileId = map[h][r];
                let x = (r - startX) + offsetX;
                if(tileId === 1)        ctx.drawImage(tiles[1], x*tileSide, (h-1)*tileSide, tileSide, tileSide);
                else if(tileId === 2)   ctx.drawImage(tiles[6], x*tileSide, (h-1)*tileSide, tileSide, tileSide);
                else if(tileId === 3)   ctx.drawImage(tiles[7], x*tileSide, (h-1)*tileSide, tileSide, tileSide);
                else if(tileId === 7)   ctx.drawImage(tiles[10], x*tileSide, (h-1)*tileSide, tileSide, tileSide);
                else if(tileId === 11)  ctx.drawImage(tiles[11], x*tileSide, (h-1)*tileSide, tileSide, tileSide);
                //else                    ctx.drawImage(tiles[0], x*tileSide, (h-1)*tileSide, tileSide, tileSide);
            }
        }
    }
};

/*
 * Nastavitve za enemy-je, na vsake 30+65*i blokcov en enemy, št. enemijev je omejeno na 100
 */
//let distanceBetweenEnemy=30;
//let num_of_enemy=0;
function generateEnemy(){
    if(enemy == null){
        enemy = initEnemy();
        //distanceBetweenEnemy+=65;
        //num_of_enemy++;
    }
}

/*
 * Preverjane ali je potrebno izrisati sovražnika
 */
function checkIfEnemyInRange(){
    for(let i=0; i<widthCols; i++){
        if(map[0][i] instanceof Object){
            if(map[0][i].x<0){
                map[0][i]=0
            }
            return map[0][i];
        }
    }
}

/*
 * Inicializacija enemija, začne na desnem zgornjem kotu ekrana in se počasi premika levo, med tem se giblje gor in dol
 * Dodan da naredi igro malce težjo, tudi suprise event za začetek
 */
function initEnemy(){
    enemy = {
        x : camera.x+camera.width,
        y : heightCols/2,
        width : 1,
        height : 1,
        speed : generateSpeed(),
        jumping: false,
        walkframe: 0,
        downtime: 9,
        bounced:false,
        draw: function() {
            let onScreenX = this.x - camera.x;
            ctx.drawImage(tiles[5], onScreenX*tileSide, this.y*tileSide, this.width*tileSide, this.height*tileSide);
        },
        movement: function () {
            if(this.bounced){
                this.y-=this.speed;
                this.downtime+=this.speed;
            }
            if(this.downtime>15){
                this.bounced=false;
            }
            if(this.downtime>0 && !this.bounced){
                this.y+=this.speed;
                this.downtime-=this.speed;
            }
            else if(this.downtime<=0){
                this.bounced=true;
            }
        },
        collisionWith: function(othrX, othrY, othrW, othrH) {
            let enem = {x: this.x, y: this.y, width: this.width, height: this.height};
            let othr = {x: othrX, y: othrY, width: othrW, height: othrH};

            if (enem.x < othr.x + othr.width && enem.x + enem.width > othr.x && enem.y < othr.y + othr.height && enem.height + enem.y > othr.y) {
                // collision with othr!
                killPlayer();
            }
        }
    };
    function generateSpeed() { return (Math.random()*0.35)+0.1; }
    return enemy;
}

/*
 * Update funkcija, uporabljamo pravilen igralni način, glede na napravo,
 *  generiramo sovražnike, nastavimo kontrole, izrisujemo, preverjamo ali smo mrtvi, in vseskupaj kličemo šeenkrat
 *
 */
function update(){
    playerControl(onphone);
    clickControl();
    
    generateEnemy();
    controls();

    draw();
    checkIfDied();
    checkIfGameWon();

    requestAnimationFrame(update);
}

/*
 * Inicializacija kontrol za telefon, touchstart in touchend eventi, ko pritisnemo in spustimo
 */

/*
 * Objekt, ki drži event in čekiranje za touch evente
 */
let canDestory ={
    check:false,
    event:null,
};
let mouseHoldDown = false;
function clickControl() {
    //Nov feature, z touch eventi ali mouse clickom lahko uničuješ mapo - preveri če dela na telefonu ?
    if(canDestory.check && !mouseHoldDown){
        mouseHoldDown = true;
        let posX = Math.floor(camera.x+canDestory.event.pageX/tileSide);
        let posY = Math.floor(canDestory.event.pageY/tileSide)+1;
        if(map[posY][posX] === 1 && posY != 1){
            map[posY][posX] = 0;
        }
    }

    if(!canDestory.check) {
        mouseHoldDown = false;
    }
}

let nextJumpPossible = false;
function playerControl(isOnPhone){

    let pressJump = (!isOnPhone && keys[38]) || (isOnPhone && keys[422]);
    let pressBuild = (!isOnPhone && keys[32]) || (isOnPhone && keys[423]);

    if(isCollisionBelow()) {
        player.canBuild = false;
        player.airborne = false;
        player.numofjumps = powerJumps;
        gravity = 0;
        player.y = Math.floor(player.y) + 0.05;
    }

    if(!isCollisionBelow() && !player.airborne) {
        player.canBuild = true;
        player.airborne = true;
    }

    if(isCollisionBelow() && !player.airborne) {
        if(pressJump) {
            audio.jump2.play();
            audio.jump2.currentTime = 0;
            gravity = -0.45;
            player.airborne = true;
            player.canBuild = true;
        }
    }

    if(!isCollisionBelow() && player.numofjumps > 0 && !pressJump){
        nextJumpPossible = true;
    }

    if(player.airborne && nextJumpPossible && pressJump){
        nextJumpPossible = false;
        gravity = -0.5;
        audio.jump2.play();
        audio.jump2.currentTime = 0;
        player.numofjumps--;
    }

    if(player.airborne) {
        gravity += 0.025;
    }

    if(isCollisionAbove()) {
        gravity += 0.25;
        player.y += gravity;
    }

    if(pressBuild && player.canBuild){
        platformCreator();
        player.canBuild = false;
    }

    if(gravity > 0.5) gravity = 0.5;
    if(gravity < -0.5) gravity = -0.5;

    player.y+=gravity;
}

function handleWindowResize() {
    //V primeru da uporabnik spreminja dimenzije okna, se parametri spreminjajo
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    init.initCanvas;
    draw();
}

/*
 * Funkcije za preverjanje, ali je trenuten tile nekaj na čimer lahko stojimo, ali je kovanec, ali je powerup
 */

function checkIfIsFloor(i,j){
    return map[i][j]===1;
}
function checkIfIsSun(i,j){
    return map[i][j]===3;
}
function checkIfIsMoon(i,j){
    return map[i][j]===2;
}
function checkIfIsHeart(i,j){
    return map[i][j]===7;
}
function checkIfIsSpeed(i,j){
    return map[i][j]===11;
}

/*
 * Collision detection, above below deluje skorej ok,
 * levo desno pa je treba spedenat ker se da skočt vmes med polna blocka, čeprav sta čist skup...
 * !!! MANJKA še detekcija pickup itemov !!!
 */

function isCollisionRight() {
    let x = player.x + player.width;
    let y = player.y + player.height;
    let tileX = Math.ceil(x);
    let tileToRight = map[Math.round(y)][tileX];

    if(tileToRight === 1) if(tileX - x < 0.15) return true;

    if(tileToRight !== 0) if(tileX - x < 0) collisionWithSomething(Math.round(y), tileX);

    return false;
}

function isCollisionLeft() {
    let x = player.x;
    let y = player.y + player.height;
    let tileX = Math.floor(x)-1;
    let tileToLeft = map[Math.round(y)][tileX];

    if(tileToLeft === 1) if(x - tileX-1 < 0.15) return true;

    if(tileToLeft !== 0) if(x - tileX-1 < 0) collisionWithSomething(Math.round(y), tileX);

    return false;
}

function isCollisionBelow() {
    let x1 = player.x;
    let x2 = player.x + player.width;
    let y = player.y + player.height;
    let tileY = Math.ceil(player.y + player.height);

    let tileLeft = map[tileY][Math.floor(x1)];
    let tileRight = map[tileY][Math.floor(x2)];

    if(tileLeft === 1 || tileRight === 1) return true;

    if(tileLeft !== 0) collisionWithSomething(Math.floor(x1), tileY);
    if(tileRight !== 0) collisionWithSomething(Math.floor(x2), tileY);

    return false;
}

function isCollisionAbove() {
    let x1 = player.x;
    let x2 = player.x + player.width;
    let y = player.y;
    let tileY = Math.floor(y)+1;

    let tileLeft = map[tileY][Math.floor(x1)];
    let tileRight = map[tileY][Math.floor(x2)];

    if(tileLeft === 1 || tileRight === 1) return true;

    if(tileLeft !== 0) collisionWithSomething(Math.floor(x1), tileY);
    if(tileRight !== 0) collisionWithSomething(Math.floor(x2), tileY);

    return false;
}

function collisionWithSomething(x, y) {
    if(typeof map[y] == 'undefined') return;
    let tileType = map[y][x];
    switch(tileType) {
        case 3: // sun pickup
            map[y][x] = 0;
            audio.pickup1.play();
            audio.pickup1.currentTime = 0;
            player_coins++;
            break;
        case 2: // moon pickup
            map[y][x] = 0;
            audio.pickup2.play();
            audio.pickup2.currentTime = 0;
            num_of_platforms += 2;
            break;
        case 7: // heart pickup
            map[y][x] = 0;
            audio.powerup1.play();
            audio.powerup1.currentTime = 0;
            player_hp++;
            break;
        case 11: // speed pickup
            map[y][x] = 0;
            audio.powerup2.play();
            audio.powerup2.currentTime = 0;
            player.speed += 0.02;
            break;
    }
    hudElements.update();
}

/*
 *  Ko igralec umre in ima še življenj za restart, postavimo parametre HUD-a in repozicioniramo igralca.
 *  Respawn player - respawna igralca nekoliko nazaj, počisti območje in postavi platformo za varen respawn
 */
function respawnPlayer() {
    let tempX = player.x;
    initPlayer();
    player.x = tempX - 10;

    clearPlayerArea();

    let pY = Math.ceil(player.y);
    let pX = Math.ceil(player.x);
    map[pY+2][pX-2]=1;
    map[pY+2][pX-1]=1;
    map[pY+2][pX  ]=1;
    map[pY+2][pX+1]=1;
}

//Funkcija ki preverja ali je igralec padel v luknjo, v primeru da je zmanjšamo življenje in postavimo igralca na neko
// igralno površino, iz katere se bo lahko normalno premikal naprej.
function checkIfDied() {
    if(Math.floor(player.y) > heightCols) {
        audio.hit2.play();
        try {
            window.navigator.vibrate(200);
        } catch(err){
            //Grd način za reševanje vibrate težav na iOS napravah, sicer deluje normalno
        }
        player_hp--;
        hudElements.update();
        respawnPlayer();
    }
    if(player_hp===0){
        try {
            window.navigator.vibrate(1000);
        }
        catch(err){
            //Grd način za reševanje vibrate težav na iOS napravah, sicer deluje normalno
        }
        endGameLose();
    }
}

//Ubijemo igralca, potrebno za kolizijo med sovražnikom
function killPlayer() {
    audio.hit2.play();
    try {
    window.navigator.vibrate(500);
    }
    catch(err){
        //Grd način za reševanje vibrate težav na iOS napravah, sicer deluje normalno
    }
    player_hp--;
    hp.innerHTML=player_hp;
    respawnPlayer();

}

function clearPlayerArea(){
    let pY = Math.ceil(player.y);
    let pX = Math.ceil(player.x);
    
    if(pY <= 3) pY = 5;
    map[pY-1][pX-2]=0;
    map[pY-1][pX-1]=0;
    map[pY-1][pX  ]=0;
    map[pY-1][pX+1]=0;

    map[pY  ][pX-2]=0;
    map[pY  ][pX-1]=0;
    map[pY  ][pX  ]=0;
    map[pY  ][pX+1]=0;
    
    map[pY+1][pX-2]=0;
    map[pY+1][pX-1]=0;
    map[pY+1][pX  ]=0;
    map[pY+1][pX+1]=0;
}

//Nastavimo endgame screen, ugasnim igro na grd način vedar deluje, za ponoven zagon samo refreshamo igro
function endGameLose(){
    let end = document.getElementById("end");
    end.innerHTML="YOU LOST<br> your score was "+player_coins+", <br> You traveled "+Math.floor(player.x)+" blocks";
    audio.gamelose.play();
    ctx=null;

}

function checkIfGameWon(){
    if(parseInt(document.getElementById("coin").innerHTML)>30) {
        let end = document.getElementById("end");
        end.innerHTML = "YOU WON<br> CONGRATS MY DUDE <br> You traveled "+Math.floor(player.x)+"blocks";
        audio.gamewin.play();
        ctx = null;
    }
}

//Kreira platformo, ubistvu powerup, ki nam omogoča da modificiramo mapo
function platformCreator(){
    if(num_of_platforms>0){
        let platY = Math.ceil(player.y)+2;
        let platX = Math.ceil(player.x)-1;
        
        map[platY][platX-2] = 1;
        map[platY][platX-1] = 1;
        map[platY][platX  ] = 1;
        map[platY][platX+1] = 1;
        map[platY][platX+2] = 1;
        num_of_platforms--;

        hudElements.update();
    }
}

function calculateRandomHeight() {
    return Math.floor((Math.random() * (heightCols-7))+4);
}
function calculatRandomWidth(){
    return Math.floor((Math.random()* (widthCols-7))+4);
}

/************************** KONTROLE *****************************/

function initMobileControls(){

    document.getElementById("LEFT").addEventListener("touchstart", function () {
        keys[420]=true
    },{passive:true});
    document.getElementById("LEFT").addEventListener("touchend", function () {
        keys[420]=false
    },{passive:true});
    document.getElementById("RIGHT").addEventListener("touchstart", function () {
        keys[421]=true
    },{passive:true});
    document.getElementById("RIGHT").addEventListener("touchend", function () {
        keys[421]=false
    },{passive:true});
    document.getElementById("JUMP").addEventListener("touchstart", function () {
        keys[422]=true
    },{passive:true});
    document.getElementById("JUMP").addEventListener("touchend", function () {
        keys[422]=false
    },{passive:true});
    document.getElementById("ACTION").addEventListener("touchstart", function () {
        keys[423]=true
    },{passive:true});
    document.getElementById("ACTION").addEventListener("touchend", function () {
        keys[423]=false
    },{passive:true});
    canvas.addEventListener("touchstart", function (e) {
        canDestory.check=true;
        audio.pickup1.play()
        audio.pickup1.pause();
        canDestory.event=e;

    },{passive:true});
    canvas.addEventListener("touchmove", function(e) {
        canDestory.event=e;
    },{passive:true});
    canvas.addEventListener("touchend", function () {
        canDestory.check=false;
        canDestory.event=null;
    },{passive:true});
}

//V primeru da nismo na telefonu pobrišemo dodatne hud elemente
function setPhoneControlsOff(){

    document.getElementById("LEFT").style.display = "none";
    document.getElementById("RIGHT").style.display = "none";
    document.getElementById("JUMP").style.display = "none";
    document.getElementById("ACTION").style.display = "none";
    canvas.addEventListener("mousedown", function (e) {
        canDestory.check=true;
        canDestory.event=e;
    },{passive:true});
    canvas.addEventListener("mousemove", function(e) {
        canDestory.event=e;
    },{passive:true});
    canvas.addEventListener("mouseup", function () {
        canDestory.check=false;
        canDestory.event=null;
    },{passive:true});
}

let initCont=false;
//Izbira kontrol in nastavitev načina igre
const controls = () =>{
    if(onphone){
        if(!initCont){
            initMobileControls();
            initCont=true;
        }
        keyboardControls();
    }
    else if(width>1000){
        if(!initCont){
            setPhoneControlsOff();

            initCont=true;
        }
        keyboardControls();
    }

    function keyboardControls() {
        camera.x = player.x - camera.relativeCenter;
        //desno
        if (keys[39] || keys[421]) {
            if(!isCollisionRight()) {
                player.x+=player.speed;
            }
        }
        //levo
        if (keys[37] || keys[420]) {
            if(!isCollisionLeft()) {
                player.x-=player.speed;
            }
        }
    }
};
