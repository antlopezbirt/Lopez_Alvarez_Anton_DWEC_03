'use strict'

/******* LOGIN ******/


/*************************** VARIABLES GLOBALES ***************************/

let usuariosJSON = null;
let usuariosJSONpath = '../data/usuarios.json';
let usuariosObj = null;

const txtUsuario = document.getElementById('txtUsuario');
const txtPass = document.getElementById('txtPass');
const btnEntrar = document.getElementById('btnEntrar');

let spanErrorLogin = null;

/************************** CARGA INICIAL DE DATOS ************************/

// Inicializa los eventos del formulario y carga los datos de usuarios
document.addEventListener('DOMContentLoaded', async () => {
    // Vacia el localStorage preventivamente para no usar datos de sesiones anteriores
    localStorage.clear();

    // Cargar el JSON cuando la página se carga, antes de cualquier interacción del usuario
    await cargarDatosUsuarios();

    // Inicializar eventos del formulario

    btnEntrar.disabled = true;
    
    txtUsuario.addEventListener('input', chkBotonEntrar);
    txtPass.addEventListener('input', chkBotonEntrar);

    txtPass.addEventListener('focus', chkMostrarOjo);
    txtPass.addEventListener('blur', chkMostrarOjo);
    txtPass.addEventListener('input', chkMostrarOjo);

    btnEntrar.addEventListener('click', chequearUsuario);
});

// Carga el fichero JSON de usuarios
async function cargarDatosUsuarios() {

    try {
        // Esperar a que el fichero se cargue
        usuariosJSON = await cargarJSON(usuariosJSONpath);

        // Almacena los usuarios en Local Storage
        localStorage.setItem('usuarios', JSON.stringify(usuariosJSON));

    } catch (error) {
        console.error('Error al cargar el fichero JSON:', error);
    }
}

// Función para cargar un JSON desde una ruta específica
async function cargarJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Error al cargar el fichero JSON: ${path}`);
    }
    return await response.json();
}

// Si el campo de usuario o el de contraseña están vacíos, se inhabilita el botón
function chkBotonEntrar() {
    const usuario = txtUsuario.value;
    const pass = txtPass.value;
    
    btnEntrar.disabled = !(usuario && pass);
}

function chequearUsuario(event) {
    // Evitamos la función submit
    event.preventDefault();

    // Asigna a constantes los elementos a utilizar
    const user = txtUsuario.value;
    const pass = txtPass.value;

    // Recupera en un objeto los usuarios de Local Storage
    const usuarios = JSON.parse(localStorage.getItem('usuarios'));

    // Busca el usuario introducido
    const usuario = usuarios.find(usu => usu.usuario === user);

    // Si existe el usuario y coincide con la contraseña, se "loguea".
    if (usuario) {
        if (pass === usuario.contraseña) {
            // Elimina posibles errores mostrados previamente
            eliminarErrorLogin()

            // Libera los datos de todos los usuarios y se queda con el usuario identificado
            localStorage.removeItem('usuarios');
            localStorage.setItem('usuarioIdentificado', JSON.stringify(usuario));

            // Nos redirige al siguiente interfaz
            window.location.assign('html/bienvenida.html');
            return true;

        // Si el usuario existe pero la contraseña está mal, muestra error de contraseña
        } else {
            mostrarErrorLogin('pass');
            txtPass.focus();
            txtPass.select();
            return false;
        }

    // Si llega aquí es que el usuario está vacío o no existe. Muestra error de usuario.
    } else {
        mostrarErrorLogin('user');
        txtUsuario.focus();
        txtUsuario.select();
        return false;
    }
}

// Muestra un error de login según el tipo que sea
function mostrarErrorLogin(tipo) {

    

    // Crea los elementos necesarios para mostrar el error
    spanErrorLogin = document.createElement("span");
    spanErrorLogin.setAttribute("id", "txtErrorLogin");
    spanErrorLogin.setAttribute("name", "txtErrorLogin");

    let textoErrorLogin = ""
    if (tipo === "user") textoErrorLogin = document.createTextNode("Login incorrecto");
    else if (tipo ==="pass") textoErrorLogin = document.createTextNode("Contraseña incorrecta");

    spanErrorLogin.appendChild(textoErrorLogin);
    document.getElementById('mainEntrada').appendChild(spanErrorLogin);
}

function eliminarErrorLogin() {
    // Si había algún mensaje de error lo elimina
    if (spanErrorLogin != null) spanErrorLogin.remove();
}


// Comprueba si debe mostrar el ojo del campo de contraseña o no, y lo hace
function chkMostrarOjo() {
    let fieldsetPass= document.getElementById('fldstPass');
    let spanOjo = null;

    if (txtPass.value != '') {
        if (!document.getElementById('txtOjo')) {
            spanOjo = document.createElement('span');
            spanOjo.setAttribute('id', 'txtOjo');
            spanOjo.setAttribute('name', 'txtOjo');

            // Muesta el ojo y registra el evento click para mostrar/ocultar el contenido de la contaseña
            fieldsetPass.appendChild(spanOjo);

            spanOjo.addEventListener('click', function() {
                if (txtPass.type === 'password') txtPass.type = 'text';
                else txtPass.type = 'password';
            });
        }

        return true;
    } else {
        // Si el campo de contraseña se vacía y el usuario pincha fuera, eliminamos el ojo y volvemos a tipo password
        if (document.getElementById('txtOjo') && document.activeElement != txtPass) {
            // Elimina el ojo
            document.getElementById('txtOjo').remove();

            // Preventivamente cambia el tipo del campo a password de nuevo
            txtPass.type = 'password';
        }
    }
}