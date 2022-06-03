function bubble () {
    let swapCount=0;
    for (let x=0; x<document.barN; x++) {
        let swapped = false;
        for (let y=0; y<document.barN-x-1; y++) {
            if (document.getElementById(`bar${y}`).style.height>document.getElementById(`bar${y+1}`).style.height) {
                document.swap(document.getElementById(`bar${y+1}`), document.getElementById(`bar${y}`), null);
                swapped=true;
                document.timer+=20;
                swapCount++;
            }
        }
        if (!swapped) {setTimeout(() => {document.endMessage(swapCount)}, document.timer); return null}
    }
    setTimeout(() => {document.endMessage(swapCount)}, document.timer);
}

export {bubble};