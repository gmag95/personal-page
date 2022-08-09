document.board = {}

document.game_on = false;

function start_game() {

    if (document.querySelector('#start_button').mode == 'start') {

        document.querySelector('#random_button').disabled=true;

        document.game_on = true;

        document.querySelector('#start_button').innerText='Pause game';
        document.querySelector('#start_button').mode='pause' 

        for (let pos in document.board) {
            document.board[pos].removeEventListener('click', click_cell);
            document.board[pos].removeEventListener('mousedown', traceFunction);
        }

        conway();

    } else {

        document.game_on = false;

        document.querySelector('#start_button').innerText='Resume game';
        document.querySelector('#start_button').mode='start' 

    }
}

async function conway() {

    while (document.game_on) {

        let temp_cells = JSON.parse(JSON.stringify(document.board));

        for (let y=0; y<cell_n; y++) {

            for (let x=0; x<cell_n; x++) {

                let up = (y!=0 ? (y-1)%cell_n : cell_n-1);
                let down = (y!=cell_n-1 ? (y+1)%cell_n : 1);
                let left = (x!=0 ? (x-1)%cell_n : cell_n-1);
                let right = (x!=cell_n-1 ? (x+1)%cell_n : 1);

                let neighbours_n = 0;

                if (temp_cells[[up, x]].state == 1) {
                    neighbours_n++;
                }
                if (temp_cells[[up, right]].state == 1) {
                    neighbours_n++;
                }
                if (temp_cells[[y, right]].state == 1) {
                    neighbours_n++;
                }
                if (temp_cells[[down, right]].state == 1) {
                    neighbours_n++;
                }
                if (temp_cells[[down, x]].state == 1) {
                    neighbours_n++;
                }
                if (temp_cells[[down, left]].state == 1) {
                    neighbours_n++;
                }
                if (temp_cells[[y, left]].state == 1) {
                    neighbours_n++;
                }
                if (temp_cells[[up, left]].state == 1) {
                    neighbours_n++;
                }
                if (temp_cells[[y, x]].state == 1 && (neighbours_n==2 || neighbours_n==3)) {
                    document.board[[y, x]].state = 1;
                    document.board[[y, x]].style.backgroundColor='#778ba5';
                } else if (temp_cells[[y, x]].state == 0 && neighbours_n==3) {
                    document.board[[y, x]].state = 1;
                    document.board[[y, x]].style.backgroundColor='#778ba5';
                } else {
                    document.board[[y, x]].state = 0;
                    document.board[[y, x]].style.backgroundColor='white';
                }
            }
        }

        await new Promise(r => setTimeout(r, 100));

    }
}

function click_cell(evt) {
    document.board[[evt.currentTarget.coord_y, evt.currentTarget.coord_x]].style.backgroundColor='#778ba5';
    document.board[[evt.currentTarget.coord_y, evt.currentTarget.coord_x]].state = 1;
}

function traceFunction (evt) {
    document.addEventListener('mousedown', dragFunctionStart);
    document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', dragFunction);
    })
}

function dragFunctionStart () {
    document.addEventListener('mousemove', dragFunction);
}

function dragFunction (evt) {
    let base_x=document.board[[0, 0]].getBoundingClientRect().x;
    let base_y=document.board[[0, 0]].getBoundingClientRect().y;
    let x_scroll=window.scrollX;
    let y_scroll=window.scrollY;
    let x_client=evt.clientX;
    let y_client=evt.clientY;
    let selected_x=x_client + x_scroll;
    let selected_y=y_client + y_scroll;
    let size = document.board[[0, 0]].getBoundingClientRect().height;
    if (selected_x>base_x + x_scroll && selected_x<document.board[[cell_n-1, cell_n-1]].getBoundingClientRect().right + x_scroll && selected_y>base_y + y_scroll && selected_y<document.board[[cell_n-1, cell_n-1]].getBoundingClientRect().bottom + y_scroll) {
        let coord_x = Math.floor((x_client-base_x)/size);
        let coord_y = Math.floor((y_client-base_y)/size);
        document.board[[coord_y, coord_x]].style.backgroundColor='#778ba5';
        document.board[[coord_y, coord_x]].state = 1
    }
}

function reset () {
    for (let pos in document.board) {
        document.board[pos].style.backgroundColor='white';
        document.board[pos].state=0;
        document.board[pos].addEventListener('click', click_cell);
        document.board[pos].addEventListener('mousedown', traceFunction);
    }
    document.game_on = false;
    document.querySelector('#random_button').disabled=false;
    document.querySelector('#start_button').innerText='Start game';
    document.querySelector('#start_button').mode='start';
}

function random_fill() {
    for (let pos in document.board) {
        let random_outcome = Math.floor(Math.random()*2);
        if (random_outcome == 0){
            document.board[pos].style.backgroundColor='white';
            document.board[pos].state=0;
        } else {
            document.board[pos].style.backgroundColor='#778ba5';
            document.board[pos].state=1;
        }
    }
}

document.querySelector('#start_button').mode='start';
document.querySelector(`#start_button`).addEventListener('click', start_game);

document.querySelector(`#reset_button`).addEventListener('click', reset);

document.querySelector(`#random_button`).addEventListener('click', random_fill);

for (let i=0; i<25; i++) {
    let row = document.createElement('tr');
    document.querySelector('table').appendChild(row);
    for (let j=0; j<25; j++) {
        document.board[[i, j]] = document.createElement('td');
        document.board[[i, j]].style.width='1.2em';
        document.board[[i, j]].style.height='1.2em';
        document.board[[i, j]].style.backgroundColor='white';
        document.board[[i, j]].style.border='1px solid #778ba5';
        document.board[[i, j]].state = 0;
        document.board[[i, j]].coord_y=i;
        document.board[[i, j]].coord_x=j;
        document.board[[i, j]].addEventListener('click', click_cell);
        document.board[[i, j]].addEventListener('mousedown', traceFunction);
        row.appendChild(document.board[[i, j]]);
    }
}

let cell_n = (Object.keys(document.board).length)**0.5