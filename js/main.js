'use strict'

/******* LOGIN ******/


// ------------------------------ 1. VARIABLES GLOBALES ------------------------------
let usuariosJSON = null;
let usuariosJSONpath = '../data/usuarios.json';
let usuariosObj = null;

// ------------------------------ 2. CARGA INICIAL DE DATOS ------------------------------
// Esto inicializa los eventos del formulario y carga los datos iniciales
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar los JSON cuando la página se carga, antes de cualquier interacción del usuario
    await cargarDatosUsuarios();

    // mostrar datos en consola
    // console.log('Hola, estos son los datos de los usuarios: ', usuariosJSON);

    usuariosObj = usuariosJSON;
    //console.log(usuariosObj);
    // Inicializar eventos el formularios
    document.getElementById('frmLogin').addEventListener('submit', chequearUsuario);
});

// Función para cargar ambos ficheros JSON al cargar la página
async function cargarDatosUsuarios() {

    try {
        // Esperar a que ambos ficheros se carguen
        usuariosJSON = await cargarJSON(usuariosJSONpath);

        Object.entries(usuariosJSON).forEach(function([clave, valor]) {
            localStorage.setItem(clave, JSON.stringify(valor));
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
        var usu = JSON.parse(localStorage.getItem(i));
        // console.log("Usuario iterado: ", usu.usuario);
        if (user === usu.usuario && pass === usu.contraseña) {
            console.log("Usuario identificado: ", usu.usuario);
            return true;
        }
    }

    let spanErrorLogin = document.createElement("span");
    spanErrorLogin.setAttribute("id", "txtErrorLogin");
    spanErrorLogin.setAttribute("name", "txtErrorLogin");
    let textoErrorLogin = document.createTextNode("Login incorrecto");
    spanErrorLogin.appendChild(textoErrorLogin);

    document.getElementById('mainEntrada').appendChild(spanErrorLogin);

    return false;
}