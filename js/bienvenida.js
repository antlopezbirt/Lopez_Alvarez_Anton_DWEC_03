'use strict'

/******* BIENVENIDA ******/


/*************************** VARIABLES GLOBALES ***************************/

const usuario = JSON.parse(localStorage.getItem('usuarioIdentificado'));

// Si no hay usuario identificado, redirige al index.
if (usuario === null) window.location.assign('../index.html');

// Obtiene el nombre del usuario para mostrarlo en el interfaz
let nombreUsuario = usuario.nombre;

let nivel = 1;
let modo = 1;

// Registra los valores iniciales en Local Storage
localStorage.setItem('nivel', nivel);
localStorage.setItem('modo', modo);


/******************** EVENTOS Y FUNCIONES ********************/

// Al cargar el documento, se registran los eventos de los botones y se muestra el nombre del usuario
document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('btnPrincipiante').addEventListener('click', activarNivel);
    document.getElementById('btnIntermedio').addEventListener('click', activarNivel);
    document.getElementById('btnAvanzado').addEventListener('click', activarNivel);
    document.getElementById('btnAutomatico').addEventListener('click', activarModo);
    document.getElementById('btn1Jugador').addEventListener('click', activarModo);
    document.getElementById('btn2Jugadores').addEventListener('click', activarModo);

    document.getElementById('btnJugar').addEventListener('click', function() {
        window.location.assign('juego.html');
    });

    document.getElementById('nombreUsuario').innerText = nombreUsuario;
});

// Activa el nivel seleccionado al pinchar en un boton de nivel
function activarNivel() {
    // console.log("Nivel activado: ", this.value);
    nivel = this.value;
    for (let boton = 0; boton < this.parentElement.children.length; boton++) {
        this.parentElement.children[boton].classList.remove('boton--seleccionado')
    }

    this.classList.add('boton--seleccionado');

    // Registra el nivel seleccionado en Local Storage
    localStorage.setItem('nivel', nivel);
}

// Activa el modo seleccionado al pinchar en un boton de modo
function activarModo() {
    // console.log("Modo activado: ", this.value);
    modo = this.value;
    for (let boton = 0; boton < this.parentElement.children.length; boton++) {
        this.parentElement.children[boton].classList.remove('boton--seleccionado')
    }

    this.classList.add('boton--seleccionado');

    // Registra el modo seleccionado en Local Storage
    localStorage.setItem('modo', modo);
}