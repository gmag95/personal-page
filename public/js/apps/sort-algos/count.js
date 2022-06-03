function countSort (array) {
    let moveCount = 0;
    let size = array.length;
    let output = new Array(size).fill(0);
    let count = new Array(90).fill(0);

    for (let i=0; i<size; i++) {
        count[array[i]]++;
    }

    for (let i=1; i<count.length; i++) {
        count[i] += count[i-1];
    }

    let i = size-1;

    while (i>=0) {
        output[count[array[i]]-1] = array[i];
        move(document.getElementById(`bar${count[array[i]]-1}`), array[i]);
        moveCount++;
        document.timer+=20;
        count[array[i]]-=1;
        i-=1;
    }

    for (let i=0; i<size; i++) {
        array[i] = output[i];
    }

    setTimeout(() => {document.endMessage(moveCount)}, document.timer);
}

function move (bar, value) {
    setTimeout(() => {
        bar.style.height = `${value}%`;
    }, document.timer)
}

export {countSort};