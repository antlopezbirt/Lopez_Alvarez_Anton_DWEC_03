'use strict'

/*************************** VARIABLES GLOBALES ***************************/

// Sonido de la ficha al caer en el casillero
let audioFicha = new Audio('../media/audio/ficha.mp3');

let nivel = parseInt(localStorage.getItem('nivel'));
let modo = parseInt(localStorage.getItem('modo'));


// El tiempo total de juego está fijado en 100 segundos
// Se pone un segundo menos porque el 100 está ya pintado al inicio
let tiempoJuego = 99;

// El switch asigna el tiempo del turno correspondiente al nivel seleccionado, medido en decimas de segundo
let tiempoTurno = 0;

switch (nivel) {
    case 0: {
        // Principiante
        tiempoTurno = 80;
        break;
    }
    case 1: {
        // Intermedio
        tiempoTurno = 40;
        break;
    }
    case 2: {
        // Avanzado
        tiempoTurno = 20;
        break;
    }
    default:
        tiempoTurno = 40;
}

let nombreJugadorX = null;
let nombreJugadorO = null;

// Asigna los nombres de los jugadores según el modo seleccionado
switch (modo) {
    case 0: {
        // Maquina vs. Maquina
        nombreJugadorX = 'Computer';
        nombreJugadorO = 'Computer';
        break;
    }
    case 1: {
        // Jugador vs. Máquina
        nombreJugadorX = 'Jugador 1';
        nombreJugadorO = 'Computer';
        break;
    }
    case 2: {
        // Jugador vs. Jugador
        nombreJugadorX = 'Jugador 1';
        nombreJugadorO = 'Jugador 2';
        break;
    }
    default:
        nombreJugadorX = 'Jugador 1';
        nombreJugadorO = 'Computer';
}

let tiempoTurnoActual = tiempoTurno -1; // Se pone un segundo menos aquí también para no repetir el que ya viene pintado

// El puntero es el símbolo que hay que pintar en cada turno (cruz o círculo)
let puntero = "";

// Se podría haber hecho también con casillas de numeración correlativa, pero se ha decidido hacer mediante una matriz
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
const txtNombreJugador1 = document.getElementById('nombreJugadorX');
const txtNombreJugador2 = document.getElementById('nombreJugadorO');

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
let empate = false;

// Variables para los diferentes contadores
let turno = 0; // Numero de movimientos totales
let contaTurno = null; // Manejador de los tiempos de turno
let contaJuego = null; // Manejador del tiempo total de juego
let movsX = 0; // Movimientos realizados por el jugador de las cruces
let movsO = 0; // Movimientos realizados por el jugador de los círculos

// Variable que conserva la jugada ganadora para marcarla cuando se produzca
let jugadaGanadora = [];

// Evento que se dispara a discreción por el programa para forzar el soltado de la ficha cuando se agota el tiempo de turno
const eventoSoltarRaton = new Event('mouseup', { bubbles: false, cancelable: false })
const eventoClick = new Event('click', { bubbles: false, cancelable: false })

// Casilla sobre la que se encuentra la ficha previamente
let casillaActual = null;

// Casilla sobre la que se encuentra la ficha ahora
let casillaDebajo = null;

let arrastrarFicha = null;


/*********************** INICIALIZACIÓN DEL JUEGO ****************************/

document.addEventListener('DOMContentLoaded', () => {
    // Registra los eventos de las fichas 
    if (modo != 0) fichaX.addEventListener('mousedown', moverFicha);
    if (modo === 2) fichaO.addEventListener('mousedown', moverFicha);

    // Si se descomenta se podrá jugar también pinchando en el tablero, al estilo clásico
    // for (let casilla of casillas) {
    //     casilla.addEventListener("click", function() {
    //         pulsar(casilla);
    //     });
    // }

    // Pone los nombres de los jugadores
    txtNombreJugador1.innerText = nombreJugadorX;
    txtNombreJugador2.innerText = nombreJugadorO;

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
        window.location.assign("../index.html");
    }
}

