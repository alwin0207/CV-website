// Functie functie (moahahaha):
// Check of string de volgende opmaak heeft (dd-mm-yyyy)
// Stap 1: length string;
// Stap 2: String heeft op index 2 een "-".
// Stap 3: Restand zijn integers
// Stap 4: Splits overgebleven string tussen 1 en 2.
// Stap 5: Eerste nummer tussen 1 en 12.
// Stap 6: Tweede nummer tussen 1930 en 2021


function isMonthYear(mYString){
    if(mYString.length !== 7){
        console.log("not the right length");
        return false;
    }
    else if(mYString.charAt(2) !== "-"){
        console.log("no - at the right spot");
        return false;
    }
    else if((isNaN(mYString.split("-")[0])) || (mYString.split("-")[0].length !== 2)){
        console.log("No number before -");
        return false;
    }
    else if((isNaN(mYString.split("-")[1])) || mYString.split("-")[1].length !== 4){
        console.log("No number after -");
        return false;
    }
    else{
        return true;
    }
}

if (isMonthYear(myInput)){
    // doe de rest;
}