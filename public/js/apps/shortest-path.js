document.start_cell = undefined;

let selected_cell="";

document.closed_list= [];

let border_set = [];

document.board = [];

document.my_heap=[];

document.cellColor=[0,0,150];

import { Lee } from './path-algos/lee.js';

import { Dijkstra } from './path-algos/dijkstra.js';

import { aStar, findMinAStar } from './path-algos/astar.js';

let color=0;

let count=0;

document.timer=0;

let moves=[[0,1],[0,-1],[1,0],[-1,0]];

function remove_outline() {
    if (selected_cell!="" && !(selected_cell[0]==23 && selected_cell[1]==23)) {
        document.board[selected_cell[0]][selected_cell[1]].style.backgroundColor="white";
    }
}

function selected (evt) {
    remove_outline();
    selected_cell=[evt.currentTarget.coord_x, evt.currentTarget.coord_y];
    if (document.querySelector("#start_button").disabled==false && !(selected_cell[0]==23 && selected_cell[1]==23)) {
        evt.currentTarget.style.backgroundColor="grey";
        document.start_cell=[evt.currentTarget.coord_x, evt.currentTarget.coord_y];
        return document.start_cell;
    } 
}

function startFunction (evt) {
    if (document.querySelector("#start_button").innerText=="Start solver" && document.querySelector("select").value!="0") {
        document.timer=0;
        document.querySelector("#start_button").disabled=true;
        document.querySelector("#reset_button").disabled=true;
        document.querySelector("#algo_selector").disabled=true;
        document.querySelector("#end_row").style.display="none";
        document.closed_list.push(document.start_cell);
        for (let row of document.board) {
            for (let cell of row) {
            cell.removeEventListener("click", clickBorder);
            }
        }
        document.removeEventListener("mousedown", dragFunctionStart);
        if (document.querySelector("select").value=="1"&& Lee([document.start_cell])) {
            setTimeout(() => {
                document.timer=0;
                Traceback(23, 23, 0);
            }, document.timer);
        } else if (document.querySelector("select").value=="2"&&Dijkstra()) {
            setTimeout(() => {
                document.timer=0;
                Traceback(23, 23, 0);
            }, document.timer);
        } else if (document.querySelector("select").value=="3"&&aStar()) {
            setTimeout(() => {
                document.timer=0;
                Traceback(23, 23, 0);
            }, document.timer);
        } else {
            setTimeout(() => {
            document.querySelector("#end_row").style.display="flex";
            document.querySelector("#end_row div").innerText="There are no paths available";
            document.querySelector("#reset_button").disabled=false;
            }, document.timer);
        }
    } 
    else if (document.querySelector("#start_button").innerText=="Start solver" && document.querySelector("select").value=="0") {
        document.querySelector("#end_row").style.display="flex";
        document.querySelector("#end_row div").innerText="Select an algorithm";
    }
    else if(selected_cell!="") {
        document.start_cell=[selected_cell[0], selected_cell[1]];
        document.board[selected_cell[0]][selected_cell[1]].style.backgroundColor="yellow";
        document.board[selected_cell[0]][selected_cell[1]].style.userSelect = "none";
        document.board[selected_cell[0]][selected_cell[1]].style.textAlign="center";
        document.board[selected_cell[0]][selected_cell[1]].style.fontSize="0.6em";
        document.board[selected_cell[0]][selected_cell[1]].innerText="S";
        document.querySelector("#start_button").innerText="Start solver";
        document.querySelector("#end_row").style.display="none";
        for (let row of document.board) {
            for (let cell of row) {
            cell.removeEventListener("click", selected);
            }
        }
        for (let row of document.board) {
            for (let cell of row) {
            cell.addEventListener("click", clickBorder);
            }
        }
        document.addEventListener("mousedown", dragFunctionStart);
        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", dragFunction);
            for (let el of border_set) {
                changeNeighbour(el[0], el[1], "remove");
            }
            border_set=[];
        })
    }
}

function clickBorder(evt) {
    document.board[evt.currentTarget.coord_x][evt.currentTarget.coord_y].style.backgroundColor="black";
    changeNeighbour(evt.currentTarget.coord_x, evt.currentTarget.coord_y, "change");
}

