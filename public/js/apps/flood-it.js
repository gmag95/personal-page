let row = undefined;
let col = undefined;
let color_array = [];
let game_status = "off";
let selected_cell = "";
let outline_cell=undefined;
let moves=[[0,1],[0,-1],[1,0],[-1,0]];
let perimeter=[];
let steps=0;

function color_set () {
    color_array=[];
    for (let i=0; i<16; i++) {
        color_array.push(`rgb(${Math.floor(Math.random()*15)*14+49},${Math.floor(Math.random()*15)*14+49},${Math.floor(Math.random()*15)*14+49})`);
    }
}

function filler(perimeter_func) {
    let additions = [];
    for (let elem of perimeter_func) {
        for (let move of moves) {
            if (parseInt(elem[0])+move[0]>=0 && parseInt(elem[0])+move[0]<9 && parseInt(elem[1])+move[1]>=0 && parseInt(elem[1])+move[1]<9 && document.querySelector(`.el${parseInt(elem[0])+move[0]}${parseInt(elem[1])+move[1]}`).style.backgroundColor == document.querySelector(`.el${parseInt(elem[0])}${parseInt(elem[1])}`).style.backgroundColor && !perimeter.includes(document.querySelector(`.el${parseInt(elem[0])+move[0]}${parseInt(elem[1])+move[1]}`).className.slice(-2)) && !additions.includes(document.querySelector(`.el${parseInt(elem[0])+move[0]}${parseInt(elem[1])+move[1]}`).className.slice(-2))) {
                additions.push(document.querySelector(`.el${parseInt(elem[0])+move[0]}${parseInt(elem[1])+move[1]}`).className.slice(-2))
            }
        }
    }
    perimeter = perimeter.concat(additions);
    if (additions.length>0) {
        filler(additions);
    } 
}

function remove_outline() {
    if (selected_cell!="") {
        document.querySelector(`.el${selected_cell}`).style.removeProperty("outline");
    }
}

function selected (evt) {
    remove_outline();
    selected_cell=`${evt.currentTarget.className.slice(-2)}`;
    if (document.querySelector("#start_button").disabled==false) {
        evt.currentTarget.style.outline="0.3em solid rgb(60,60,60)";
        evt.currentTarget.style.outlineOffset="-0.3em";
        outline_cell=`${evt.currentTarget.className.slice(-2)}`;
        return outline_cell;
    } 
    else {
        for (let elem of perimeter) {
        document.querySelector(`.el${elem}`).style.backgroundColor=document.querySelector(`.el${selected_cell}`).style.backgroundColor;
        }
        filler (perimeter);
        steps+=1;
        document.querySelector("#move-counter").innerText = `Moves used: ${steps}/30`;
        if (perimeter.length==81) {
            document.querySelector("#game_guide").innerText = "You filled the board";
        } else if (steps==30) {
            document.querySelector("#game_guide").innerText = "You used all the moves available!";
        }
        if (perimeter.length==81 || steps==30) {
            for (let i=0; i<9; i++) {
                for (let j=0; j<9; j++) {
                    document.querySelector(`.el${i}${j}`).removeEventListener("click", selected);
                }
            }
        }
    }
}

color_set();

for (let i=0; i<9; i++) {
    row = document.createElement("tr");
    row.classList.add(`row${i}`);
    document.querySelector("table").appendChild(row);
    for (let j=0; j<9; j++) {
        col = document.createElement("td");
        col.classList.add(`el${i}${j}`);
        col.style.width="3em";
        col.style.height="3em";
        col.style.backgroundColor=color_array[Math.floor(Math.random()*16)];
        outline_cell=col.addEventListener("click", selected, false);
        row.appendChild(col);
    }
}

document.querySelector("#start_button").addEventListener("click", () => {
    if (selected_cell!="") {
        document.querySelector("#start_button").disabled = true;
        document.querySelector("#game_guide").innerText = "Fill the board selecting the right color";
        document.querySelector("#move-counter").innerText = "Moves used: 0/30";
        document.querySelector("#move-counter").style.setProperty("display", "unset", "important");
        perimeter.push(outline_cell);
        filler(perimeter);
    }
});

document.querySelector("#reset_button").addEventListener("click", () => {
    color_set();
    for (let i=0; i<9; i++) {
        for (let j=0; j<9; j++) {
            document.querySelector(`.el${i}${j}`).style.backgroundColor=color_array[Math.floor(Math.random()*16)];
        }
    }
    for (let i=0; i<9; i++) {
        for (let j=0; j<9; j++) {
            document.querySelector(`.el${i}${j}`).addEventListener("click", selected, false);
            row.appendChild(col);
        }
    }
    document.querySelector("#start_button").disabled = false;
    document.querySelector("#game_guide").innerText = "Select a starting cell";
    document.querySelector("#move-counter").style.setProperty("display", "none", "important");
    steps=0;
    remove_outline();
    selected_cell="";
    perimeter=[];
});