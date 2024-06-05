
// me permite borrar toda la info que tenía para luego colocarle nueva
function vaciar_matriz(matriz) {
    for (let k = 0; k < 5;) {
        if (matriz[k].length != 0) {
            matriz[k].pop();
        }
        else {
            k++;
        }
    }
}

// formar la matriz pertinente
function formacion_matriz(matriz) {
    vaciar_matriz(matriz);              // limpio matriz para volverla a construir con otros numeros
    let i = 0;
    for (let k = 0; k < 5;) {
        if (i < bloques_rodillo) {       // que tengo que escribir?
            if (i === 0 || i === 1 || (i >= 3 && (matriz[k][i - 2] === (multiplicador - 1) || matriz[k][i - 1] === (multiplicador - 1)))) {
                matriz[k].push(numero_random_condicionado());      //agrego 0-5 (sin posibilidad de 5)
            }
            else {
                matriz[k].push(numero_random());                       //agrego 0-6 (con posibilidad de 5)
            }
            i++;
        }
        else {
            k++;
            i = 0;
        }
    }
    if (tirada_especial === true) {
        multiple_tirada(matriz);
        tirada_especial = false;
    }
}

function multiple_tirada(matriz) {
    let cant = parseInt(Math.random() * multiplicador);   //minimo 3 scatters en diferentes columnas
    if (cant < 4) {
        cant = 3;
    }
    chequeo_scatters(matriz, cant);     // le paso la matriz y la cantidad de scatters a colocar
}

function chequeo_scatters(matriz, cant) {   // cant es la cantidad de scatters
    let control = 0;
    let control_2 = 0;
    cant_fija = cant;
    for (let i = 0; control < cant_fija; i++) {          // donde pongo los scatters?
        if (cant < rodillos - i) {
            control_2 = control;
            control += opciones_scatters(matriz, i); // le paso la matriz y la columna donde poner el scatter (opcional)
            if (control_2 != control) {
                cant--;
            }
        }
        else {
            control += coloco_scatters(matriz, i);  // caso cuando si o si tengo que poner los scatters
            cant--;
        }
    }
    return 0;
}

function opciones_scatters(matriz, posicion) {
    let numero = parseInt(Math.random() * multiplicador);
    if (numero >= 4) {
        coloco_scatters(matriz, posicion);
        return 1;
    }
    return 0;
}


function coloco_scatters(matriz, posicion) {
    // me sirve para las 2 rotaciones
    let numero = parseInt(Math.random() * 3);
    matriz[posicion][0 + numero] = multiplicador - 1;
    matriz[posicion][3 + numero] = multiplicador - 1;
    return 1;
}

// sólo un simbolo escatter por rodillo (SIN posibilidad de 5)
function numero_random_condicionado() {
    let numero = parseInt(Math.random() * (multiplicador - 1));
    return numero;
}

// (con posibilidad de 5)
function numero_random() {
    let numero = parseInt(Math.random() * multiplicador);
    return numero;
}

// Función para obtener el valor asociado cuando hay ganancia
function obtener_valor(num) {
    let resultado = imagenes.find((imagenes) => imagenes.numero === num);
    return resultado.valor;
}


function chequeo(vector, posicion) {
    let ganancia = 0;
    for (let i = 0; i < 3; i++) {
        ganancia += chequeo_tirada(vector[0][posicion + i], vector[1][posicion + i], vector[2][posicion + i], vector[3][posicion + i], vector[4][posicion + i], "la fila " + (i + 1));
    }

    let forma = "V";
    for (let i = 0; i < 3; i += 2) {
        ganancia += chequeo_tirada(vector[0][posicion + i], vector[1][posicion + 1], vector[2][posicion + 2 - i], vector[3][posicion + 1], vector[4][posicion + i], "forma " + forma);
        forma = "^";
    }

    forma = "˙˙·˙˙";
    for (let i = 0; i < 3; i += 2) {
        ganancia += chequeo_tirada(vector[0][posicion + i], vector[1][posicion + i], vector[2][posicion + 1], vector[3][posicion + i], vector[4][posicion + i], "forma " + forma);
        forma = "..·..";
    }

    forma = "·˙˙˙·";
    for (let i = 0; i < 3; i += 2) {
        ganancia += chequeo_tirada(vector[0][posicion + 1], vector[1][posicion + i], vector[2][posicion + i], vector[3][posicion + i], vector[4][posicion + 1], "forma " + forma);
        forma = "·...·";
    }
    return ganancia;
}

