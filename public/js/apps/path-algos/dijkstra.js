
function Dijkstra () {
    for (let row of document.board) {
        for (let cell of row) {
            cell.distance = Infinity;
        }
    }

    document.board[document.start_cell[0]][document.start_cell[1]].distance=0;

    let current_x=document.start_cell[0];
    let current_y=document.start_cell[1];

    document.modifyNeighbour();

    document.my_heap.push([0,[document.start_cell[0], document.start_cell[1]]]);

    while (document.my_heap.length>0) {
        for (let neighbour of document.board[current_x][current_y].neighbours) {
            let temp_x=current_x;
            let temp_y=current_y;
            if (!(document.inClosedList(neighbour[0], neighbour[1])) && document.board[current_x][current_y].distance+1<document.board[neighbour[0]][neighbour[1]].distance && !document.specialCase(temp_x, temp_y, neighbour[0], neighbour[1])) {
                document.board[neighbour[0]][neighbour[1]].parent=[current_x, current_y];
                if (neighbour[0]==23&&neighbour[1]==23) {
                    return true;
                }
                document.board[neighbour[0]][neighbour[1]].distance=document.board[current_x][current_y].distance+1;
                let temp_result = document.inOpenList(neighbour[0], neighbour[1]);
                if (!temp_result==false) {
                    document.my_heap[temp_result][0]=document.board[current_x][current_y].distance+1;
                } else {
                    document.my_heap.push([document.board[neighbour[0]][neighbour[1]].distance, [neighbour[0], neighbour[1]]]);
                }
                setTimeout(() => {document.board[neighbour[0]][neighbour[1]].style.backgroundColor="forestgreen";}, document.timer);
                document.timer+=20;
            }
            setTimeout(() => {
                if (!(temp_x==document.start_cell[0]&&temp_y==document.start_cell[1])) {
                document.board[temp_x][temp_y].style.backgroundColor="lawngreen";}}, document.timer);
        }
        
        document.closed_list.push([current_x, current_y]);
        let new_cell = document.findMin (document.my_heap);
        current_x=new_cell[1][0];
        current_y=new_cell[1][1];
    }
    return false;
}

export {Dijkstra};