// Cambia de turno
function iniciarTurno() {

    // Disparamos un evento mouseup en ambas fichas para forzar el soltado de la ficha anterior
    if (puntero === "cruz") fichaX.dispatchEvent(eventoSoltarRaton);
    else fichaO.dispatchEvent(eventoSoltarRaton);

    //if (arrastrarFicha) document.removeEventListener('mousemove', arrastrarFicha);

    // Para el segundero actual y reinicia el tiempo para el nuevo turno
    clearInterval(contaTurno);
    tiempoTurnoActual = (tiempoTurno - 1);

    // Si la partida no ha terminado, continua el siguiente turno
    if (terminado === false) {

        // Vacia los listeners del turno anterior, reinicia valores y cambia el puntero
        if (puntero === "cruz") {
            puntero = "circulo";
            fichaX.removeEventListener('mousedown', moverFicha);
            fichaX.classList.remove('ficha--activa');
            contaTurnoX.classList.remove('contaTurno--activo');
            txtTiempoTurnoX.innerText = '0';

            if (modo === 2) {
                fichaO.addEventListener('mousedown', moverFicha);
                fichaO.classList.add('ficha--activa');
            }
            contaTurnoO.classList.add('contaTurno--activo');
            txtTiempoTurnoO.innerText = tiempoTurno / 10;
        } else {
            puntero = "cruz";
            fichaO.removeEventListener('mousedown', moverFicha);
            fichaO.classList.remove('ficha--activa');
            contaTurnoO.classList.remove('contaTurno--activo');
            txtTiempoTurnoO.innerText = '0';

            if (modo != 0) {
                fichaX.addEventListener('mousedown', moverFicha);
                fichaX.classList.add('ficha--activa');
            }
            contaTurnoX.classList.add('contaTurno--activo');
            txtTiempoTurnoX.innerText = tiempoTurno / 10;
        }

        // Pone en marcha el segundero del nuevo turno
        contaTurno = setInterval(temporizadorTurno, 100);

        // Si estamos en el modo 0 solo juega la máquina, se disparan solos todos los turnos
        // Y si estamos en el modo 1, la computadora juega sola con el círculo
        if (terminado === false && (modo === 0 || (modo === 1 && puntero === "circulo" && turno < 8))) {

            // Hace tantos intentos de buscar una casilla como el tiempo del turno se lo permita
            setTimeout(async function() {
                let seleccionFilaPC;
                let seleccionColumnaPC;
                let intentos = 0;
                // Deja un pequeño margen para que no se pisen los turnos al ser una funcion async
                let limiteIntentos = tiempoTurno - 15;
                let casillaLibre = false;
                let casillaSorteada  = null;
                while (intentos < limiteIntentos && casillaLibre === false) {
                    // El PC elige una fila y columna al azar, tiene cero inteligencia :-D
                    seleccionFilaPC = Math.floor(Math.random()*3);
                    seleccionColumnaPC = Math.floor(Math.random()*3);
                    
                    // Obtiene las coordenadas de la casilla sorteada
                    casillaSorteada = document.getElementById('cas' + seleccionFilaPC + seleccionColumnaPC);
                    let rect = casillaSorteada.getBoundingClientRect();

                    // Mueve la ficha sobre la casilla
                    if (puntero === "cruz") {
                        fichaX.style.position = 'absolute';
                        fichaX.style.zIndex = 1000;
                        fichaX.style.left = rect.left - 10 + 'px';
                        fichaX.style.top = rect.top - 10 + 'px';
                        
                    } else {
                        fichaO.style.position = 'absolute';
                        fichaO.style.zIndex = 1000;
                        fichaO.style.left = rect.left + 10 + 'px';
                        fichaO.style.top = rect.top - 10 + 'px';
                    }
                    // Fuerza una pequeña espera para que se pueda ver el movimiento de la máquina
                    await new Promise(r => setTimeout(r, 100));

                    // Las fichas vuelven a su sitio
                    fichaX.removeAttribute('style');
                    fichaO.removeAttribute('style');

                    intentos++;

                    casillaLibre = estaLibre(casillaSorteada);
                }
                
                // Si está libre, se coloca la ficha definitivamente
                pulsar(casillaSorteada);

            }, 1000);
        }
    }
}

