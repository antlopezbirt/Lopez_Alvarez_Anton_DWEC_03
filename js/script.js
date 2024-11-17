'use strict'

var puntero = "cruz";
var casillero = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
]
var terminado = false;
var turno = 0;
var jugadaGanadora;

function comprobarVictoria(puntero) {
    // Buscamos la existencia de una jugada ganadora comparando los arrays (por valor).
    let tresEnRaya = JSON.stringify([puntero, puntero, puntero]);
    switch (true) {
        // Primera fila
        case (JSON.stringify(casillero[0]) === tresEnRaya):
            jugadaGanadora = [0, 1, 2];
            return true;
        // Segunda fila
        case (JSON.stringify(casillero[1]) === tresEnRaya):
            jugadaGanadora = [3, 4, 5];
            return true;
        // Tercera fila
        case (JSON.stringify(casillero[2]) === tresEnRaya):
            jugadaGanadora = [6, 7, 8];
            return true;
        // Primera columna
        case (JSON.stringify([casillero[0][0], casillero[1][0], casillero[2][0]]) === tresEnRaya):
            jugadaGanadora = [0, 3, 6];
            return true;
        // Segunda columna
        case (JSON.stringify([casillero[0][1], casillero[1][1], casillero[2][1]]) === tresEnRaya):
            jugadaGanadora = [1, 4, 7];
            return true;
        // Tercera columna
        case (JSON.stringify([casillero[0][2], casillero[1][2], casillero[2][2]]) === tresEnRaya):
            jugadaGanadora = [2, 5, 8];
            return true;
        // Primera diagonal
        case (JSON.stringify([casillero[0][0], casillero[1][1], casillero[2][2]]) === tresEnRaya):
            jugadaGanadora = [0, 4, 8];
            return true;
        // Segunda diagonal
        case (JSON.stringify([casillero[0][2], casillero[1][1], casillero[2][0]]) === tresEnRaya):
            jugadaGanadora = [2, 4, 6];
            return true;
    }
    return false;
}

function pulsar(casilla)  {
    if (terminado === false) {
        let fila = Math.trunc(parseInt(casilla.id.charAt(3)) / 3);
        let columna = parseInt(casilla.id.charAt(3)) % 3;
        console.log('Fila: ' + fila);
        console.log('Columna: ' + columna);
        
        if (casillero[fila][columna] === 0) {
            casillero[fila][columna] = puntero;
            casilla.innerHTML = '<div id="ficha' + casilla.id.charAt(3) + '" class="' + puntero + '"></div>';

            if (comprobarVictoria(puntero) === false) {
                puntero = (puntero === "cruz") ? "circulo" : "cruz";
                
            } else {
                terminado = true;
                for (let id of jugadaGanadora) {
                    console.log('ID casilla: ', id);
                    document.getElementById('ficha' + id).className = puntero + 'verde';
                    console.log(document.getElementById('ficha' + id).className);
                }

                document.getElementById('resultado').innerText = '¡¡Gana el jugador ' + puntero + '!!';
                document.getElementById('opciones').style.visibility = "visible";
            }

            turno++;
            //console.log(turno);

            if (turno === 9 && terminado === false) {
                document.getElementById('resultado').innerHTML = '<p>¡¡Empate!! ¿Quieres volver a jugar?</p>';
                document.getElementById('opciones').style.visibility = "visible";
                terminado = true;
            } else if (puntero === "circulo" && terminado === false) { // Turno del ordenador, si el tablero no está lleno

                let seleccionPC;
                do {
                    seleccionPC = Math.floor(Math.random()*9);
                    console.log(seleccionPC);
                } while (pulsar(document.getElementById('cas' + seleccionPC)) === false);
            }

            return true;
        }
        else return false;
    }
    return false;
}


var casillas = document.getElementsByClassName('casilla');

//console.log(casillas);

for (let casilla of casillas) {
    casilla.addEventListener("click", function() {
        pulsar(casilla);
    });
}

var btnJugar = document.querySelector('#jugar');
var btnSalir = document.querySelector('#salir');

btnJugar.addEventListener("click", function() {
    //window.location.reload(); // opcion facil

    puntero = "cruz";
    casillero = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]
    terminado = false;
    turno = 0;

    for (let i = 0; i < 9; i++) document.querySelector('#cas' + i).innerHTML = '';
    document.getElementById('resultado').innerHTML = '';
    document.getElementById('opciones').style.visibility = "hidden";


    /*for (let cas of casillero) {
        console.log('cas' + cas);
        document.getElementById('cas' + cas).innerHTML = '';
    }*/

});