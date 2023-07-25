const canvas = document.querySelector("#ballCircleCanvas");

canvas.style.background = "ivory";

let context = canvas.getContext("2d");

const windowHeight = window.innerHeight / 3;
const windowWidth = window.innerWidth;

canvas.height=windowHeight;
canvas.width=windowWidth;

const stopBarX = windowWidth * .75;
const stopBarWidth = 15;
var noteTracker = 2;

const allKeys = document.querySelectorAll(['.whiteKey','.blackKey']);

const scale1 = ["C", "D", "E", "F", "G", "A", "B","C2"];

var notes = []

const frame = document.querySelector("#frame");
const welcomeBox = document.querySelector('#welcomeBox');
const fNnameInput = document.querySelector('#fNameInput');
const namePrompt = document.querySelector('#nameInput');
const resultsSection = document.querySelector("#resultsSection");
const restartButton = document.querySelector("#restartButton");

var gameLost = false;


class MusicNote {
    constructor(note,xpos,ypos,radius,color,speed){
        this.xpos = xpos;
        this.ypos = ypos;
        this.note = note;
        this.radius = radius;
        this.color = color;
        this.speed = speed;

        this.dx = 1 * this.speed;
        this.dy = 1 * this.speed;

    }
    draw(context){
        context.beginPath();
        context.strokeStyle = "black";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "40px Arial";
        context.fillText(this.note,this.xpos,this.ypos);
        context.arc(this.xpos,this.ypos,this.radius,0,Math.PI * 2,false);
        context.stroke();
        context.closePath();
    }

    drawError(context){
        context.beginPath();
        context.strokeStyle = "red";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "40px Arial";
        context.fillText(this.note,this.xpos,this.ypos);
        context.arc(this.xpos,this.ypos,this.radius,0,Math.PI * 2,false);
        context.stroke();
        context.closePath();
    }

    update(){
        if (this.xpos <= "662"){
            this.draw(context);
        }
        else
        {
            this.drawError(context);
            gameLost = 'true';
        }
        this.xpos += this.dx;

    }
} 


const updateNotes = function () {
    if (notes.length == 0 &&  frame.style.display==''){
        frame.style.display='none';
        canvas.style.display='none';
        welcomeBox.style.display='none';
        resultsSection.style.display='';
        restartButton.style.display='';
        if(gameLost){
            resultsSection.innerText=":( unsuccessful " + fNnameInput.value + " missed a note";
            resultsSection.style.border ='2px solid red';
            
        }
        else{
            resultsSection.innerText= "Congrats, " + fNnameInput.value +'! You completed the scale';
        }
    }
    else{
        for (let i = 0; i < notes.length; i++){
            notes[i].update();
            }
        
    }
}

const keyClicked = (Event) => {
    var audio = new Audio('./soundFiles/piano_' + Event.currentTarget.id + '_major.wav');
    audio.play();
    if (Event.currentTarget.id==(notes[0].note)){
        notes.shift();
    }
}

for (let i = 0; i < allKeys.length; i++){
    allKeys[i].addEventListener('click',keyClicked);
};


let drawRectangle = function () {
    context.beginPath();
    context.fillRect(stopBarX, 0, stopBarWidth, windowHeight );
    context.stroke();
    context.closePath();
    
}

let getNameStartGame = function(){
    frame.style.display='none';
    canvas.style.display='none';
    welcomeBox.style.display='none';
    resultsSection.style.display='none';
    restartButton.style.display='none';
}


let updateCircle = function() {
    requestAnimationFrame(updateCircle);
    context.clearRect(0,0,windowWidth,windowHeight);
    updateNotes();
    drawRectangle();
}
  

document.querySelector('#fNameInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && fNnameInput.value != '') {
        frame.style.display='';
        canvas.style.display='';
      // code for enter
        welcomeBox.style.display='';
        namePrompt.style.display='none';
        welcomeBox.innerText = welcomeBox.innerText + ' ' + fNnameInput.value + '!';
        for (let i = 0; i < scale1.length; i++){
            var note = new MusicNote(scale1[i], (-150 * i) + 350 ,100,50,"black",2);
            note.draw(context);
            notes.push(note);
        } 
    }
});

document.querySelector('#restartButton').addEventListener('click', function (e) {
       getNameStartGame();
       namePrompt.style.display='';
       fNnameInput.value='';
       welcomeBox.innerText = 'Welcome';
       updateCircle();
});


getNameStartGame();
updateCircle();