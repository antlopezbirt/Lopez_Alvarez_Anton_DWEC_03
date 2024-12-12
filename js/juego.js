'use strict'

/*************************** VARIABLES GLOBALES ***************************/

let nivel = localStorage.getItem('nivel');
let modo = localStorage.getItem('nivel');

// El tiempo total de juego está fijado en 100 segundos
// Se pone un segundo menos porque el 100 está ya pintado al inicio
let tiempoJuego = 99;

// El switch asigna el tiempo del turno correspondiente al nivel seleccionado (8, 4 o 2 segundos)
let tiempoTurno = 4;

switch (nivel) {
    case 0:
        // Principiante
        tiempoTurno = 8;
        break;
    case 1:
        // Intermedio
        tiempoTurno = 4;
        break;
    case 2:
        // Avanzado
        tiempoTurno = 2;
        break;
    default:
        tiempoTurno = 4;
}

let tiempoTurnoActual = tiempoTurno -1; // Se pone un segundo menos aquí también para no repetir el que ya está pintado

// El puntero es el símbolo que hay que pintar en cada turno (cruz o círculo)
let puntero = "";

// Se podría haber hecho también con casillas de numeración correlativa, pero se ha hecho mediante una matriz
let casillero = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
]

// Se asignan en constantes todos los elementos que interactuarán con los eventos del juego

// Descomentar si se quiere tener también la opción de jugar clicando en las casillas (modo clasico)
//const casillas = document.querySelectorAll("div[id^='cas']");

// Fichas
const fichaX = document.getElementById('fichasX');
const fichaO = document.getElementById('fichasO');

// Si se pincha directamente en la figura de la ficha, se necesita acceder su elemento padre
let padre = null;

// Contador de tiempo general
const txtTiempoJuego = document.getElementById('tiempoJuego');

// Contadores que contienen los segunderos de turno y cambian de color
const contaTurnoX = document.getElementById('contaTurnoX');
const contaTurnoO = document.getElementById('contaTurnoO');

// Elemento con el valor de los segunderos
const txtTiempoTurnoX = document.getElementById('contaTurnoX');
const txtTiempoTurnoO = document.getElementById('contaTurnoO');

// Contadores de los movimientos de cada jugador
const contaMovsX = document.getElementById('contaMovsX');
const contaMovsO = document.getElementById('contaMovsO');

// Boton para acceder a los resultados
const btnResultados = document.querySelector('#btnResultados');

// Guarda el estado terminado o no de la partida
let terminado = false;

// Variables para los diferentes contadores
let turno = 0; // Numero de movimientos totales
let contaTurno = null; // Manejador de los tiempos de turno
let contaJuego = null; // Manejador del tiempo total de juego
let movsX = 0; // Movimientos realizados por el jugador de las cruces
let movsO = 0; // Movimientos realizados por el jugador de los círculos

// Variable que conserva la jugada ganadora para marcarla cuando se produzca
let jugadaGanadora = [];

// Evento que se dispara a discreción por el programa para forzar el soltado de la ficha cuando se agota el tiempo de turno
const eventoSoltarRaton = new Event('mouseup', { bubbles: true, cancelable: false })

// Casilla sobre la que se encuentra la ficha previamente
let casillaActual = null;

// Casilla sobre la que se encuentra la ficha ahora
let casillaDebajo = null;


/*********************** INICIALIZACIÓN DEL JUEGO ****************************/

document.addEventListener('DOMContentLoaded', () => {
    // Registra los eventos de las fichas
    fichaX.addEventListener('mousedown', moverFicha);
    fichaO.addEventListener('mousedown', moverFicha);

    // Si se descomenta se podrá jugar también pinchando en el tablero, al estilo clásico
    // for (let casilla of casillas) {
    //     casilla.addEventListener("click", function() {
    //         pulsar(casilla);
    //     });
    // }

    // Se inicia el contador general y el primer turno
    contaJuego = setInterval(temporizadorJuego, 1000);
    iniciarTurno();
});

/*********************** CONTROL DE TIEMPO Y DE TURNOS ***********************/

