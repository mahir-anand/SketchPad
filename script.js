// const pad = document.getElementById('pad');
// // const color = document.getElementById('color');
// // const eraser = document.getElementById('eraser');

// let size = 70; //picked up from the selection bar

// // initializing grids
// pad.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
// pad.style.gridTemplateRows = `repeat(${size}, 1fr)`;
// let numOfGrids = size * size;
// for (let i = 0 ; i <numOfGrids ; i++) {
//     let grid = document.createElement('div');
//     // grid.addEventListener('mouseover', changeColor);
//     // grid.addEventListener('mousedown', changeColor);
//     pad.insertAdjacentElement('beforeend',grid);
// }

// // color.addEventListener('click', function () {
// //     color.style.backgroundColor = 'black';
// // })

// colorMode();

// function colorMode() {
//     let grids = document.querySelectorAll('#pad div');
//     for (const grid of grids) {
//         grid.addEventListener('click', function() {
//         grid.style.backgroundColor = 'black'; //picked from color selector
//         })
//     }
// }

// // function eraserMode() {
// //     let grids = document.querySelectorAll('#pad div');
// //     for (const grid of grids) {
// //         grid.addEventListener('click', function() {
// //         grid.style.backgroundColor = 'white'; //picked from color selector
// //         })
// //     }
// // }




let inputValue = document.querySelector('#inputValue')
let textValue = document.querySelector('#textValue');

let getValue = function () {    
    let value = inputValue.value;
    textValue.innerHTML = value + " X " + value;
}

inputValue.addEventListener('input', () => {
    getValue();
})
