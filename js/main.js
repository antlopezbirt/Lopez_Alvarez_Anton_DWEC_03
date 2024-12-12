'use strict'

/******* LOGIN ******/


/*************************** VARIABLES GLOBALES ***************************/

let usuariosJSON = null;
let usuariosJSONpath = '../data/usuarios.json';
let usuariosObj = null;

/************************** CARGA INICIAL DE DATOS ************************/

// Inicializa los eventos del formulario y carga los datos de usuarios
document.addEventListener('DOMContentLoaded', async () => {
    // Vacia el localStorage preventivamente para no mezclar datos de sesiones anteriores
    localStorage.clear();

    // Cargar los JSON cuando la página se carga, antes de cualquier interacción del usuario
    await cargarDatosUsuarios();

    usuariosObj = usuariosJSON;

    // Inicializar eventos el formularios
    document.getElementById('frmLogin').addEventListener('submit', chequearUsuario);
});

// Carga el fichero JSON de usuarios
async function cargarDatosUsuarios() {

    try {
        // Esperar a que ambos ficheros se carguen
        usuariosJSON = await cargarJSON(usuariosJSONpath);

        Object.entries(usuariosJSON).forEach(function([clave, valor]) {
            localStorage.setItem('user'+clave, JSON.stringify(valor));
        });

    } catch (error) {
        console.error('Error al cargar los ficheros JSON:', error);
    }
}

// Función para cargar un JSON desde una ruta específica
async function cargarJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Error al cargar el archivo JSON: ${path}`);
    }
    return await response.json();
}

function chequearUsuario(event) {
    event.preventDefault();
    const user = document.getElementById('txtUsuario').value;
    const pass = document.getElementById('txtPass').value;

    for (let i = 0; i <= (localStorage.length) - 1; i++) {
        var usu = JSON.parse(localStorage.getItem('user' + i));
        //console.log("Usuario iterado: ", usu.usuario);
        if (user === usu.usuario && pass === usu.contraseña) {
            document.getElementById('txtErrorLogin').classList.remove('visible');
            console.log('Usuario identificado: ', usu.usuario);
            localStorage.setItem('userNum', i);
            window.location.assign('bienvenida.html');
        }
    }

    document.getElementById('txtErrorLogin').classList.add('visible');

    return false;
}