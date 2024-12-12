'use strict'

/******* RESULTADOS ******/


/*************************** VARIABLES GLOBALES ***************************/

let nivel = parseInt(localStorage.getItem('nivel'));
let modo = parseInt(localStorage.getItem('modo'));
let numUsuario = parseInt(localStorage.getItem('userNum'));
let ganador = parseInt(localStorage.getItem('statGanador'));
let movimientos = parseInt(localStorage.getItem('statMovs'));
let tiempo = Math.round(parseInt(localStorage.getItem('statTiempo')) / 10);

// Constantes para los elementos a editar

const txtResultTitle = document.getElementById('txtResultTitle');
const txtResultTitTiempo = document.getElementById('txtResultTitTiempo');
const txtResultTiempo = document.getElementById('txtResultTiempo');
const txtResultTitMovs = document.getElementById('txtResultTitMovs');
const txtResultMovs = document.getElementById('txtResultMovs');


/******************** EVENTOS Y FUNCIONES ********************/

// Al cargar el documento, se registran los eventos de los botones y se muestran las estadísticas
document.addEventListener('DOMContentLoaded', () => {

    // Muestra las estadísticas y mensajes de resultados
    switch (ganador) {
        case -1: {
            txtResultTitle.innerText = '¡Ha habido un empate!';
            txtResultTitTiempo.innerText = 'A pesar de haber consumido...';
            txtResultTiempo.innerText = tiempo;
            txtResultTitMovs.innerText = 'Y de haber realizado...';
            txtResultMovs.innerText = movimientos;
            break;
        }
        case 1: {
            if (modo === 1) txtResultTitle.innerText = '¡Has ganado!';
            else txtResultTitle.innerText = '¡Ha ganado la cruz!';
            if (modo === 1) txtResultTitTiempo.innerText = 'Has conseguido vencer a la máquina en...';
            else txtResultTitTiempo.innerText = 'Para ello han hecho falta...';
            txtResultTiempo.innerText = tiempo;
            if (modo === 1) txtResultTitMovs.innerText = 'Has necesitado...';
            else txtResultTitMovs.innerText = 'La jugada ganadora ha necesitado...';
            txtResultMovs.innerText = movimientos;
            break;
        }
            
        case 2: {
            if (modo === 1) txtResultTitle.innerText = '¡Has perdido!';
            else txtResultTitle.innerText = '¡Ha ganado el círculo!';
            if (modo === 1) txtResultTitTiempo.innerText = 'La máquina te ha fundido en...';
            else txtResultTitTiempo.innerText = 'Para ello ha consumido...';
            txtResultTiempo.innerText = tiempo;
            txtResultTitMovs.innerText = 'La jugada ganadora ha necesitado...';
            txtResultMovs.innerText = movimientos;
            break;
        }
    }

    // Eventos en botones
    document.getElementById('btnSalir').addEventListener('click', function() {
        window.location.assign('index.html');
    });

    document.getElementById('btnJugar').addEventListener('click', function() {
        window.location.assign('bienvenida.html');
    });
});