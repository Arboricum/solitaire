//calc a single dice wiht 6 faces
export const sixFacesDiceSingle = () => {
    let result = Math.floor((Math.random() * 6) + 1);
    return result;    
}

//calc multiple dices with 6 faces, returns an array of values
export const sixFacesDiceMultiple = (numberOfDices) => {
   let result = [];
   let i = 0;
   while (i < numberOfDices) {
       result.push(sixFacesDiceSingle());
       i++;
   }
   return result;
}

//calc single dice with n faces
export const customFacesDiceSingle = (numberOfFaces) => {
    let result = Math.floor((Math.random() * numberOfFaces) + 1);
    return result;  
}

//sort randomly an array
export const randomSortArray = (array) => {
    for (let i = array.length -1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i+1));
        let k = array[i];
        array[i] = array[j];
        array[j] = k;
    }
    return array;
}