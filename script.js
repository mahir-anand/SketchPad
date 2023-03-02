const pad = document.querySelector('#pad');
const inputValue = document.querySelector('#inputValue')
const textValue = document.querySelector('#textValue');
const colorPicker = document.querySelector('#colorPicker');
const color = document.querySelector('#color');
const random = document.querySelector('#random');
const eraser = document.querySelector('#eraser');
const clear = document.querySelector('#clear');

// INTITIALIZING GRID
const updateSize = function () {
    let value = inputValue.value;
    pad.style.gridTemplateColumns = `repeat(${value}, 1fr)`;
    pad.style.gridTemplateRows = `repeat(${value}, 1fr)`;
    let numOfGrids = value * value;
    for (let i = 0 ; i <numOfGrids ; i++) {
        let grid = document.createElement('div');
        pad.insertAdjacentElement('beforeend',grid);
        }
}

//  STYLE THE ACTIVE MODE
const styleActive = function () {
    color.style.removeProperty('background-color');
    random.style.removeProperty('background-color');
    eraser.style.removeProperty('background-color');
    color.style.removeProperty('color');
    random.style.removeProperty('color');
    eraser.style.removeProperty('color');
    document.activeElement.style.backgroundColor = '#333333';
    document.activeElement.style.color = 'white';
}

// TRACKING MOUSE DOWN OR UP
let mouseDown = false
document.body.onmousedown = () => (mouseDown = true)
document.body.onmouseup = () => (mouseDown = false)

// LET'S START
updateSize(); // initializes the sketch pad (16 X 16)
color.focus(); // activates color mode
styleActive(); // styles the color button
let currentMode = document.activeElement.id; // current mode -> color
let currentColor = colorPicker.value; // current color -> #333333 (default value from HTML)

// UPDATE COLOR EVENT LISTENER
colorPicker.addEventListener('input', () => {
    currentColor = colorPicker.value;
    color.focus();
    document.activeElement.id = 'color';
    currentMode = document.activeElement.id;
    styleActive();
})

// UPDATE GRID SIZE WITH INPUT CHANGE
inputValue.addEventListener('input', () => {
    let value = inputValue.value;
    textValue.innerHTML = value + " X " + value;
    pad.innerHTML = '';
    updateSize();
})

// EVENT LISTENERS ON THE THREE MODES
color.addEventListener('click', () => {
    color.focus();
    currentMode = document.activeElement.id;
    styleActive();
})
random.addEventListener('click', () => {
    random.focus();
    currentMode = document.activeElement.id;
    styleActive();
})
eraser.addEventListener('click', () => {
    eraser.focus();
    currentMode = document.activeElement.id;
    styleActive();
})

// EVENT LISTENER ON THE SKETCH PAD
pad.addEventListener('mouseover', () => {
    draw();
})

// EVENT LISTENER ON THE CLEAR BUTTON
clear.addEventListener('click', () => {
    pad.innerHTML = '';
    updateSize();
})

// MAIN DRAW FUNCTION -> THREE MODES (color, random, eraser)
function draw() {
    pad.addEventListener('mouseover', function() {
        let grid = event.target;
        if (mouseDown) {
            if (currentMode == 'color') {
                grid.style.backgroundColor = currentColor;
            } else if (currentMode == 'random') {
                grid.style.backgroundColor = randomColor();
            } else if (currentMode == 'eraser') {
                grid.style.backgroundColor = 'white';
            }
        }
    })
}

const randomColor = function () {
    let x = Math.floor(Math.random() * 255) + 1
    let y = Math.floor(Math.random() * 255) + 1
    let z = Math.floor(Math.random() * 255) + 1
    return `rgb(${x},${y},${z})`
    }
    



