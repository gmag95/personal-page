let box = document.querySelector(".box");
let startHeight = new Array();
document.timer=20;
document.barN = 50;

import { bubble } from './sort-algos/bubble.js';
import { selection } from './sort-algos/selection.js';
import { insertion } from './sort-algos/insertion.js';
import { merge } from './sort-algos/merge.js';
import { quick } from './sort-algos/quick.js';
import { countSort } from './sort-algos/count.js';

for (let i=0; i<document.barN; i++) {
    let bar = document.createElement("div");
    bar.classList.add("bar");
    bar.id=`bar${i}`;
    bar.style.width="1.7%";
    let barHeight = Math.floor(Math.random()*80)+10;
    startHeight.push(barHeight);
    bar.style.height=`${barHeight}%`;
    box.appendChild(bar);
    bar.style.backgroundColor="#71cda6";
    bar.style.marginTop="auto";
}

document.getElementById('start_button').addEventListener('click', startSorter);

function startSorter () {
    if (document.querySelector("select").value=="1") {
        disableButtons();
        bubble();
    } else if (document.querySelector("select").value=="2") {
        disableButtons();
        selection();
    } else if (document.querySelector("select").value=="3") {
        disableButtons();
        insertion();
    } else if (document.querySelector("select").value=="4") {
        document.moveCount = 0;
        disableButtons();
        merge([...startHeight], 0);
        setTimeout(() => {document.endMessage(document.moveCount)}, document.timer);
    } else if (document.querySelector("select").value=="5") {
        document.moveCount = 0;
        disableButtons();
        quick([...startHeight], 0, startHeight.length-1);
        setTimeout(() => {document.endMessage(document.moveCount)}, document.timer);
    } else if (document.querySelector("select").value=="6") {
        disableButtons();
        countSort([...startHeight]);
    }
    setTimeout(() => {document.getElementById("reset_button").disabled=false}, document.timer);
}

document.swap = (firstBar, secondBar, supportBar) => {
    firstBar.classList.add('transition');
    secondBar.classList.add('transition');
    let move = secondBar.getBoundingClientRect().left - firstBar.getBoundingClientRect().left;
    setTimeout(() => {
        firstBar.style.transform = `translateX(${move}px)`;
        secondBar.style.transform = `translateX(${move*-1}px)`;
    }, document.timer);
    let tempFirstId = firstBar.id;
    let tempSecondId = secondBar.id;
    firstBar.id=undefined;
    secondBar.id=undefined;
    firstBar.id=tempSecondId;
    secondBar.id=tempFirstId;
    setTimeout(() => {
        document.querySelector('.box').insertBefore(firstBar, secondBar);
        if ( parseInt(tempFirstId.slice(3)) != parseInt(tempSecondId.slice(3))+1) {
            if (parseInt(tempFirstId.slice(3)) == document.barN-1) {
                document.querySelector('.box').appendChild(secondBar);
            } else {
                document.querySelector('.box').insertBefore(secondBar, supportBar);
            }
        }
        firstBar.classList.remove('transition');
        secondBar.classList.remove('transition');
        firstBar.style.removeProperty("transform");
        secondBar.style.removeProperty("transform");
    }, document.timer);
}

document.endMessage = (swapCount) => {
    document.querySelector("#end_row").classList.remove("hidden");
    document.querySelector("#end_row div").innerHTML=`Sorted the bars with ${swapCount} moves`;
}

document.getElementById("reset_button").addEventListener("click", reset);

function reset () {
    document.timer=20;
    document.getElementById("start_button").disabled=false
    for (let i=0; i<document.barN; i++) {
        let bar = document.getElementById(`bar${i}`);
        bar.style.height=`${startHeight[i]}%`;
        document.querySelector("#end_row").classList.add("hidden");
    }
}

function disableButtons () {
    document.getElementById("start_button").disabled=true;
    document.getElementById("reset_button").disabled=true;
}