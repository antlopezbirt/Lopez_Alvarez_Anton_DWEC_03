'use strict'

let nivel = localStorage.getItem('nivel');
let modo = localStorage.getItem('nivel');

var tiempoJuego = 99;
var tiempoTurno = 0;

// Asignamos el tiempo del turno correspondiente al nivel seleccionado
switch (nivel) {
    case 0:
        tiempoTurno = 8;
        break;
    case 1:
        tiempoTurno = 4;
        break;
    case 2:
        tiempoTurno = 2;
        break;
}

const contaTurnoX = document.getElementById('contaTurnoX');
const contaTurnoO = document.getElementById('contaTurnoO');
const contaMovsX = document.getElementById('contaMovsX');
const contaMovsO = document.getElementById('contaMovsO');

const txtTiempoJuego = document.getElementById('tiempoJuego');
const txtTiempoTurnoX = document.getElementById('contaTurnoX');
const txtTiempoTurnoO = document.getElementById('contaTurnoO');

var puntero = "circulo";
var casillero = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
]
const casillas = document.querySelectorAll("div[id^='cas']");

var terminado = false;
var turno = 0;
var contaTurno = null
var contaJuego = null;
var miTurno = null;
let movsX = 0;
let movsO = 0;

var jugadaGanadora = [];
var fichaX = document.getElementById('fichasX');
var fichaO = document.getElementById('fichasO');

const eventoSoltarRaton = new Event('mouseup', { bubbles: true, cancelable: false })

let currentDroppable = null;
let droppableBelow = null;
let padre = null;


// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    fichaX.addEventListener('mousedown', moverFicha);
    fichaO.addEventListener('mousedown', moverFicha);

    contaJuego = setInterval(temporizadorJuego, 1000);
    iniciarTurno();
});

/****************************** FUNCIONES ***********************************/

function temporizadorJuego() {
    txtTiempoJuego.innerText = tiempoJuego + 's';
    tiempoJuego -= 1;
    if (tiempoJuego === -1) {
        clearInterval(contaJuego);
        //window.location.assign("index.html");
    }
}

function iniciarTurno() {
    // Disparamos un evento mouseup en ambas fichas para forzar el soltado de la ficha anterior
    fichaX.dispatchEvent(eventoSoltarRaton);
    fichaO.dispatchEvent(eventoSoltarRaton);

    // Paramos el segundero y reiniciamos el tiempo del turno
    clearInterval(contaTurno);
    tiempoTurno = 4;

    if (terminado === false) {
        // Vaciamos los listeners de las fichas del turno anterior y cambiamos el puntero
        if (puntero === "cruz") {
            puntero = "circulo";
            fichaX.removeEventListener('mousedown', moverFicha);
            fichaX.classList.remove('ficha--activa');
            contaTurnoX.classList.remove('contaTurno--activo');
            txtTiempoTurnoX.innerText = '0';

            fichaO.addEventListener('mousedown', moverFicha);
            fichaO.classList.add('ficha--activa');
            contaTurnoO.classList.add('contaTurno--activo');
            txtTiempoTurnoO.innerText = '5';
        } else {
            puntero = "cruz";
            fichaO.removeEventListener('mousedown', moverFicha);
            fichaO.classList.remove('ficha--activa');
            contaTurnoO.classList.remove('contaTurno--activo');
            txtTiempoTurnoO.innerText = '0';

            fichaX.addEventListener('mousedown', moverFicha);
            fichaX.classList.add('ficha--activa');
            contaTurnoX.classList.add('contaTurno--activo');
            txtTiempoTurnoX.innerText = '5';
        }

        contaTurno = setInterval(temporizadorTurno, 1000);
    }
}

