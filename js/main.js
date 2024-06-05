
// Función para agregar tarjetas
function addCard(numero, valor, descripcion, imagen) {
    const cardHTML = `
            <article class="card">
                <div class="conteiner_img">
                    <img src="${imagen}" class="card-img-top" alt="...">
                </div>
                <div class="card-body">
                    <h3 class="card-title">$${valor}</h3>
                    <p class="card-text">${descripcion}</p>
                    <a href="#" class="btn btn-primary" id="card-${numero}">Agregar al carrito</a>
                </div>
            </article>`;

    const conteinerCards = document.getElementById('conteiner_cards');
    if (conteinerCards) {
        conteinerCards.innerHTML += cardHTML;
    }
}

// Función para inicializar la página de inicio
function initIndexPage() {
    // URL del archivo JSON
const url = './productos.json';

// Hacer una solicitud fetch para obtener el archivo JSON
fetch(url)
    .then(response => {
        // Verificar si la solicitud fue exitosa
        if (!response.ok) {
            throw new Error('Error al cargar el archivo JSON');
        }
        // Devolver el resultado como JSON
        return response.json();
    })
    .then(objeto => {
        for(let i=0; i<objeto.length;i++){
            console.log(objeto[i]); // Esto imprimirá el segundo producto
            addCard(objeto[i].ID, objeto[i].PRECIO, objeto[i].DESCRIPCION, "../assets/lannister.png");
        }
        console.log(objeto); // Esto imprimirá todos los productos objeto[i].IMAGEN
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Recorrer todo el array, objeto por objeto
    // for (const producto of productos) {
    //     addCard(producto.numero, producto.valor, producto.imagen, producto.descripcion);
    // }

    // Añadir event listeners después de que las tarjetas hayan sido añadidas al DOM
    productos.forEach(producto => {
        const button_card = document.getElementById('card-' + producto.numero);
        if (button_card) {
            button_card.addEventListener('click', () => {
                if (vector[producto.numero] < 1) {
                    console.log("Producto " + producto.numero + " agregado al carrito");
                    vector[producto.numero] += 1;
                    console.log(vector);
                    localStorage.setItem('myArray', JSON.stringify(vector));
                    // cartel de que se agregó el producto
                    Swal.fire({
                        title: "Good job!",
                        text: "You clicked the button!",
                        icon: "success"
                    });
                }

            });
        }
    });
}

// ACA ARRANCA EL CARRITO
// Función para inicializar la página del carrito
function initCartPage() {
    // Aquí puedes agregar lógica específica para la página del carrito
    console.log('Página del carrito cargada.');

    init_carrito();
    // Ejemplo: mostrar productos en el carrito usando `vector` para saber las cantidades
}

function init_carrito() {
    // Recorrer todo el array, objeto por objeto
    for (const producto of productos) {
        if (vector[producto.numero] > 0) {
            addCard_carrito(producto.numero, producto.valor, producto.descripcion, producto.imagen);
        }

    }
    // Añadir event listeners después de que las tarjetas hayan sido añadidas al DOM
    productos.forEach(producto => {
        const button_card = document.getElementById('card-' + producto.numero);
        if (button_card) {
            button_card.addEventListener('click', () => {
                if (vector[producto.numero] > 0) {
                    console.log("Producto " + producto.numero + " se elimino 1 unidad de este producto");
                    vector[producto.numero] -= 1;
                    console.log(vector);
                    localStorage.setItem('myArray', JSON.stringify(vector));
                    // Obtén una referencia al elemento párrafo por su ID
                    const miParrafo = document.getElementById('cantidad-' + producto.numero);
                    // Actualiza el contenido del párrafo
                    miParrafo.textContent = vector[producto.numero];
                    const conteinerCards = document.getElementById('carrito_container');
                    conteinerCards.innerHTML = "";
                    init_carrito();

                }

            });
        }
    });
}

function addCard_carrito(numero, valor, descripcion, imagen) {
    const cardHTML = `
            <article class="card">
                <div class="conteiner_img">
                    <img src="../${imagen}" class="card-img-top" alt="...">
                </div>
                <div class="cantidad"
                <p><span id="cantidad-${numero}" class="number">${vector[numero]}</span></p>
                </div>
                <div class="card-body">
                    <h3 class="card-title">$${valor}</h3>
                    <p class="card-text">${descripcion}</p>
                    <a href="#" class="btn btn-primary" id="card-${numero}">Eliminar 1</a>
                </div>
            </article>`;

    const conteinerCards = document.getElementById('carrito_container');
    if (conteinerCards) {
        conteinerCards.innerHTML += cardHTML;
    }
}

// Datos de los productos
let productos = [
    { numero: 0, valor: 100, imagen: 'assets/lannister.png', descripcion: 'aca viene la descripcion del producto' },
    { numero: 1, valor: 200, imagen: 'assets/targaryen.png', descripcion: 'aca viene la descripcion del producto' },
    { numero: 2, valor: 300, imagen: 'assets/baratheon.png', descripcion: 'aca viene la descripcion del producto' },
    { numero: 3, valor: 400, imagen: 'assets/stark.png', descripcion: 'aca viene la descripcion del producto' },
    { numero: 4, valor: 500, imagen: 'assets/cuervo.png', descripcion: 'aca viene la descripcion del producto' },
    { numero: 5, valor: 600, imagen: 'assets/trono.png', descripcion: 'aca viene la descripcion del producto' }
];



// Guardar el array en el localStorage
// El arreglo:
let vector = Array(productos.length).fill(0);

// Obtener el arreglo de localStorage
vector = localStorage.getItem('myArray');

// Se parsea para poder ser usado en js con JSON.parse :)
vector = JSON.parse(vector);




// Determinar qué página está cargada y ejecutar el código correspondiente
if (document.getElementById('conteiner_cards')) {
    initIndexPage();
} else if (document.getElementById('carrito_container')) {
    initCartPage();
}





// para agregar un nuevo producto:
// productos.push(new agregar_producto("6", "700", "pp", "descrip"));




// cambiar links por botones bonitos tanto en eliminar como en agregar al carrito