// chequeo_tirada_X me permite obtener valores correctos teniendo en cuenta que puede haber scatters(comodines)
function chequeo_tirada_1(num1, num2, num3, num4, num5, comodin) {
    let cantidad = 0;
    if ((num1 === num2 || num2 === comodin) && (num1 === num3 || num3 === comodin)) {
        if (num1 === num4 || num4 === comodin) {
            if (num1 === num5 || num5 === comodin) {
                cantidad = 5;
            }
            else {
                cantidad = 4;
            }
        }
        else {
            cantidad = 3;
        }
    }
    return cantidad;
}

function chequeo_tirada_2(num2, num4, num5, comodin) {
    let cantidad = 0;
    if (num2 === num4 || num4 === comodin) {
        if (num2 === num5 || num5 === comodin) {
            cantidad = 5;
        }
        else {
            cantidad = 4;
        }
    }
    else {
        cantidad = 3;
    }
    return cantidad;
}

function chequeo_tirada_3(num3, num4, num5, comodin) {
    let cantidad = 0;
    if (num3 === num4 || num4 === comodin) {
        if (num3 === num5 || num5 === comodin) {
            cantidad = 5;
        }
        else {
            cantidad = 4;
        }
    }
    else {
        cantidad = 3;
    }
    return cantidad;
}

function chequeo_tirada_4(num4, num5, comodin) {
    let cantidad = 0;
    if (num4 === num5 || num5 === comodin) {
        cantidad = 5;
    }
    else {
        cantidad = 4;
    }
    return cantidad;
}

// Función para chequear si hay ganancia en ese tiro
function chequeo_tirada(num1, num2, num3, num4, num5, forma) {
    let valor = 0;
    let comodin = multiplicador - 1;
    let ganancia = 0;
    let cantidad = 0;
    if (num1 != comodin) {
        cantidad = chequeo_tirada_1(num1, num2, num3, num4, num5, comodin);
        valor = obtener_valor(num1);
    }
    else if (num1 === comodin && num2 != comodin && (num2 === num3 || num3 === comodin)) {
        cantidad = chequeo_tirada_2(num2, num4, num5, comodin);
        valor = obtener_valor(num2);
    }
    else if (num1 === comodin && num2 === comodin && num3 != comodin) {
        cantidad = chequeo_tirada_3(num3, num4, num5, comodin);
        valor = obtener_valor(num3);
    }
    else if (num1 === comodin && num2 === comodin && num3 === comodin && num4 != comodin) {
        cantidad = chequeo_tirada_4(num4, num5, comodin);
        valor = obtener_valor(num4);
    }
    else if (num1 === comodin && num2 === comodin && num3 === comodin && num4 === comodin) {
        cantidad = 5;
        valor = obtener_valor(num5);
    }

    if (cantidad != 0) {
        ganancia = valor * cantidad * apuesta / 10;
        imprime_ganancia(cantidad, forma, ganancia);
    }
    return ganancia;
}

function imprime_ganancia(cantidad, forma, ganancia) {
    let gananciaElemento = document.createElement("p");
    gananciaElemento.textContent = "Linea de " + cantidad + " en " + forma + " = $" + ganancia;
    const contenedor_ganancia = document.getElementById("mostrar_ganancia");
    contenedor_ganancia.appendChild(gananciaElemento);
}

