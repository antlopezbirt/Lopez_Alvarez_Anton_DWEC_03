'use strict'

var puntero = "cruz";
var casillero = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
]
const casillas = document.querySelectorAll("div[id^='cas']");
var terminado = false;
var turno = 0;
var jugadaGanadora = [];
var fichaX = document.getElementById('fichasX');
var fichaO = document.getElementById('fichasO');

fichaX.addEventListener('mousedown', moverFicha);
fichaO.addEventListener('mousedown', moverFicha);

let currentDroppable = null;
let droppableBelow = null;
let padre = null;

/****************************** FUNCIONES ***********************************/

// Función que comprueba si la última jugada ha conseguido un tres en raya.
function comprobarVictoria(puntero) {

    let resultados = 0;
    let longitud = casillero[0].length; // Al abstraernos de la longitud, nos valdría con cualquiera, siempre que sea impar.

    // Buscamos el nº de ocurrencias en cada fila, iteramos las filas y filtramos los valores para contar resultados.
    for (let fila = 0; fila < longitud; fila++) {
        for (let col = 0; col < longitud; col++)
            // Transforma las posiciones bidimensionales a la numeración de las casillas.
            jugadaGanadora[col] = ''+ fila + col;

        // Filtra los valores de esa fila y cuenta las ocurrencias.
        resultados = casillero[fila].filter((v) => (v === puntero)).length;

        // Si son más de dos, existe un tres en raya en esta posición.
        if (resultados > 2) return true;
    }

    // Para filtrar los valores de las columnas usamos map:
    // https://stackoverflow.com/questions/7848004/get-column-from-a-two-dimensional-array
    for (let col = 0; col < longitud; col++) {
        for (let fila = 0; fila < longitud; fila++)
            // Transforma las posiciones bidimensionales a la numeración de las casillas correlativas.
            jugadaGanadora[fila] = ''+ fila + col;

        resultados =  casillero.map((valor,indice) => valor[col]).filter((v) => (v === puntero)).length;
        if (resultados > 2) return true;
    }

    // Los valores de las diagonales también se filtrarán con map:
    // https://stackoverflow.com/questions/67168295/how-do-i-get-the-diagonal-values-in-an-array

    // Diagonal 1
    for (let diag = 0; diag < longitud; diag++)
        // Transforma las posiciones bidimensionales a la numeración de las casillas correlativas.
        jugadaGanadora[diag] = '' + diag + diag;

    resultados =  casillero.map((valor, indice) => valor[indice]).filter((v) => (v === puntero)).length;
    if (resultados > 2) return true;

    // Diagonal 2
    for (let diag = 0; diag < longitud; diag++) {
        // Transforma las posiciones bidimensionales a la numeración de las casillas correlativas.
        let col = (longitud - diag - 1);
        jugadaGanadora[diag] = '' + diag + col;
    }
    console.log('Diagonal 2: ', jugadaGanadora);

    resultados =  [...casillero].reverse().map((valor, indice) => valor[indice]).filter((v) => (v === puntero)).length;
    if (resultados > 2) return true;

    return false;
}

function estaLibre(casilla) {
    // Transformamos los valores correlativos de los ID de las casillas a valoresde filas y columnas para acceder al array del casillero
    let fila = parseInt(casilla.id.charAt(3));
    let columna = parseInt(casilla.id.charAt(4));
        
    if (casillero[fila][columna] === 0) return true;

    return false;
}

