'use strict'

var puntero = "X";
var casillero = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
]
var terminado = false;
var turno = 0;

function comprobarVictoria(puntero) {
    if (JSON.stringify(casillero[0]) === JSON.stringify([puntero, puntero, puntero]) || 
        JSON.stringify(casillero[1]) === JSON.stringify([puntero, puntero, puntero]) ||
        JSON.stringify(casillero[2]) === JSON.stringify([puntero, puntero, puntero]) ||
        JSON.stringify([casillero[0][0], casillero[1][0], casillero[2][0]]) === JSON.stringify([puntero, puntero, puntero]) ||
        JSON.stringify([casillero[0][1], casillero[1][1], casillero[2][1]]) === JSON.stringify([puntero, puntero, puntero]) ||
        JSON.stringify([casillero[0][2], casillero[1][2], casillero[2][2]]) === JSON.stringify([puntero, puntero, puntero]) ||
        JSON.stringify([casillero[0][0], casillero[1][1], casillero[2][2]]) === JSON.stringify([puntero, puntero, puntero]) ||
        JSON.stringify([casillero[0][2], casillero[1][1], casillero[2][0]]) === JSON.stringify([puntero, puntero, puntero])    
    ) {
        return true;
    }
    return false;
}

function pulsar(casilla)  {
    let casillaValida = false;
    if (terminado === false) {
        let fila = Math.trunc(parseInt(casilla.id) / 3);
        let columna = parseInt(casilla.id) % 3;
        //console.log('Fila: ' + fila);
        //console.log('Columna: ' + columna);
        
        if (casillero[fila][columna] === 0) {
            casillaValida = true;
            casillero[fila][columna] = puntero;
            casilla.innerText = puntero;

            if (comprobarVictoria(puntero) === false) {
                puntero = (puntero === "X") ? "O" : "X";
                
            } else {
                terminado = true;
                document.getElementById('resultado').innerText = '¡¡Gana el jugador ' + puntero + '!!';
            }

            turno++;
            //console.log(turno);

            if (turno === 9) {
                document.getElementById('resultado').innerText = '¡¡Empate!! ¿Quieres volver a jugar?';
            } else if (puntero === "O" && terminado === false) { // Turno del ordenador, si el tablero no está lleno

                let seleccionPC;
                do {
                    seleccionPC = Math.floor(Math.random()*9);
                    //console.log(seleccionPC);
                } while (pulsar(document.getElementById(seleccionPC)) === false);
            }

            return true;
        }

        else return false;
    }
    return casillaValida;
    
}


var casillas = document.getElementsByClassName('casilla');

//console.log(casillas);

for (let casilla of casillas) {
    casilla.addEventListener("click", function() {
        pulsar(casilla);
    });
}