function dragFunctionStart () {
    document.addEventListener("mousemove", dragFunction);
}

function dragFunction (evt) {
    let selected_x=document.board[0][0].getBoundingClientRect().x;
    let selected_y=document.board[0][0].getBoundingClientRect().y;
    let x_scroll=window.scrollX;
    let y_scroll=window.scrollY;
    let x_client=evt.clientX;
    let y_client=evt.clientY;
    let base_x=x_client + x_scroll;
    let base_y=y_client + y_scroll;
    let size = document.board[0][0].getBoundingClientRect().height;
    if (base_x>selected_x + x_scroll && base_x<document.board[24][24].getBoundingClientRect().right + x_scroll && base_y>selected_y + y_scroll && base_y<document.board[24][24].getBoundingClientRect().bottom + y_scroll) {
        let coord_y = Math.floor((x_client-selected_x)/size);
        let coord_x = Math.floor((y_client-selected_y)/size);
        if (!(coord_x==document.start_cell[0] && coord_y==document.start_cell[1]) && !(coord_x==23 && coord_y==23)) {
            document.board[coord_x][coord_y].style.backgroundColor="black";
            for (let el of border_set) {
                if (coord_x==el[0]&&coord_y==el[1]) {
                    return null
                }
            }
            border_set.push([coord_x, coord_y]);
        }
    }
}

function reset () {
    document.board[document.start_cell[0]][document.start_cell[1]].innerText="";
    document.board[document.start_cell[0]][document.start_cell[1]].style.userSelect = "auto";
    document.closed_list= [];
    document.start_cell = undefined;
    selected_cell = "";
    document.removeEventListener("mousedown", dragFunctionStart);
    document.querySelector("#start_button").innerText="Validate cell";
    document.querySelector("select").value="0";
    document.querySelector("#end_row").style.display="none";
    document.querySelector("#start_button").disabled=false;
    document.querySelector("#algo_selector").disabled=false;
    document.cellColor=[0,0,130];
    document.my_heap=[];
    for (let row of document.board) {
        for (let cell of row) {
        cell.removeEventListener("click", clickBorder);
        }
    }
    for (let cell of document.querySelectorAll("tr td")) {
        cell.addEventListener("click", selected);
        cell.style.backgroundColor="white";
        cell.neighbours=[];
        changeNeighbour(cell.coord_x, cell.coord_y, "add");
    }
    document.board[23][23].style.backgroundColor="red";
    document.board[23][23].innerText="E";
}

function changeNeighbour(x_input, y_input, change) {
    let coord_x = x_input-1;
    if (coord_x>=0) {
        if (change=="add") {
            document.board[x_input][y_input].neighbours.push([coord_x, y_input]);
        } else {
            count=0;
            for (let el of document.board[coord_x][y_input].neighbours) {
                if (el[0]==x_input && el[1]==y_input) {
                    document.board[coord_x][y_input].neighbours.splice(count, 1);
                    count--;
                }
                count++;
            }
        }
    }
    let coord_y = y_input-1;
    if (coord_y>=0) {
        if (change=="add") {
            document.board[x_input][y_input].neighbours.push([x_input, coord_y]);
        } else {
            count=0;
            for (let el of document.board[x_input][coord_y].neighbours) {
                if (el[0]==x_input && el[1]==y_input) {
                    document.board[x_input][coord_y].neighbours.splice(count, 1);
                    count--;
                }
                count++;
            }
        }
    }
    coord_x = x_input+1;
    if (coord_x<25) {
        if (change=="add") {
            document.board[x_input][y_input].neighbours.push([coord_x, y_input]);
        } else {
            count=0;
            for (let el of document.board[coord_x][y_input].neighbours) {
                if (el[0]==x_input && el[1]==y_input) {
                    document.board[coord_x][y_input].neighbours.splice(count, 1);
                    count--;
                }
                count++;
            }
        }
    }
    coord_y = y_input+1;
    if (coord_y<25) {
        if (change=="add") {
            document.board[x_input][y_input].neighbours.push([x_input, coord_y]);
        } else {
            count=0;
            for (let el of document.board[x_input][coord_y].neighbours) {
                if (el[0]==x_input && el[1]==y_input) {
                    document.board[x_input][coord_y].neighbours.splice(count, 1);
                    count--;
                }
                count++;
            }
        }
    }
}

