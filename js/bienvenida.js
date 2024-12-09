'use strict'

/******* LOGIN ******/


// ------------------------------ 1. VARIABLES GLOBALES ------------------------------
let nivel = 1;
localStorage.setItem('nivel', nivel);
let modo = 1;
localStorage.setItem('modo', modo);

// ------------------------------ 2. CARGA INICIAL DE DATOS ------------------------------
// Esto inicializa los eventos del formulario y carga los datos iniciales
document.addEventListener('DOMContentLoaded', async () => {


    // mostrar datos en consola
    // console.log('Hola, estos son los datos de los usuarios: ', usuariosJSON);

    document.getElementById('btnPrincipiante').addEventListener('click', activarNivel);
    document.getElementById('btnIntermedio').addEventListener('click', activarNivel);
    document.getElementById('btnAvanzado').addEventListener('click', activarNivel);
    document.getElementById('btnAutomatico').addEventListener('click', activarModo);
    document.getElementById('btn1Jugador').addEventListener('click', activarModo);
    document.getElementById('btn2Jugadores').addEventListener('click', activarModo);
});

function chequearUsuario(event) {
    event.preventDefault();
    const user = document.getElementById('txtUsuario').value;
    const pass = document.getElementById('txtPass').value;

    for (let i = 0; i <= (localStorage.length) - 1; i++) {
        var usu = JSON.parse(localStorage.getItem(i));
        // console.log("Usuario iterado: ", usu.usuario);
        if (user === usu.usuario && pass === usu.contraseña) {
            document.getElementById('txtErrorLogin').classList.remove("visible");
            console.log("Usuario identificado: ", usu.usuario);

            return true;
        }
    }

    /*let spanErrorLogin = document.createElement("span");
    spanErrorLogin.setAttribute("id", "txtErrorLogin");
    spanErrorLogin.setAttribute("name", "txtErrorLogin");
    let textoErrorLogin = document.createTextNode("Login incorrecto");
    spanErrorLogin.appendChild(textoErrorLogin);

    document.getElementById('mainEntrada').appendChild(spanErrorLogin);*/

    document.getElementById('txtErrorLogin').classList.add("visible");

    return false;
}

function activarNivel() {
    console.log("Nivel activado: ", this.value);
    nivel = this.value;
    for (let boton = 0; boton < this.parentElement.children.length; boton++) {
        this.parentElement.children[boton].classList.remove('boton--seleccionado')
    }

    this.classList.add('boton--seleccionado');
    localStorage.setItem('nivel', nivel);
}

function activarModo() {
    console.log("Modo activado: ", this.value);
    modo = this.value;
    for (let boton = 0; boton < this.parentElement.children.length; boton++) {
        this.parentElement.children[boton].classList.remove('boton--seleccionado')
    }
    this.classList.add('boton--seleccionado');
    localStorage.setItem('modo', modo);
}