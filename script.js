const pad = document.querySelector('#pad');
const inputValue = document.querySelector('#inputValue')
const textValue = document.querySelector('#textValue');
const colorPicker = document.querySelector('#colorPicker');
const color = document.querySelector('#color');
const random = document.querySelector('#random');
const undoBtn = document.querySelector('#undo');
const redoBtn = document.querySelector('#redo');
const eraser = document.querySelector('#eraser');
const clear = document.querySelector('#clear');
const downloadBtn = document.querySelector('#download');

// Undo / Redo state
let undoStack = [];
let redoStack = [];

function saveState() {
    const cells = pad.children;
    return Array.from(cells).map(cell => getComputedStyle(cell).backgroundColor);
}

function applyState(state) {
    const cells = pad.children;
    state.forEach((bg, i) => {
        if (cells[i]) cells[i].style.backgroundColor = bg;
    });
    updateUndoRedoButtons();
}

function updateUndoRedoButtons() {
    undoBtn.disabled = undoStack.length === 0;
    redoBtn.disabled = redoStack.length === 0;
}

// INTITIALIZING GRID
const updateSize = function () {
    let value = inputValue.value;
    pad.style.gridTemplateColumns = `repeat(${value}, 1fr)`;
    pad.style.gridTemplateRows = `repeat(${value}, 1fr)`;
    let numOfGrids = value * value;
    for (let i = 0 ; i < numOfGrids ; i++) {
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

// LET'S BEGIN
updateSize(); // initializes the sketch pad (16 X 16)
color.focus(); // activates color mode
styleActive(); // styles the color button
updateUndoRedoButtons();
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
    undoStack = [];
    redoStack = [];
    updateUndoRedoButtons();
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
pad.addEventListener('mouseover', draw);
pad.addEventListener('mousedown', draw);
pad.addEventListener('click', draw);

// EVENT LISTENER ON THE CLEAR BUTTON
clear.addEventListener('click', () => {
    pad.innerHTML = '';
    updateSize();
    undoStack = [];
    redoStack = [];
    updateUndoRedoButtons();
})

// UNDO / REDO
undoBtn.addEventListener('click', () => {
    if (undoStack.length === 0) return;
    redoStack.push(saveState());
    const prev = undoStack.pop();
    applyState(prev);
})

redoBtn.addEventListener('click', () => {
    if (redoStack.length === 0) return;
    undoStack.push(saveState());
    const next = redoStack.pop();
    applyState(next);
})

// MAIN DRAW FUNCTION -> THREE MODES (color, random, eraser)
function draw(e) {
    if (e.type === 'mousedown') {
        redoStack = [];
        undoStack.push(saveState());
        updateUndoRedoButtons();
    }
    let grid = e.target;
    if (e.type === 'click') {
        if (currentMode == 'color') {
            grid.style.backgroundColor = currentColor;
        } else if (currentMode == 'random') {
            grid.style.backgroundColor = randomColor();
        } else if (currentMode == 'eraser') {
            grid.style.backgroundColor = 'white';
        }
        if (e.target.id == 'pad') {
            e.target.style.backgroundColor = 'white';
            }
    }
    if (mouseDown) {
        if (currentMode == 'color') {
            grid.style.backgroundColor = currentColor;
        } else if (currentMode == 'random') {
            grid.style.backgroundColor = randomColor();
        } else if (currentMode == 'eraser') {
            grid.style.backgroundColor = 'white';
        }
    
    }
}

const randomColor = function () {
    let x = Math.floor(Math.random() * 255) + 1
    let y = Math.floor(Math.random() * 255) + 1
    let z = Math.floor(Math.random() * 255) + 1
    return `rgb(${x},${y},${z})`
}

// DOWNLOAD SKETCH AS PNG
downloadBtn.addEventListener('click', () => {
    const gridSize = Number(inputValue.value);
    const side = 500;
    const cellSize = side / gridSize;

    const canvas = document.createElement('canvas');
    canvas.width = side;
    canvas.height = side;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, side, side);

    const cells = pad.children;
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const bg = getComputedStyle(cell).backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            const col = i % gridSize;
            const row = Math.floor(i / gridSize);
            const x = Math.floor(col * cellSize);
            const y = Math.floor(row * cellSize);
            const w = Math.floor((col + 1) * cellSize) - x;
            const h = Math.floor((row + 1) * cellSize) - y;
            ctx.fillStyle = bg;
            ctx.fillRect(x, y, w, h);
        }
    }

    const link = document.createElement('a');
    link.download = `sketchpad-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
});