// Actualiza el temporizador general. Al agotar el tiempo redirige a la pantalla de login
function temporizadorJuego() {
    txtTiempoJuego.innerText = tiempoJuego;
    tiempoJuego -= 1;
    if (tiempoJuego === -1) {
        window.location.assign("index.html");
    }
}

// Cambia de turno
function iniciarTurno() {

    // Disparamos un evento mouseup en ambas fichas para forzar el soltado de la ficha anterior
    fichaX.dispatchEvent(eventoSoltarRaton);
    fichaO.dispatchEvent(eventoSoltarRaton);

    // Para el segundero actual y reinicia el tiempo para el nuevo turno
    clearInterval(contaTurno);
    tiempoTurnoActual = tiempoTurno -1;

    // Si la partida no ha terminado, continua el siguiente turno
    if (terminado === false) {

        // Vacia los listeners del turno anterior, reinicia valores y cambia el puntero
        if (puntero === "cruz") {
            puntero = "circulo";
            fichaX.removeEventListener('mousedown', moverFicha);
            fichaX.classList.remove('ficha--activa');
            contaTurnoX.classList.remove('contaTurno--activo');
            txtTiempoTurnoX.innerText = '0';

            fichaO.addEventListener('mousedown', moverFicha);
            fichaO.classList.add('ficha--activa');
            contaTurnoO.classList.add('contaTurno--activo');
            txtTiempoTurnoO.innerText = tiempoTurno;
        } else {
            puntero = "cruz";
            fichaO.removeEventListener('mousedown', moverFicha);
            fichaO.classList.remove('ficha--activa');
            contaTurnoO.classList.remove('contaTurno--activo');
            txtTiempoTurnoO.innerText = '0';

            fichaX.addEventListener('mousedown', moverFicha);
            fichaX.classList.add('ficha--activa');
            contaTurnoX.classList.add('contaTurno--activo');
            txtTiempoTurnoX.innerText = tiempoTurno;
        }

        // Pone en marcha el segundero del nuevo turno
        contaTurno = setInterval(temporizadorTurno, 1000);
    }
}

// Controla el curso del tiempo de cada turno
function temporizadorTurno() {
    // Si el tiempo se acaba, cambia de turno
    if (tiempoTurnoActual === 0) iniciarTurno();
    // Si no, actualiza el segundero correspondiente y recorta un segundo
    else {
        if (puntero === "cruz") txtTiempoTurnoX.innerText = tiempoTurnoActual;
        else txtTiempoTurnoO.innerText = tiempoTurnoActual;
        tiempoTurnoActual -=1;
    }
}


/****************************  MECANICA DE JUEGO *****************************/

// Comprueba si una casilla esta libre o no
function estaLibre(casilla) {
    // Si esta libre, true. Si no, false.
    if (posicionCasillero(casilla) === 0) return true;
    return false;
}

// Obtiene la posición de la casilla en la matriz del casillero a partir de su ID
function posicionCasillero(casilla) {
    // Transforma los ID de las casillas a filas y columnas para consultar el array del casillero
    let fila = parseInt(casilla.id.charAt(3));
    let columna = parseInt(casilla.id.charAt(4));

    return casillero[fila][columna];
}


