function selection () {
    let swapCount=0;
    for (let x=0; x<document.barN; x++) {
        let min_idx = x;
        for (let y=x+1; y<document.barN; y++) {
            if (document.getElementById(`bar${y}`).style.height<document.getElementById(`bar${min_idx}`).style.height) {
                min_idx=y;
            }
        }
        document.swap(document.getElementById(`bar${min_idx}`), document.getElementById(`bar${x}`), document.getElementById(`bar${min_idx+1}`));
        document.timer+=20;
        swapCount++;
    }
    setTimeout(() => {document.endMessage(swapCount)}, document.timer);
}

export {selection};