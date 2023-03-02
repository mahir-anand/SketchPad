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

let mouseDown = false
document.body.onmousedown = () => (mouseDown = true)
document.body.onmouseup = () => (mouseDown = false)

updateSize();
color.focus();
styleActive();
let currentMode = document.activeElement.id;
let currentColor = colorPicker.value;

// UPDATE COLOR WHEN CHANGED
colorPicker.addEventListener('input', () => {
    currentColor = colorPicker.value;
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
    if (currentMode == 'color') {
        colorMode();
    } else if (currentMode == 'eraser') {
        eraserMode();
    } else if (currentMode == 'random') {
        randomMode();
    } 
})

// COLOR MODE
function colorMode() {
    pad.addEventListener('mouseover', function() {
        let grid = event.target;
        if (mouseDown) {
            grid.style.backgroundColor = currentColor;
            }
        })
    }
// ERASER MODE
function eraserMode() {
    pad.addEventListener('mouseover', function() {
        let grid = event.target;
        if (mouseDown) {
            grid.style.backgroundColor = 'white';
            }
        })
    }

// RANDOM MODE
function randomMode() {
    pad.addEventListener('mouseover', function() {
        let grid = event.target;
        if (mouseDown) {
            grid.style.backgroundColor = randomColor();
            }
        })
    }

    const randomColor = function () {
        let x = Math.floor(Math.random() * 255) + 1
        let y = Math.floor(Math.random() * 255) + 1
        let z = Math.floor(Math.random() * 255) + 1
        return `rgb(${x},${y},${z})`
        }
    

// EVENT LISTENER ON THE CLEAR BUTTON
clear.addEventListener('click', () => {
    pad.innerHTML = '';
    updateSize();
})