document.specialCase = (current_x, current_y, neigh_x, neigh_y) => {
    if (!(current_x==document.start_cell[0]&&current_y==document.start_cell[1])&&neigh_x==current_x&&neigh_y==current_y+1&&current_y==document.start_cell[1]&&current_x<document.start_cell[0]) {
        return true;
    }
    return false;
}

document.modifyNeighbour = () => {
    for (let y=document.start_cell[1]+1; y<25; y++) {
        if (document.board[document.start_cell[0]-1][y].style.backgroundColor!="black") {
            let temp_delete = document.board[document.start_cell[0]][y].neighbours.splice(0, 1)[0];
            document.board[document.start_cell[0]][y].neighbours.push(temp_delete);
        }
    }
}

document.inOpenList = (el_x, el_y) => {
    let count=0;
    for (let open_el of document.my_heap) {
        if (open_el[1][0]==el_x&&open_el[1][1]==el_y) {
            return count;
        }
        count++;
    }
    return false;
}

document.findMin = (my_heap) => {
    let min = my_heap[0][0];
    let pos=0;
    let count=0;
    for (let el of my_heap) {
        if (el[0]<min) {
            min = el[0];
            pos=count;
        }
        count++;
    }
    //console.log("Next cell: ", document.my_heap[pos][1]);
    return my_heap.splice(pos, 1)[0];
}

function Traceback (el_x, el_y, steps) {
    if (el_x==document.start_cell[0]&&el_y==document.start_cell[1]) {
        setTimeout(() => {
            document.board[el_x][el_y].style.backgroundColor="red";
            document.querySelector("#end_row").style.display="flex";
            document.querySelector("#end_row div").innerText=`The shortest path is ${steps} steps long`;
            document.querySelector("#reset_button").disabled=false;
        }, document.timer);
        return true;
    }
        setTimeout(() => {document.board[el_x][el_y].style.backgroundColor="red"}, document.timer);
        document.timer+=30;
        let new_x=document.board[el_x][el_y].parent[0];
        let new_y=document.board[el_x][el_y].parent[1];
    Traceback(new_x, new_y, steps+1);
}

document.inClosedList = (el_x, el_y) => {
    for (let closed_el of document.closed_list) {
        if (closed_el[0]==el_x&&closed_el[1]==el_y) {
            return true;
        }
    }
    return false;
}

document.changeColor = () => {
    if (document.cellColor[2]<=246) {
        document.cellColor[2]+=9;
    } else if (document.cellColor[1]<=246) {
        document.cellColor[1]+=9;
    } else if (document.cellColor[0]<=150) {
        document.cellColor[0]+=9;
    }
}

document.querySelector(`#start_button`).addEventListener("click", startFunction);

document.querySelector(`#reset_button`).addEventListener("click", reset);

for (let i=0; i<25; i++) {
    let row = document.createElement("tr");
    row.classList.add(`row${i}`);
    document.querySelector("table").appendChild(row);
    document.board.push([]);
    for (let j=0; j<25; j++) {
        document.board[i].push(document.createElement("td"));
        document.board[i][j].style.width="1.2em";
        document.board[i][j].style.height="1.2em";
        document.board[i][j].style.backgroundColor="white";
        document.board[i][j].style.border="1px solid black";
        document.board[i][j].coord_x=i;
        document.board[i][j].coord_y=j;
        document.start_cell=document.board[i][j].addEventListener("click", selected);
        row.appendChild(document.board[i][j]);
        document.board[i][j].neighbours=[];
        changeNeighbour(i, j, "add");
    }
}

document.board[23][23].style.backgroundColor="red";
document.board[23][23].style.textAlign="center";
document.board[23][23].style.fontSize="0.6em";
document.board[23][23].innerText="E";
document.board[23][23].style.userSelect = "none";
