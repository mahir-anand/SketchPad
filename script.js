const pad = document.getElementById('pad');

let size = 16;

pad.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
pad.style.gridTemplateRows = `repeat(${size}, 1fr)`;
let numOfGrids = size * size;

for (let i = 0 ; i <numOfGrids ; i++) {
    let grid = document.createElement('div');
    pad.insertAdjacentElement('beforeend',grid);
}

changeColor();

function changeColor() {
    let grids = document.querySelectorAll('#pad div');
    for (const grid of grids) {
        grid.addEventListener('click', function() {
        grid.style.backgroundColor = 'black';
        })
    }
}





