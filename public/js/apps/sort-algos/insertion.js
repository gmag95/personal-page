function insertion() {
    let swapCount=0;
    for (let i=1; i<document.barN; i++) {
        let selectedBar = document.getElementById(`bar${i}`);
        let j=i-1;

        while (j>=0 && selectedBar.style.height < document.getElementById(`bar${j}`).style.height) {
            document.swap(selectedBar, document.getElementById(`bar${j}`), null);
            swapCount++;
            document.timer+=20;
            j--;
        }
    }
    setTimeout(() => {document.endMessage(swapCount)}, document.timer);
}

export {insertion};