// Funcion que mueve a la ficha siguiendo al raton. Se activa al hacer mousedown sobre una ficha.
// Tiene anidadas las funciones moverA, arrastrarFicha y soltarFicha, directamente ligadas al evento mousedown
function moverFicha(event) {

    // Detecta que ficha ha provocado el evento y la guarda para trabajar con ella.
    // Si se pincha sobre las lineas de la figura (cruz o circulo), se elige al elemento padre, que es la ficha
    let ficha = event.target;
    if (ficha.classList.contains('cruz') || ficha.classList.contains('circulo')) {
        ficha = ficha.parentElement;
    }

    // Añade los registros de eventos correspondientes.

    // La ficha se mueve con un mousemove que se escucha en document para que funcione todo el tiempo
    document.addEventListener('mousemove', arrastrarFicha);

    // Si se hace mouseup en la ficha, se suelta la ficha
    ficha.addEventListener('mouseup', soltarFicha);

    // Prepara la ficha para moverla: le da posicion absoluta y la levanta en el eje Z
    ficha.style.position = 'absolute';
    ficha.style.zIndex = 1000;

    // Hace un centrado inicial de la ficha en el puntero del raton
    moverA(event.pageX, event.pageY);

    // Mueve la ficha a las coordenadas pageX y pageY del puntero del raton
    function moverA(pageX, pageY) {
        ficha.style.left = pageX - ficha.offsetWidth / 2 + 'px';
        ficha.style.top = pageY - ficha.offsetHeight / 2 + 'px';
    }

    // Mueve la ficha adonde vaya el raton
    function arrastrarFicha(event) {
        // Mueve la ficha con el ratón
        moverA(event.pageX, event.pageY);
        
        // Al moverse, continuamente se esconde y se muestra la ficha para detectar si casillas vacías debajo
        ficha.style.display = 'none';
        ficha.childNodes[0].hidden = true;

        let elemDebajo = document.elementFromPoint(event.clientX, event.clientY);

        ficha.style.display = 'flex';
        ficha.childNodes[0].hidden = false;

        // Mousemove se puede disparar fuera de la ventana al arrastrar la ficha fuera de la pantalla
        // Si clientX o clientY estan fuera de la ventana, elementFromPoint devuelve null
        // Si se acaba el tiempo, salimos de esta funcion
        if (!elemDebajo) return;

        // Las casillas donde se puede arrastrar tienen la clase "casilla"
        casillaDebajo = elemDebajo.closest('.casilla');

        if (casillaActual != casillaDebajo) {
            // Estamos entrando o saliendo de una casilla
            // Ambos valores pueden ser null
            // casillaActual será null si no estamos sobre una casilla antes de este evento
            // casillaDebajo será null si no estamos sobre una casilla ahora mismo durante este evento

            if (casillaActual) {
                // En esta caso estaremos dejando una casilla, ejecutamos la funcion para eliminar el resaltado de la misma
                saleDeCasilla(casillaActual);
            }

            casillaActual = casillaDebajo;
            
            if (casillaActual) {
                // Aqui estamos entrando en una casilla disponible, por lo que le aplicamos el resaltado
                entraEnCasilla(casillaActual);
            }
        }
    }

    // Se suelta la ficha, se elimina la escucha de mousemove.
    function soltarFicha() {
        if (casillaActual) {
            saleDeCasilla(casillaActual);
            if (tiempoTurnoActual != 0) pulsar(casillaActual);
        }
        document.removeEventListener('mousemove', arrastrarFicha);
        // Se recoloca la ficha en su posicion original
        ficha.style = '';
    };

    // Al entrar en una casilla libre, se aplica un efecto a la misma
    function entraEnCasilla(elem) {
        if(estaLibre(elem)) elem.classList.add('lanzable');
    }

    // Al salir de una casilla, se elimina el posible efecto que tenga
    function saleDeCasilla(elem) {
        elem.classList.remove('lanzable');
    }
}


// Coloca la ficha lanzada en la casilla
function pulsar(casilla)  {

    if (terminado === false) {
        
        if (estaLibre(casilla)) {
            let fila = parseInt(casilla.id.charAt(3));
            let columna = parseInt(casilla.id.charAt(4));

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
    // Detiene el segundero de los turnos
    clearInterval(contaTurno);

    // Vacia los listeners de las fichas
    fichaX.removeEventListener('mousedown', moverFicha);
    fichaO.removeEventListener('mousedown', moverFicha);
    fichaX.classList.remove('ficha--activa');
    fichaO.classList.remove('ficha--activa');
    contaTurnoX.classList.remove('contaTurno--activo');
    contaTurnoO.classList.remove('contaTurno--activo');
    fichaX.style='';
    fichaO.style='';

    // Guarda las estadisticas en LocalStorage


    // Mostramos el boton para acceder a la interfaz de resultados
    document.getElementById('btnResultados').style.visibility = 'visible';
}


// Función que comprueba si en la última jugada se ha conseguido un tres en raya.
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