function pulsar(casilla)  {
    if (terminado === false) {
        console.log(casilla.id);
        let fila = parseInt(casilla.id.charAt(3));
        let columna = parseInt(casilla.id.charAt(4));
        
        if (casillero[fila][columna] === 0) {
            casillero[fila][columna] = puntero;
            casilla.innerHTML = '<div id="ficha' + casilla.id.charAt(3) + casilla.id.charAt(4) + '" class="' + puntero + '"></div>';

            if (comprobarVictoria(puntero) === false) {
                puntero = (puntero === "cruz") ? "circulo" : "cruz";
                
            } else {
                terminado = true;

                // Vaciamos los listeners de las fichas
                fichaX.removeEventListener('mousedown', moverFicha);
                fichaO.removeEventListener('mousedown', moverFicha);
                
                for (let id of jugadaGanadora) {
                    console.log('ID casilla: ', id);
                    document.getElementById('ficha' + id).className = puntero + '--final';
                    //console.log(document.getElementById('ficha' + id).className);
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

                let seleccionFilaPC;
                let seleccionColumnaPC;
                do {
                    seleccionFilaPC = Math.floor(Math.random()*3);
                    seleccionColumnaPC = Math.floor(Math.random()*3);
                    //console.log(seleccionPC);
                } while (pulsar(document.getElementById('cas' + seleccionFilaPC + seleccionColumnaPC)) === false);
            }

            return true;
        }
        else return false;
    }
    return false;
}


/****************************** EVENTOS ***********************************/

for (let casilla of casillas) {
    casilla.addEventListener("click", function() {
        pulsar(casilla);
    });
}

function moverFicha(event) {

    //console.log("Activado evento");
    let ficha = event.target;
    if (ficha.classList.contains('cruz') || ficha.classList.contains('circulo')) {
        ficha = ficha.parentElement;
    }
    // (1) prepare to moving: make absolute and on top by z-index
    ficha.style.position = 'absolute';
    ficha.style.zIndex = 1000;

    // move it out of any current parents directly into body
    // to make it positioned relative to the body
    //document.body.append(ficha);

    // centers the ball at (pageX, pageY) coordinates
    function moveAt(pageX, pageY) {
        ficha.style.left = pageX - ficha.offsetWidth / 2 + 'px';
        ficha.style.top = pageY - ficha.offsetHeight / 2 + 'px';
    }

    // move our absolutely positioned ball under the pointer
    //moveAt(event.pageX, event.pageY);

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
        
        ficha.style.display = 'none';
        ficha.childNodes[0].hidden = true;
        let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
        //console.log(elemBelow);
        ficha.style.display = 'flex';
        ficha.childNodes[0].hidden = false;

        // mousemove events may trigger out of the window (when the ball is dragged off-screen)
        // if clientX/clientY are out of the window, then elementFromPoint returns null
        if (!elemBelow) return;

        // potential droppables are labeled with the class "droppable" (can be other logic)
        droppableBelow = elemBelow.closest('.casilla');

        if (currentDroppable != droppableBelow) {
            // we're flying in or out...
            // note: both values can be null
            //   currentDroppable=null if we were not over a droppable before this event (e.g over an empty space)
            //   droppableBelow=null if we're not over a droppable now, during this event

            if (currentDroppable) {
                // the logic to process "flying out" of the droppable (remove highlight)
                leaveDroppable(currentDroppable);
            }

            currentDroppable = droppableBelow;

            if (currentDroppable) {
                // the logic to process "flying in" of the droppable
                enterDroppable(currentDroppable);
            }
        }
    }

    // (2) move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // (3) drop the ball, remove unneeded handlers
    ficha.onmouseup = function() {
        if (currentDroppable) {
            leaveDroppable(currentDroppable)
            pulsar(currentDroppable);
        }
        document.removeEventListener('mousemove', onMouseMove);
        ficha.onmouseup = null;
        ficha.style = "";
    };
}

function enterDroppable(elem) {
    if(estaLibre(elem)) elem.classList.toggle('lanzable');
}

function leaveDroppable(elem) {
    elem.classList.toggle('lanzable');
}




var btnJugar = document.querySelector('#jugar');
var btnSalir = document.querySelector('#salir');


// Reinicia los valores y vacía el casillero
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
    
    for (let casilla of casillas) casilla.innerHTML = '';
    document.getElementById('resultado').innerHTML = '';
    document.getElementById('opciones').style.visibility = "hidden";

    fichaX.addEventListener('mousedown', moverFicha);
    fichaO.addEventListener('mousedown', moverFicha);

});