// Función para agregar los divs a una columna según un orden de imágenes dado
function agregarDivs(columna, ordenImagenesColumna) {
    // Calcular la cantidad de divs que se deben agregar
    let divsToAdd = (bloques_rodillo + 3) - columna.querySelectorAll(".cuadrado").length;

    // Agregar divs adicionales si es necesario
    for (let i = 0; i < divsToAdd; i++) {
        let imageIndex = ordenImagenesColumna[i % ordenImagenesColumna.length]; // Obtener el número que representa la imagen
        let imagenObj = imagenes.find(obj => obj.numero === imageIndex); // Buscar el objeto de imagen correspondiente
        columna.innerHTML += `<div class="cuadrado"><img src="${imagenObj.imagen}" alt="Descripción de la imagen"></div>`;
    }
}

// Iterar sobre cada columna y agregar los divs correspondientes
function inicial(vector, num) {
    formacion_matriz(vector);
    let columnas = document.querySelectorAll(".columna");
    columnas.forEach((columna, index) => {
        if (num === 0) {
            agregarDivs(columna, ordenImagenes[index]);
        }
        else {
            actualizar_imagenes(vector);
        }
    });
    return 1;
}

function actualizar_imagenes(matriz) {
    // Obtener todos los divs
    const divs = document.querySelectorAll('.cuadrado img');

    // Iterar sobre cada div y asignar la imagen correspondiente según la matriz
    divs.forEach((div, index) => {
        const columna = Math.floor(index / (bloques_rodillo + 3)); // Calcular la columna actual
        const fila = index % (bloques_rodillo + 3); // Calcular la fila actual

        // Obtener el número de la matriz correspondiente a la posición actual
        const numero = matriz[columna][fila];

        // Buscar la imagen correspondiente en el array de imágenes
        const imagenObj = imagenes.find(obj => obj.numero === numero);

        // Asignar la imagen al div
        if (imagenObj) {
            div.src = imagenObj.imagen;
        }
    });
}

function eliminar_texto_ganancia() {
    // Seleccionar el contenedor que contiene los elementos <p> que quieres eliminar
    const contenedor = document.getElementById("mostrar_ganancia");

    // Obtener todos los elementos <p> dentro del contenedor
    const parrafos = contenedor.getElementsByTagName("p");

    // Recorrer y eliminar cada párrafo
    while (parrafos.length > 0) {
        contenedor.removeChild(parrafos[0]);
    }
}


// Función principal para aplicar la animación a todos los rodillos (activada por el boton)
function animateElements(elements, activador, vector, apuesta) {
    if (tirada_especial === true) {
        apuesta = apuesta * multi_tirada_especial;
    }
    let ganancia = 0;
    // Verifica si la animación está en curso
    if (!animationInProgress) {
        // Borra los comentarios de ganancia anterior si es que hay
        eliminar_texto_ganancia();
        // Marca la animación como en curso
        animationInProgress = true;
        activador++;

        // Guarda la posición final de cada columna antes de eliminar la clase de animación
        const positions = [];
        elements.forEach(element => {
            positions.push(window.getComputedStyle(element).transform);
        });

        // Agrega las clases de animación correspondientes a cada elemento
        setTimeout(() => {
            elements.forEach((element, index) => {
                if (activador === 1) {
                    element.classList.add('animate');
                } else if (activador === 2) {
                    element.classList.add('animate_2');
                    element.classList.remove('animate');
                    // Restaura la posición final de la columna antes de aplicar la nueva animación
                    element.style.transform = positions[index];
                } else {
                    // Elimina la clase CSS "animate_2" del elemento (si está presente)
                    element.classList.remove('animate_2');
                    // Restaura la posición final de la columna antes de aplicar la primera animación
                    element.style.transform = positions[index];
                    element.classList.add('animate');
                }
            });
            setTimeout(() => {
                inicial(vector);
                if (activador === 2) {
                    ganancia = chequeo(vector, 0);
                }
                else {
                    ganancia = chequeo(vector, 3);
                }
            }, 1000);   // Breve retraso para que no se vea el cambio de imagenes
        }, 50); // Breve retraso para permitir el reflujo antes de agregar la clase de animación

        // Después de que termine la duración de la animación, marca la animación como completada
        setTimeout(() => {
            animationInProgress = false;
            saldo = calcular_saldo(ganancia, apuesta);
        }, 2000);
    }
    return activador;
}

