function aStar () {
    for (let row of document.board) {
        for (let cell of row) {
            cell.g = Infinity;
            cell.f = Infinity;
            cell.h = (Math.abs(cell.coord_x-23)**2+Math.abs(cell.coord_y-23)**2)**0.5;
        }
    }

    document.board[document.start_cell[0]][document.start_cell[1]].g=0;
    document.board[document.start_cell[0]][document.start_cell[1]].f=document.board[document.start_cell[0]][document.start_cell[1]].g+document.board[document.start_cell[0]][document.start_cell[1]].h;

    let current_x=document.start_cell[0];
    let current_y=document.start_cell[1];

    document.my_heap.push([document.board[document.start_cell[0]][document.start_cell[1]].f,[document.start_cell[0], document.start_cell[1]]]);

    while (document.my_heap.length>0) {
        for (let neighbour of document.board[current_x][current_y].neighbours) {
            let temp_x=current_x;
            let temp_y=current_y;
            if (!(document.inClosedList(neighbour[0], neighbour[1])) && document.board[current_x][current_y].g+1<document.board[neighbour[0]][neighbour[1]].g) {
                document.board[neighbour[0]][neighbour[1]].parent=[current_x, current_y];
                if (neighbour[0]==23&&neighbour[1]==23) {
                    return true;
                }
                document.board[neighbour[0]][neighbour[1]].g=document.board[current_x][current_y].g+1;
                document.board[neighbour[0]][neighbour[1]].f=document.board[neighbour[0]][neighbour[1]].g+document.board[neighbour[0]][neighbour[1]].h;
                let temp_result = document.inOpenList(neighbour[0], neighbour[1]);
                if (!temp_result==false) {
                    document.my_heap[temp_result][0]=document.board[neighbour[0]][neighbour[1]].f;
                } else {
                    document.my_heap.push([document.board[neighbour[0]][neighbour[1]].f, [neighbour[0], neighbour[1]]]);
                }
                setTimeout(() => {
                    document.board[neighbour[0]][neighbour[1]].style.backgroundColor="rgb(0,71,171)";
                }, document.timer);
                document.timer+=20;
            }
            setTimeout(() => {
                if (!(temp_x==document.start_cell[0]&&temp_y==document.start_cell[1])) {
                document.board[temp_x][temp_y].style.backgroundColor="mediumorchid";}}, document.timer);
        }
        
        document.closed_list.push([current_x, current_y]);
        let new_cell = findMinAStar (document.my_heap);
        current_x=new_cell[1][0];
        current_y=new_cell[1][1];
    }
    return false;
}

function findMinAStar (my_heap) {
    let min_f = my_heap[0][0];
    let min_el = [my_heap[0][1][0], my_heap[0][1][1]];
    let count=0;
    let min_pos=0;
    for (let el of my_heap) {
        if (el[0]<min_f||(el[0]==min_f&&document.board[el[1][0]][el[1][1]].h<document.board[min_el[0]][min_el[1]].h)) {
            min_el=[el[1][0], el[1][1]];
            min_pos=count;
            min_f = el[0];
        }
        count++;
    }
    return my_heap.splice(min_pos, 1)[0];
}

export {aStar, findMinAStar};