'use strict'

/******* LOGIN ******/


/*************************** VARIABLES GLOBALES ***************************/

let usuariosJSON = null;
let usuariosJSONpath = '../data/usuarios.json';
let usuariosObj = null;

let spanErrorLogin = null;
let spanOjo = null;
let formulario = null;

/************************** CARGA INICIAL DE DATOS ************************/

// Inicializa los eventos del formulario y carga los datos de usuarios
document.addEventListener('DOMContentLoaded', async () => {
    // Vacia el localStorage preventivamente para no mezclar datos de sesiones anteriores
    localStorage.clear();

    // Cargar los JSON cuando la página se carga, antes de cualquier interacción del usuario
    await cargarDatosUsuarios();

    usuariosObj = usuariosJSON;

    // Inicializar eventos del formulario
    document.getElementById('btnEntrar').addEventListener('click', chequearUsuario);
    document.getElementById('txtPass').addEventListener('focus', chkMostrarOjo);
    document.getElementById('txtPass').addEventListener('blur', chkMostrarOjo);
    document.getElementById('txtPass').addEventListener('keyup', chkMostrarOjo);
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

    // Se había algún mensaje de error anterior lo elimina
    if (document.getElementById('txtErrorLogin')) {
        document.getElementById('mainEntrada').removeChild(spanErrorLogin);
    }

    const user = document.getElementById('txtUsuario').value;
    const pass = document.getElementById('txtPass').value;
    // console.log("Usuario introducido: ", user);

    // Itera los usuarios registrados 
    for (let i = 0; i <= (localStorage.length) - 1; i++) {
        var usu = JSON.parse(localStorage.getItem('user' + i));
        // console.log("Usuario iterado: ", usu.usuario);

        if (user === usu.usuario) {
            if (pass === usu.contraseña) {
                console.log('Usuario identificado: ', usu.usuario);
                localStorage.setItem('userNum', i);
                window.location.assign('html/bienvenida.html');
                return true;
            // Si el usuario existe pero la contraseña está mal, muestra error de contraseña
            } else {
                mostrarErrorLogin('pass');
                return false;
            }
        }
    }

    // Muestra error de usuario (error de login genérico)
    mostrarErrorLogin('user');

    return false;
}

function mostrarErrorLogin(tipo) {
    spanErrorLogin = document.createElement("span");
    spanErrorLogin.setAttribute("id", "txtErrorLogin");
    spanErrorLogin.setAttribute("name", "txtErrorLogin");
    let textoErrorLogin = ""
    if (tipo === "user") textoErrorLogin = document.createTextNode("Login incorrecto");
    else if (tipo ==="pass") textoErrorLogin = document.createTextNode("Contraseña incorrecta");
    spanErrorLogin.appendChild(textoErrorLogin);

    document.getElementById('mainEntrada').appendChild(spanErrorLogin);
}

// Comprueba si debe mostrar el ojo del campo de contraseña o no, y lo hace
function chkMostrarOjo() {
    let contenidoPass = document.getElementById('txtPass');
    if (contenidoPass.value != '') {
        if (!document.getElementById('txtOjo')) {
            spanOjo = document.createElement('span');
            spanOjo.setAttribute('id', 'txtOjo');
            spanOjo.setAttribute('name', 'txtOjo');

            formulario = document.getElementById('fldstPass');

            // Muesta el ojo y registra el evento click para mostrar/ocultar el contenido de la contaseña
            formulario.appendChild(spanOjo);

            spanOjo.addEventListener('click', function() {
                if (contenidoPass.type === 'password') contenidoPass.type = 'text';
                else contenidoPass.type = 'password';
            });
        }

        return true;
    } else {
        if (document.getElementById('txtOjo')) {
            formulario.removeChild(spanOjo);

            // Preventivamente cambia el tipo del campo a password de nuevo
            contenidoPass.type = 'password';
        }
    }
}