function calcular_saldo(ganancia, apuesta) {
    let saldo_actual = saldo + ganancia - apuesta;
    imprimir_saldo(saldo_actual);
    return saldo_actual;
}

function imprimir_saldo(saldo_actual) {
    let saldoElemento = document.getElementById("saldo");
    saldoElemento.textContent = "saldo: " + saldo_actual;
    localStorage.setItem('fondo', saldo_actual);
}


// Función para aumentar el crédito
function aumentarCredito(apuesta) {
    let tiradaElemento = document.getElementById("credito-especial");
    let apuestaElemento = document.getElementById("apuesta");
    if (apuesta < apuesta_maxima) {
        apuesta += apuesta_minima;
    }
    // Actualizar el texto del elemento h2
    apuestaElemento.textContent = "crédito: " + apuesta;
    tiradaElemento.textContent = apuesta * multi_tirada_especial;
    return apuesta;
}

// Función para disminuir el crédito
function disminuirCredito(apuesta) {
    let tiradaElemento = document.getElementById("credito-especial");
    let apuestaElemento = document.getElementById("apuesta");
    if (apuesta > apuesta_minima) {
        apuesta -= apuesta_minima;
    }
    // Actualizar el texto del elemento h2
    apuestaElemento.textContent = "crédito: " + apuesta;
    tiradaElemento.textContent = apuesta * multi_tirada_especial;
    return apuesta;
}


// codigo main
const imagenes = [
    {
        numero: 0,
        valor: 1.5,
        imagen: 'assets/lannister.png'
    },
    {
        numero: 1,
        valor: 2,
        imagen: 'assets/targaryen.png'
    },
    {
        numero: 2,
        valor: 3,
        imagen: 'assets/baratheon.png'
    },
    {
        numero: 3,
        valor: 3,
        imagen: 'assets/stark.png'
    },
    {
        numero: 4,
        valor: 5,
        imagen: 'assets/cuervo.png'
    },
    {
        numero: 5,
        valor: 8,
        imagen: 'assets/trono.png'
    },
];

let ordenImagenes = [
    [],
    [],
    [],
    [],
    []
];

//constantes
const multi_tirada_especial = 3;
const rodillos = 5;
const bloques_rodillo = 10;
const multiplicador = 6;    // cantidad de logos
const apuesta_minima = 20;
const apuesta_maxima = 1000;

// variables a usar
let ganancia_total = 0;
let tiradas = 0;
let contador_total = 0;
let contador = 0;
let num_vueltas = 0;

// Variable global para saber si es una tirada especial o no
let tirada_especial = false;

// Variable global de estado para rastrear si la animación está en curso
let animationInProgress = false;

// Variable global del saldo
let saldo = 0;
if (!localStorage.getItem('fondo')) {
    // Si no hay nada guardado en 'fondo', asignar el valor 0 a 'fondo' y guardarlo en localStorage
    localStorage.setItem('fondo', saldo);
} else {
    saldo = JSON.parse(localStorage.getItem("fondo"));
    // Si ya hay algo guardado en 'fondo', obtenerlo , asignarlo a 'fondo' y parsearlo
}

// Variable del monto a apostar
let apuesta = apuesta_minima;
if (!localStorage.getItem('credito')) {
    // Si no hay nada guardado en 'credito', se guardado en localStorage el valor de la apuesta minima
    localStorage.setItem('credito', apuesta);
} else {
    // Si ya hay algo guardado en 'credito', obtenerlo y asignarlo a 'apuesta'
    apuesta = JSON.parse(localStorage.getItem("credito"));
}

let saldoElemento = document.getElementById("saldo");
saldoElemento.textContent = "saldo: " + saldo;

let apuestaElemento = document.getElementById("apuesta");
apuestaElemento.textContent = "crédito: " + apuesta;

