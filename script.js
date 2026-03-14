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
const bgImageInput = document.querySelector('#bgImageInput');
const setBgImageBtn = document.querySelector('#setBgImage');
const removeBgImageBtn = document.querySelector('#removeBgImage');

// Undo / Redo state
let undoStack = [];
let redoStack = [];

// Background image (data URL) or null
let padBackgroundImageUrl = null;

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
    const defaultBg = padBackgroundImageUrl ? 'transparent' : 'white';
    for (let i = 0 ; i < numOfGrids ; i++) {
        let grid = document.createElement('div');
        grid.style.backgroundColor = defaultBg;
        pad.insertAdjacentElement('beforeend', grid);
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

// Background image: open file picker
setBgImageBtn.addEventListener('click', () => bgImageInput.click());

bgImageInput.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
        const dataUrl = reader.result;
        padBackgroundImageUrl = dataUrl;
        pad.style.backgroundImage = `url(${dataUrl})`;
        pad.style.backgroundSize = 'cover';
        pad.style.backgroundPosition = 'center';
        pad.style.backgroundRepeat = 'no-repeat';
        removeBgImageBtn.style.display = '';
        // Make existing white cells transparent so image shows through
        Array.from(pad.children).forEach(cell => {
            const bg = getComputedStyle(cell).backgroundColor;
            if (bg === 'rgb(255, 255, 255)' || bg === 'white') cell.style.backgroundColor = 'transparent';
        });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
});

removeBgImageBtn.addEventListener('click', () => {
    padBackgroundImageUrl = null;
    pad.style.backgroundImage = '';
    pad.style.backgroundSize = '';
    pad.style.backgroundPosition = '';
    pad.style.backgroundRepeat = '';
    pad.style.backgroundColor = 'white';
    removeBgImageBtn.style.display = 'none';
    Array.from(pad.children).forEach(cell => {
        const bg = getComputedStyle(cell).backgroundColor;
        if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') cell.style.backgroundColor = 'white';
    });
});

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
            grid.style.backgroundColor = padBackgroundImageUrl ? 'transparent' : 'white';
        }
        if (e.target.id == 'pad') {
            e.target.style.backgroundColor = padBackgroundImageUrl ? '' : 'white';
        }
    }
    if (mouseDown) {
        if (currentMode == 'color') {
            grid.style.backgroundColor = currentColor;
        } else if (currentMode == 'random') {
            grid.style.backgroundColor = randomColor();
        } else if (currentMode == 'eraser') {
            grid.style.backgroundColor = padBackgroundImageUrl ? 'transparent' : 'white';
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
function doDownload(ctx, canvas, link) {
    const gridSize = Number(inputValue.value);
    const side = 500;
    const cellSize = side / gridSize;
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

    link.download = `sketchpad-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

downloadBtn.addEventListener('click', () => {
    const side = 500;
    const canvas = document.createElement('canvas');
    canvas.width = side;
    canvas.height = side;
    const ctx = canvas.getContext('2d');
    const link = document.createElement('a');

    if (padBackgroundImageUrl) {
        const img = new Image();
        img.onload = () => {
            const iw = img.naturalWidth;
            const ih = img.naturalHeight;
            const scale = Math.max(side / iw, side / ih);
            const sw = iw * scale;
            const sh = ih * scale;
            const sx = (iw - side / scale) / 2;
            const sy = (ih - side / scale) / 2;
            ctx.drawImage(img, sx, sy, side / scale, side / scale, 0, 0, side, side);
            doDownload(ctx, canvas, link);
        };
        img.src = padBackgroundImageUrl;
    } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, side, side);
        doDownload(ctx, canvas, link);
    }
});

