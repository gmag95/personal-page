function Lee (open_list) {
    if (open_list.length==0) {
        return false;
    }
    let new_open_list = [];
    for (let cell of open_list) {
        for (let neighbour of document.board[cell[0]][cell[1]].neighbours) {
            if (!(document.inClosedList(neighbour[0], neighbour[1]))) {
                document.closed_list.push([neighbour[0], neighbour[1]]);
                document.board[neighbour[0]][neighbour[1]].parent=[cell[0], cell[1]];
                    if (((neighbour[0])==23)&&((neighbour[1])==23)) {
                        return true;
                    }
                setTimeout(() => {document.board[neighbour[0]][neighbour[1]].style.backgroundColor=`rgb(${document.cellColor[0]},${document.cellColor[1]},${document.cellColor[2]})`;}, document.timer);
                document.timer+=20;
                new_open_list.push([neighbour[0], neighbour[1]]);
                }
            }
        
    }
    setTimeout(document.changeColor,document.timer);
    if (Lee(new_open_list)) {
        return true;
    } else {
    return false;
    }
}

export {Lee};