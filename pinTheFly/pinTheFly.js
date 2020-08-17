
// create the flies and store them in a document variable: document.flies
function createFlies(){
    var num = Number(document.getElementById("numflies").value);
    if (num > 0){
        // create flies only enters loop if 1 or more flies
        for(var i = 0; i < num; i++){
            document.flies.push( new Fly(rnd('x'), rnd('y')));
        }
    }
}

// draw the living and dead flies on canvas
function drawCanvas(){
    // check to see if all flies have died
    if(document.flies.length === 0) {
        var node = document.getElementsByClassName('result');
        console.log(node);
        node[0].setAttribute('class', 'result visible');
        clearInterval(game);
        document.getElementById("finalEscaped").innerHTML = document.escaped;
        document.getElementById("finalSwatted").innerHTML = document.pinned.length;
    }

    // load canvas 
    var box = document.getElementById("box"),
        ctx = box.getContext('2d');
    
    // clear canvas
    ctx.clearRect(0,0,document.getElementById("box").width,
                  document.getElementById("box").height);

    
    drawFlies(ctx); // living flies
    drawSwatted(ctx); // dead flies 
    
    // check to see if any escaped
    document.flies.forEach(function(fly2){ escaped(fly2);});
    
    // update game counters
    document.getElementById("escaped").innerHTML = document.escaped;
    document.getElementById("pinned").innerHTML = document.pinned.length;
    
}

// draw flies stored in document.flies on canvas
function drawFlies(ctx){
    // load image of living fly
    var img = new Image();
    img.src = "images/fly11.png";
    
    // draw each fly and update its position
    document.flies.forEach(function(val){
        ctx.drawImage(img, val.x, val.y);
        val.update();
    });
    
    // if there are flies still alive play buzzing sound
    if(document.flies.length > 0){
        sndbuzz.currentTime = 0;
        sndbuzz.play();
    }
    else {
        sndbuzz.pause();
    }
}

// draw the swatted flies stored in document.pinned
function drawSwatted(ctx){
    // load image of dead fly
    var img = new Image();
    img.src = "images/fly12.png";
    
    // draw each fly
    document.pinned.forEach(function(val){
        ctx.drawImage(img, val.x, val.y);
    });
}


// generate random x or y for fly
function rnd(xy){
    var max;
    if(xy == 'y') {
        max = document.getElementById("box").height;
    }
    if(xy == 'x'){
        max = document.getElementById("box").width;
    }
    return Math.round(Math.random()* max);
}


// fly object
function Fly(x, y){
    this.x = x;
    this.y = y;
    
    this.thresh = 20; // how close the click has to be to registe as death
    this.maxVel = 5; // max velocity of flies   
    
    // initial random position velocity vectors 
    this.dx = this.vel();
    this.dy = this.vel();
}

// update position and assign new vectors
Fly.prototype.update = function(){
    this.x = this.x + this.dx;
    this.y = this.y + this.dy;
    this.dx =  this.vel();
    this.dy =  this.vel();
};

// generate a random velocity
Fly.prototype.vel = function(){
    return Math.random() > .5 ? Math.random()*this.maxVel : Math.random()*-this.maxVel;
};

// remove fly from fly list - got swatted or escaped
Fly.prototype.gone = function(){
    var idx = document.flies.indexOf(this);
    document.flies.splice(idx,1);
};

// check to see if click swatted a fly
function swatFly(x,y){
    var xOffset = document.getElementById("box").offsetLeft,
        yOffset = document.getElementById("box").offsetTop - document.body.scrollTop,
        xBox = x - xOffset,
        yBox = y - yOffset;

    document.flies.forEach(function(fl){
        if(dist(fl, xBox, yBox) <= fl.thresh){
            fl.gone();
            document.pinned.push(fl);
            sndsquish.currentTime = 0;
            sndsquish.play();
        }
    });
}


// return the distance between the click point and the fly co-ordinates
function dist(fly1, clickx, clicky){
    return Math.sqrt( Math.pow(fly1.x - clickx, 2) + Math.pow(fly1.y - clicky, 2) );
}

// check to see if any flies escaped
function escaped(fl){
    //x axis
    if(fl.x <= 0 || fl.x >= document.getElementById("box").width ){
        fl.gone();
        document.escaped++;
    }
    // y axis
    else if(fl.y <= 0 || fl.y >= document.getElementById("box").height){
        fl.gone();
        document.escaped++;
    }
}