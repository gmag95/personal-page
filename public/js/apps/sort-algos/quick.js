function partition (array, low, high) {
    let pivot = array[high];

    let i = low;

    let tempI = undefined;
    let tempJ = undefined;

    for (let j=low; j<high; j++) {
        if (array[j]<=pivot) {
            tempI = array[i];
            tempJ = array[j];
            array[i] = tempJ;
            array[j] = tempI;
            document.swap(document.getElementById(`bar${j}`), document.getElementById(`bar${i}`), document.getElementById(`bar${j+1}`));
            document.timer+=20;
            document.moveCount++;
            i++;
        }
    }
    tempI = array[i];
    array[i] = pivot;
    array[high] = tempI;
    document.swap(document.getElementById(`bar${high}`), document.getElementById(`bar${i}`), document.getElementById(`bar${high+1}`));
    document.timer+=20;
    document.moveCount++;
    return i;
}

function quick (array, low, high) {
    if (low < high) {

        let pi = partition(array, low, high);
        
        quick(array, low, pi-1);

        quick(array, pi+1, high);
    }
}

export {quick};