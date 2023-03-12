let data =  [];

let board = undefined;

let time = 0;

let input_cell = undefined;

let selected_cell = "";

let count_blank=0;

let timer=0;

let step_count=0;

const options = {
    method: 'GET',
    url: 'https://sudoku-generator1.p.rapidapi.com/sudoku/generate',
    headers: {
      'X-RapidAPI-Key': api_key,
      'X-RapidAPI-Host': 'sudoku-generator1.p.rapidapi.com'
    }
  };

axios.request(options)
.then((payload) => {start(payload)})

function start (payload) {

    for (let idx = 0; idx < payload.data.puzzle.length; idx++) {
        if (idx%9==0) {
            data.push([]);
        }
        data[idx < 9 ? 0 : Math.floor(idx/9)].push(payload.data.puzzle[idx].replace(".", "0"))
    }

    board = data;

    for (let x=0; x<9; x++) {
        let new_row = document.createElement("tr");
        document.querySelector("table").appendChild(new_row);
        for (let y=0; y<9; y++) {
            let new_col = document.createElement("td");
            if (data[x][y]!=0) {
            new_col.innerText=data[x][y];
            }
            if (y==3) {
                new_col.style.borderLeft="0.3em solid black";
                new_col.style.paddingRight="0.15em";
                document.querySelector(`.el${x}2`).style.paddingLeft="0.15em";
            }
            if (y==6) {
                new_col.style.borderLeft="0.3em solid black";
                new_col.style.paddingRight="0.15em";
                document.querySelector(`.el${x}5`).style.paddingLeft="0.15em";
            }
            if (x==3) {
                new_col.style.borderTop="0.3em solid black";
                new_col.style.paddingBottom="0.15em";
                document.querySelector(`.el2${y}`).style.paddingTop="0.15em";
            }
            if (x==6) {
                new_col.style.borderTop="0.3em solid black";
                new_col.style.paddingBottom="0.15em";
                document.querySelector(`.el5${y}`).style.paddingTop="0.15em";
            }
            new_col.classList.add(`el${x}${y}`);
            new_row.appendChild(new_col);
            new_col.addEventListener("click", selected);
            new_col.coord_x=x;
            new_col.coord_y=y;
        }
    }

    document.addEventListener("keydown", enterNumber);

    document.querySelector("#reset_button").addEventListener("click", reset);

    document.querySelector("#solver_button").addEventListener("click", startAutosolver);

    clock();

    countBlank();

    document.getElementById("options-row").style.setProperty("display", "flex", "important");
}

function countBlank () {
    for (let x=0; x<9; x++) {
        for (let y=0; y<9; y++) {
            if (data[x][y]==0) {
                count_blank++;
            }
        }
    }
}

function selected (evt) {
    removeSelected ();
    selected_cell=evt.currentTarget.classList[0].slice(-2);
    if (data[evt.currentTarget.coord_x][evt.currentTarget.coord_y]==0) {
        document.querySelector(`.el${evt.currentTarget.coord_x}${evt.currentTarget.coord_y}`).style.backgroundColor="darkgrey";
    } else {
        selected_cell="";
    }
}

function removeSelected () {
    if (selected_cell!="" && board[parseInt(selected_cell[0])][parseInt(selected_cell[1])]==0) {
        document.querySelector(`.el${selected_cell}`).style.backgroundColor="white";
        document.querySelector(`.el${selected_cell}`).innerText="";
    }
}

function enterNumber (event) {
    if (selected_cell!="" && ["1","2","3","4","5","6","7","8","9"].includes(event.key) && document.querySelector(`.el${selected_cell}`).style.backgroundColor=="darkgrey") {
        document.querySelector(`.el${selected_cell[0]}${selected_cell[1]}`).innerText=parseInt(event.key);
        input_cell=selected_cell;
        if (board[parseInt(selected_cell[0])][parseInt(selected_cell[1])]!=0) {
            board[parseInt(selected_cell[0])][parseInt(selected_cell[1])]=0;
            count_blank++;
        }
        document.addEventListener("keydown", confirmNumber);
    } else if (selected_cell!="" && event.key=="Delete") {
        document.querySelector(`.el${selected_cell}`).style.backgroundColor="white";
        document.querySelector(`.el${selected_cell}`).innerText="";
        if (board[parseInt(selected_cell[0])][parseInt(selected_cell[1])]!=0) {
            count_blank++;
        }
        board[parseInt(selected_cell[0])][parseInt(selected_cell[1])]=0;
    }
}

function confirmNumber (event) {
    if (input_cell==selected_cell && event.key=="Enter" && checkNumber()) {
        if (board[parseInt(selected_cell[0])][parseInt(selected_cell[1])]==0) {
            count_blank--;
        }
        board[parseInt(selected_cell[0])][parseInt(selected_cell[1])]=parseInt(document.querySelector(`.el${selected_cell[0]}${selected_cell[1]}`).innerText);
        document.removeEventListener("keydown", confirmNumber);
        if (count_blank==0) {
            endGame();
        }
    }
    else if (!["1","2","3","4","5","6","7","8","9"].includes(event.key)){
        removeSelected();
    }
}

function clock () {
    let minutes = Math.floor(time/60);
    let seconds = time%60;
    if (String(minutes).length==1 && String(seconds).length==1) {
        document.querySelector("#clock").innerText=`0${minutes}:0${seconds}`;
    }
    else if (String(minutes).length>1 && String(seconds).length==1) {
        document.querySelector("#clock").innerText=`${minutes}:0${seconds}`;
    }
    else if (String(minutes).length==1 && String(seconds).length>1) {
        document.querySelector("#clock").innerText=`0${minutes}:${seconds}`;
    } else {
        document.querySelector("#clock").innerText=`0${minutes}:0${seconds}`;
    }
    time+=1;
    setTimeout(() => {clock()}, 1000);
}