// Controla el curso del tiempo de cada turno
function temporizadorTurno() {
    // Si el tiempo se acaba, cambia de turno
    if (tiempoTurnoActual === 0) iniciarTurno();
    // Si no, actualiza el segundero correspondiente y recorta un segundo
    else {
        if (puntero === "cruz") txtTiempoTurnoX.innerText = Math.trunc(tiempoTurnoActual / 10) + 1;
        else txtTiempoTurnoO.innerText = Math.trunc(tiempoTurnoActual / 10) + 1;
        tiempoTurnoActual -= 1;
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
    // Evita seleccionar elementos al pinchar y arrastrar para evitar bugs
    event.preventDefault();

    // Vaciamos posibles valores anteriores para evitar bugs
    casillaActual = null;

    // Detecta que ficha ha provocado el evento y la guarda para trabajar con ella.
    // Si se pincha sobre las lineas de la figura (cruz o circulo), se elige al elemento padre, que es la ficha
    let ficha = event.target;
    if (ficha.classList.contains('cruz') || ficha.classList.contains('circulo')) {
        ficha = ficha.parentElement;
    }

    // Añade los registros de eventos correspondientes.

    // La ficha se mueve con un mousemove
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
        // Evita seleccionar elementos al pinchar y arrastrar para evitar bugs
        event.preventDefault();

        // Mueve la ficha con el ratón
        if (tiempoTurnoActual > 1) moverA(event.pageX, event.pageY);
        
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
            // Esta entrando o saliendo de una casilla
            // Ambos valores pueden ser null:
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
            ficha.removeEventListener('mousedown', moverFicha);
            if (tiempoTurnoActual != 0) pulsar(casillaActual);
        }
        
        //ficha.dispatchEvent(eventoSoltarRaton);
        ficha.removeAttribute('style');
        document.removeEventListener('mousemove', arrastrarFicha);
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

            // Muestra la ficha (el puntero) en la casilla elegida
            casilla.classList.remove('casilla--vacia');
            casilla.childNodes[0].classList.add(puntero);

            // Suena el efecto de sonido de la ficha
            audioFicha.play();

            // Se incrementa el numero de turno
            turno++;

            if (puntero === 'cruz') {
                movsX += 1;
                contaMovsX.innerText = movsX + ' mv';
            } else {
                movsO += 1;
                contaMovsO.innerText = movsO + ' mv';
            }

            if (comprobarVictoria(puntero) === false) {
                // Si se han lanzado nueve fichas y no hay ganador, es un empate, y por tanto se termina la partida 
                if (turno === 9) {
                    terminado = true;
                    empate = true;
                    partidaTerminada();
                    return true;

                // En caso contrario, sigue jugando
                } else iniciarTurno();

            // Si hay victoria, tambien se acaba la partida
            } else {
                terminado = true;
                // Marcamos las casillas de la jugada ganadora con la clase variante "--final", que le dara color
                for (let id of jugadaGanadora) {
                    document.getElementById('ficha' + id).className = puntero + '--final';
                }

                partidaTerminada();
                return true;
            }
            return true;
        }
        else return false;
    }
    partidaTerminada();
    return true;
}

// Función que comprueba si se ha conseguido un tres en raya.
function comprobarVictoria(puntero) {

    let resultados = 0;
    let longitud = casillero[0].length; // Se podría poner un tres. De este modo se deja la puerta abierta a crear un tablero de dimensiones variables.

    // Busca el nº de ocurrencias en cada fila, itera las filas y filtra los valores para contar resultados.
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
    resultados =  [...casillero].reverse().map((valor, indice) => valor[indice]).filter((v) => (v === puntero)).length;
    if (resultados > 2) return true;

    return false;
}

// Acciones a realizar cuando se ha terminado la partida
function partidaTerminada() {

    // Detiene el segundero de los turnos
    clearInterval(contaTurno);

    // Detiene el tiempo de juego
    clearInterval(contaJuego);

    // Vacia los listeners de las fichas
    fichaX.removeEventListener('mousedown', moverFicha);
    fichaO.removeEventListener('mousedown', moverFicha);
    fichaX.classList.remove('ficha--activa');
    fichaO.classList.remove('ficha--activa');
    contaTurnoX.classList.remove('contaTurno--activo');
    contaTurnoO.classList.remove('contaTurno--activo');
    fichaX.removeAttribute('style');
    fichaO.removeAttribute('style');

    // Guarda las estadisticas en LocalStorage

    // En este caso son segundos, por eso lo pasa a décimas para que el calculo de estadisticas sea homogeneo.
    localStorage.setItem('statTiempo', (100 - tiempoJuego - 1) * 10);

    if (empate === true) {
        localStorage.setItem('statGanador', -1);
        localStorage.setItem('statMovs', movsX + movsO);
    }
    else if (puntero === 'cruz') {
        localStorage.setItem('statGanador', 1);
        localStorage.setItem('statMovs', movsX);
    } else {
        localStorage.setItem('statGanador', 2);
        localStorage.setItem('statMovs', movsO);
    }

    // Espera un instante antes de redirigir a resultados para que dé tiempo a ver el final
    setTimeout(function() { window.location.assign('resultados.html'); }, 2000);
}