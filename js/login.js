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

    
    txtUsuario.addEventListener('input', chequearBotonEntrar);
    txtPass.addEventListener('input', chequearBotonEntrar);

    txtPass.addEventListener('focus', chequearMostrarOjo);
    txtPass.addEventListener('blur', chequearMostrarOjo);
    txtPass.addEventListener('input', chequearMostrarOjo);

    btnEntrar.addEventListener('click', chequearUsuario);

    // El navegador puede rellenar automáticamante los datos de usuario, comprueba si hay que mostrar el ojo
    chequearMostrarOjo();
    chequearBotonEntrar();
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

// Comprueba si los caracteres introducidos en el campo de contraseña cumplen la restricción de alfanuméricos
function chequearCaracteres() {
    
}

// Comprueba si debe mostrar el ojo del campo de contraseña o no, y lo hace
function chequearMostrarOjo() {
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

// Si el campo de usuario o el de contraseña están vacíos, o si la contraseña tiene caracteres no válidos, se inhabilita el botón y devuelve false
function chequearBotonEntrar() {
    const usuario = txtUsuario.value;
    const pass = txtPass.value;
    const regex = new RegExp('^[a-z0-9]*$', 'i');

    eliminarErrorLogin();

    // Si la contraseña no es válida, desactiva el botón para evitar más comprobaciones
    if (!regex.test(pass)) {
        btnEntrar.disabled = true;
        mostrarErrorLogin('invalid');
        return false;

    // Si alguno de los campos está vacío, desactiva el botón igualmente
    } else if (usuario === '' || pass === '') {
        btnEntrar.disabled = true;
        return false;

    // En el resto de casos el botón estará activo
    } else {
        btnEntrar.disabled = false;
        return true;
    }
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

    eliminarErrorLogin();

    // Crea los elementos necesarios para mostrar el error
    spanErrorLogin = document.createElement("span");
    spanErrorLogin.setAttribute("id", "txtErrorLogin");
    spanErrorLogin.setAttribute("name", "txtErrorLogin");

    let texto = '';

    switch(tipo) {
        case 'user':
            texto = 'Usuario incorrecto';
            txtUsuario.classList.add('invalido');
            break;
        case 'pass':
            texto = 'Contraseña incorrecta';
            txtPass.classList.add('invalido');
            break;
        case 'invalid':
            texto = 'Contraseña inválida. Introduce solo letras y números.';
            txtPass.classList.add('invalido');
    }

    let textoErrorLogin = document.createTextNode(texto);

    spanErrorLogin.appendChild(textoErrorLogin);
    document.getElementById('mainEntrada').appendChild(spanErrorLogin);
}

function eliminarErrorLogin() {
    // Si había algún mensaje de error lo elimina
    if (spanErrorLogin != null) spanErrorLogin.remove();
    txtUsuario.classList.remove('invalido');
    txtPass.classList.remove('invalido');
}