function temporizadorTurno() {
    // console.log("Puntero: ", puntero);
    //console.log("Turno jugador: ", contaTurno);
    if (tiempoTurno === 0) {
        clearInterval(contaTurno);
        clearInterval(miTurno);
        iniciarTurno();
    }
    else {
        if (puntero === "cruz") {
            txtTiempoTurnoX.innerText = tiempoTurno;
        } else {
            txtTiempoTurnoO.innerText = tiempoTurno;
        }
        tiempoTurno -=1;
    }
}

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
    // console.log('Diagonal 2: ', jugadaGanadora);

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
        // console.log(casilla.id);
        let fila = parseInt(casilla.id.charAt(3));
        let columna = parseInt(casilla.id.charAt(4));
        
        if (casillero[fila][columna] === 0) {
            casillero[fila][columna] = puntero;
            casilla.innerHTML = '<div id="ficha' + casilla.id.charAt(3) + casilla.id.charAt(4) + '" class="' + puntero + '"></div>';

            if (puntero === 'cruz') {
                movsX += 1;
                contaMovsX.innerText = movsX + ' mv';
            } else {
                movsO += 1;
                contaMovsO.innerText = movsO + ' mv';
            }

            if (comprobarVictoria(puntero) === false) {
                iniciarTurno();
            } else {
                // Ha terminado la partida
                terminado = true;
                // Marcamos las casillas de la jugada ganadora con la clase variante "--final", que le dara color
                for (let id of jugadaGanadora) {
                    document.getElementById('ficha' + id).className = puntero + '--final';
                }

                partidaTerminada();
            }

            turno++;
            //console.log(turno);

            if (turno === 9 && terminado === false) {
                // Se han lanzado nueve fichas y no hay ganador, por tanto es un empate, y por tanto se termina la partida 
                terminado = true;

                partidaTerminada();
                

            } /* else if (puntero === "circulo" && terminado === false) { // Turno del ordenador, si el tablero no está lleno

                let seleccionFilaPC;
                let seleccionColumnaPC;
                do {
                    seleccionFilaPC = Math.floor(Math.random()*3);
                    seleccionColumnaPC = Math.floor(Math.random()*3);
                    //console.log(seleccionPC);
                } while (pulsar(document.getElementById('cas' + seleccionFilaPC + seleccionColumnaPC)) === false);
                iniciarTurno();
            } */

            return true;
        }
        else return false;
    }
    return false;
}

function partidaTerminada() {
    // Detenemos el segundero de los turnos
    clearInterval(contaTurno);

    // Vaciamos los listeners de las fichas para que el usuario ya no pueda interactuar con ellas
    fichaX.removeEventListener('mousedown', moverFicha);
    fichaO.removeEventListener('mousedown', moverFicha);
    fichaX.classList.remove('ficha--activa');
    fichaO.classList.remove('ficha--activa');
    contaTurnoX.classList.remove('contaTurno--activo');
    contaTurnoO.classList.remove('contaTurno--activo');
    fichaX.style='';
    fichaO.style='';

    // Mostramos el boton para acceder a la interfaz de resultados
    document.getElementById('btnResultados').style.visibility = 'visible';
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

    function arrastraFicha(event) {
        // Mueve la ficha con el ratón
        moveAt(event.pageX, event.pageY);
        
        // Esconde y muestra la ficha para poder detectar casillas vacías debajo
        ficha.style.display = 'none';
        ficha.childNodes[0].hidden = true;
        let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
        //console.log(elemBelow);
        ficha.style.display = 'flex';
        ficha.childNodes[0].hidden = false;

        // Mousemove se puede disparar fuera de la ventana al arrastrar la ficha fuera de la pantalla
        // Si clientX o clientY estan fuera de la ventana, elementFromPoint devuelve null
        if (!elemBelow || tiempoTurno === 0) return;

        // Las casillas donde se puede arrastrar tienen la clase "casilla"
        droppableBelow = elemBelow.closest('.casilla');

        if (currentDroppable != droppableBelow) {
            // Estamos entrando o saliendo de una casilla
            // Ambos valores pueden ser null
            // currentDroppable será null si no estamos sobre una casilla antes de este evento
            // droppableBelow será null si no estamos sobre una casilla ahora mismo durante este evento

            if (currentDroppable) {
                // En esta caso estaremos dejando una casilla, ejecutamos la funcion para eliminar el resaltado de la misma
                leaveDroppable(currentDroppable);
            }

            currentDroppable = droppableBelow;
            
            if (currentDroppable) {
                // Aqui estamos entrando en una casilla disponible, por lo que le aplicamos el resaltado
                enterDroppable(currentDroppable);
            }
        }
    }

    // La ficha se mueve con un mousemove que se escucha en document para que funcione todo el tiempo
    document.addEventListener('mousemove', arrastraFicha);

    // Se suelta la ficha, se elimina la escucha de mousemove.
    function soltarFicha() {
        if (currentDroppable) {
            leaveDroppable(currentDroppable);
            if (tiempoTurno != 0) pulsar(currentDroppable);
        }
        document.removeEventListener('mousemove', arrastraFicha);
        ficha.style = "";
    };

    ficha.addEventListener('mouseup', soltarFicha);
}

function enterDroppable(elem) {
    if(estaLibre(elem)) elem.classList.add('lanzable');
}

function leaveDroppable(elem) {
    elem.classList.remove('lanzable');
}




var btnJugar = document.querySelector('#jugar');
var btnSalir = document.querySelector('#salir');


// Reinicia los valores y vacía el casillero
/* btnJugar.addEventListener("click", function() {
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

}); */