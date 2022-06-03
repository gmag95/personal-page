function merge (array, startPos) {

    if (array.length>1) {

        let r = Math.floor(array.length/2);
        let L = array.slice(0, r);
        let M = array.slice(r);

        L = merge(L, startPos);
        M = merge(M, startPos+r);

        let i = 0;
        let j = 0;
        let k = 0;

        while (i<L.length && j<M.length) {
            if (L[i]<M[j]) {
                array[k] = L[i];
                move(document.getElementById(`bar${startPos+k}`), L[i]);
                document.timer+=20;
                document.moveCount++;
                i++;
            } else {
                array[k] = M[j];
                move(document.getElementById(`bar${startPos+k}`), M[j]);
                document.timer+=20;
                document.moveCount++;
                j++;
            }
            k++;
        }

        while (i<L.length) {
            array[k] = L[i];
            move(document.getElementById(`bar${startPos+k}`), L[i]);
            document.timer+=20;
            document.moveCount++;
            i++;
            k++;
        }

        while (j<M.length) {
            array[k] = M[j];
            move(document.getElementById(`bar${startPos+k}`), M[j]);
            document.timer+=20;
            document.moveCount++;
            j++;
            k++;
        }

        return array;

    } else {

        return array;
    }
}

function move (bar, height) {
    setTimeout(() => {
        bar.style.height = `${height}%`;
    }, document.timer)
}

export {merge};