function checkNumber () {
    let offset_x = Math.floor(parseInt(selected_cell[0])/3);
    let offset_y = Math.floor(parseInt(selected_cell[1])/3);
    for (let i=0; i<9; i++) {
        if (String(i).concat(selected_cell[1])!=selected_cell && document.querySelector(`.el${i}${selected_cell[1]}`).innerText==document.querySelector(`.el${selected_cell}`).innerText) {
            return false;
        }
        if (String(selected_cell[0]).concat(i)!=selected_cell && document.querySelector(`.el${selected_cell[0]}${i}`).innerText==document.querySelector(`.el${selected_cell}`).innerText) {
            return false;
        }
    }
    for (let x=0; x<3; x++) {
        for (let y=0; y<3; y++) {
            if (String(offset_x*3+x).concat(String(offset_y*3+y))!=selected_cell && document.querySelector(`.el${offset_x*3+x}${offset_y*3+y}`).innerText==document.querySelector(`.el${selected_cell}`).innerText) {
                return false;
            }
        }
    }
    return true;
}

function endGame () {
    document.querySelector("#end_row").innerText="You won the game";
    document.querySelector("#end_row").style.display="flex";
    document.querySelector("#solver_button").disabled = true;
    for (let x=0; x<9; x++) {
        for (y=0; y<9; y++) {
            document.querySelector(`.el${x}${y}`).removeEventListener("click", selected);
        }
    }
    document.removeEventListener("keydown", enterNumber);
}

function reset () {
    document.querySelector("#end_row").style.display="none";
    time=0;
    timer=0;
    step_count=0;
    board = JSON.parse(JSON.stringify(data));
    input_cell = undefined;
    selected_cell = "";
    countBlank();
    document.querySelector("#solver_button").disabled = false;
    for (x=0; x<9; x++) {
        for (y=0; y<9; y++) {
            document.querySelector(`.el${x}${y}`).addEventListener("click", selected);
            document.querySelector(`.el${x}${y}`).style.backgroundColor="white";
            if (data[x][y]!=0) {
                document.querySelector(`.el${x}${y}`).innerText=data[x][y];
            } else {
                document.querySelector(`.el${x}${y}`).innerText=""; 
            }
        }
    }
    document.addEventListener("keydown", enterNumber);
}

function startAutosolver () {

    board = JSON.parse(JSON.stringify(data));

    count_blank=countBlank();

    selected_cell=blankCell();

    for (let x=0; x<9; x++) {
        for (y=0; y<9; y++) {
            document.querySelector(`.el${x}${y}`).removeEventListener("click", selected);
        }
    }

    document.querySelector("#reset_button").disabled = true;

    document.querySelector("#solver_button").disabled = true;

    document.removeEventListener("keydown", enterNumber);

    solver(selected_cell);

    setTimeout(() => {
        document.querySelector("#reset_button").disabled = false;
        if (count_blank==0) {
        document.querySelector("#end_row span").innerHTML=`The sudoku was solved with ${step_count} moves`;
        } else {
        document.querySelector("#end_row span").innerHTML=`The sudoku has no solutions`;
        }
        document.querySelector("#end_row").style.display="flex";
    }, timer);

}

function countBlank() {
    let counter=0;
    for (let x=0; x<9; x++) {
        for (let y=0; y<9; y++) {
            if (board[x][y]==0) {
                counter++;
            }
        }
    }
    return counter;
}

function blankCell () {
    for (let x=0; x<9; x++) {
        for (let y=0; y<9; y++) {
            if (board[x][y]==0) {
                return String(x).concat(String(y));
            }
        }
    }
}


function solver (selected_cell) {

    if (count_blank==0) {
        return true;
    }

    let valid_numbers = addNumber(selected_cell);

    count_blank--;

    for (let number of valid_numbers) {
        board[parseInt(selected_cell[0])][parseInt(selected_cell[1])]=number;
        setTimeout(() => {updateBoard(number, "darkgrey", selected_cell)}, timer);
        step_count++;
        timer+=10;
        if (solver(blankCell())) {
            return true;
        }
    }
    board[parseInt(selected_cell[0])][parseInt(selected_cell[1])]=0;
    setTimeout(() => {updateBoard("", "white", selected_cell)}, timer);
    step_count++;
    timer+=10;    
    count_blank++;

    return false;
}

function addNumber(selected_cell) {
    let valid_numbers = [];
    for (let x=1; x<10; x++) {
        if (checkNumberAuto(selected_cell, x)) {
            valid_numbers.push(x);
        }
    }
    return valid_numbers;
}


function checkNumberAuto (selected_cell, value) {
    let offset_x = Math.floor(parseInt(selected_cell[0])/3);
    let offset_y = Math.floor(parseInt(selected_cell[1])/3);    
    for (let i=0; i<9; i++) {
        if (board[i][parseInt(selected_cell[1])]==value) {
            return false;
        }
        if (board[parseInt(selected_cell[0])][i]==value) {
            return false;
        }
    }
    for (let x=0; x<3; x++) {
        for (let y=0; y<3; y++) {
            if (board[offset_x*3+x][offset_y*3+y]==value) {
                return false;
            }
        }
    }  
    return true;
}

function updateBoard (number, color, selected_cell) {
    document.querySelector(`.el${selected_cell[0]}${selected_cell[1]}`).innerText=number;
    document.querySelector(`.el${selected_cell}`).style.backgroundColor=color;
}