let tiradaElemento = document.getElementById("credito-especial");
tiradaElemento.textContent = apuesta * multi_tirada_especial;


// seteo todo para que halla imagenes al ingresar
num_vueltas = inicial(ordenImagenes, num_vueltas);

// constantes del boton para animar las columnas
const button = document.getElementById('btngo');
const boxes = document.querySelectorAll('.columna');


// Agrega un "escuchador de eventos" al botón que se activa cuando el botón es cliqueado
button.addEventListener('click', () => {
    if (saldo >= apuesta && animationInProgress == false) {
        if (contador === 3) {
            contador = 1;
        }
        // Llamo a la funcion de animacion y de la que deriva todo
        contador = animateElements(boxes, contador, ordenImagenes, apuesta);
    }
});


// constantes del boton para subir el valor de la apuesta
const button_mas = document.getElementById('btn-mas');
// Agrega un "escuchador de eventos" al botón que se activa cuando el botón es clicado
button_mas.addEventListener('click', () => {
    if (animationInProgress == false) {
        apuesta = aumentarCredito(apuesta);
        localStorage.setItem('credito', apuesta);
    }
});

// constantes del boton para bajar el valor de la apuesta
const button_menos = document.getElementById('btn-menos');
// Agrega un "escuchador de eventos" al botón que se activa cuando el botón es clicado
button_menos.addEventListener('click', () => {
    if (animationInProgress == false) {
        apuesta = disminuirCredito(apuesta);
        localStorage.setItem('credito', apuesta);
    }
});


// constantes del boton e input de deposito
const button_deposito = document.getElementById('btndepo');
const input_deposito = document.getElementById('deposito');
button_deposito.addEventListener('click', () => {
    if (parseInt(input_deposito.value) > 0 && animationInProgress == false) {
        saldo = JSON.parse(localStorage.getItem("fondo")) + parseInt(input_deposito.value);
        Swal.fire({
            title: '¡Felicidades!',
            text: 'Su transacción se ha completado con éxito. ¡Bienvenido al juego!',
            icon: 'success',
            confirmButtonText: 'Cerrar',
            customClass: {
                confirmButton: 'custom-button',
            },
        })
        imprimir_saldo(saldo);
    }
});

// constantes del boton e input de retiro
const button_retiro = document.getElementById('btn-retiro');
const input_retiro = document.getElementById('retiro');
button_retiro.addEventListener('click', () => {
    if (parseInt(input_retiro.value) > 0 && parseInt(input_retiro.value) <= saldo && animationInProgress == false) {
        saldo = JSON.parse(localStorage.getItem("fondo")) - parseInt(input_retiro.value);
        Swal.fire({
            title: '¡Felicidades!',
            text: 'Su retiro se ha completado con éxito.',
            icon: 'success',
            confirmButtonText: 'Cerrar',
            customClass: {
                confirmButton: 'custom-button',
            },
        })
        imprimir_saldo(saldo);
    }
});

// constantes del boton para hacer tirada especial
const button_mult_tiradas = document.getElementById('btn-tirada-especial');
button_mult_tiradas.addEventListener('click', () => {
    if (saldo >= apuesta * multi_tirada_especial && animationInProgress == false) {
        if (contador === 3) {
            contador = 1;
        }
        tirada_especial = true;
        //Llamo a la funcion de animacion y de la que deriva todo
        contador = animateElements(boxes, contador, ordenImagenes, apuesta);
    }
});


// constantes del boton informativo
const button_informativo = document.getElementById('btn-inf');
button_informativo.addEventListener('click', () => {
    fetch('../json/archivo.json')
        .then(response => response.json())
        .then(posts => {
            // Construir el HTML para la lista
            let listHTML = '<ul>';
            posts.forEach(post => {
                listHTML += `<li>${post.nombre} - ${post.descripcion}</li>`;
            });
            listHTML += '</ul>';

            // Mostrar el modal de Swal.fire con la lista
            Swal.fire({
                title: 'Formas de ganar',
                html: listHTML,
                confirmButtonText: 'Cerrar'
            });
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
});