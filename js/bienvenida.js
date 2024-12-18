'use strict'

/******* BIENVENIDA ******/


/*************************** VARIABLES GLOBALES ***************************/

const usuario = JSON.parse(localStorage.getItem('usuarioIdentificado'));

// Si no hay usuario identificado, redirige al index.
if (usuario === null) {
    alert('Usuario sin identificar.\nRedirigiendo a la página de entrada...');
    window.location.assign('../index.html');
}

// Obtiene el nombre del usuario para mostrarlo en el interfaz
const nombreUsuario = usuario.nombre;

// Registra los valores iniciales en Local Storage
localStorage.setItem('nivel', 1);
localStorage.setItem('modo', 1);


/******************** EVENTOS Y FUNCIONES ********************/

// Al cargar el documento, se registran los eventos de los botones y se muestra el nombre del usuario
document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('btnPrincipiante').addEventListener('click', activarOpcion);
    document.getElementById('btnIntermedio').addEventListener('click', activarOpcion);
    document.getElementById('btnAvanzado').addEventListener('click', activarOpcion);
    document.getElementById('btnAutomatico').addEventListener('click', activarOpcion);
    document.getElementById('btn1Jugador').addEventListener('click', activarOpcion);
    document.getElementById('btn2Jugadores').addEventListener('click', activarOpcion);

    document.getElementById('btnJugar').addEventListener('click', function() {
        window.location.assign('juego.html');
    });

    document.getElementById('nombreUsuario').innerText = ", " + nombreUsuario;
});

// Activa y actualiza la opción seleccionada al pinchar en los botones de opciones
function activarOpcion(event) {
    let botonActivado = event.target;

    // Cambia el nivel o el modo seleccionado en Local Storage, según la opción elegida
    if (botonActivado.parentElement.id.includes("Niveles"))
        guardarValor('nivel', botonActivado.value);
    else guardarValor('modo', botonActivado.value);
    
    // Cambia la apariencia de los botones desactivados
    Array.from(botonActivado.parentElement.children).forEach(boton => {
        boton.classList.remove('boton--seleccionado');
    });

    // Cambia la apariencia del botón activado
    botonActivado.classList.add('boton--seleccionado');
}

// Guarda la opción si realmente es necesario porque ha cambiado
function guardarValor(clave, valor) {
    if (localStorage.getItem(clave) != valor)
        localStorage.setItem(clave, valor);
}