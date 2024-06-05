const fs = require('fs');
const { Connection, Request, TYPES } = require('tedious');

let productos = []; // Definición de la variable global productos

// Configuración de la conexión a la base de datos
const config = {
    server: 'MSI\\SQLEXPRESS',
    authentication: {
        type: 'default',
        options: {
            userName: "app_user",
            password: "hola123"
        }
    },
    options: {
        port: 1433,
        database: 'MiBaseDeDatos',
        trustServerCertificate: true
    }
};

let connection = new Connection(config);

// Función para refrescar la conexión
function refreshConnection() {
    // Cierra la conexión existente
    connection.close();

    // Crea una nueva conexión
    connection = new Connection(config);

    // Manejadores de eventos y lógica de conexión para la nueva conexión
    connection.on('connect', async (err) => {
        if (err) {
            console.log("Error al conectarse en la base de datos:", err);
        } else {
            console.log("Conexión actualizada correctamente");

            try {
                // Volver a imprimir la tabla para ver los cambios
                await printTable();
                // Escribir los productos en el archivo productos.js
                writeProductsToFile();
            } catch (error) {
                console.error(error);
            } finally {
                connection.close();
            }
        }
    });

    connection.connect();
}

// Llamada a la función para refrescar la conexión
refreshConnection();

// Función para ejecutar una consulta SQL y obtener los productos de la tabla
async function printTable() {
    const query = "SELECT * FROM Productos";
    productos = []; // Reiniciar el arreglo de productos
    try {
        const rowCount = await executeSql(query);
        console.log(`${rowCount} filas encontradas`);
    } catch (err) {
        console.error("Error al ejecutar la consulta:", err);
    }
}

// Función para ejecutar una consulta SQL
function executeSql(query, parameters = []) {
    return new Promise((resolve, reject) => {
        const request = new Request(query, (err, rowCount) => {
            if (err) {
                return reject(err);
            }
            resolve(rowCount);
        });

        parameters.forEach(param => {
            request.addParameter(param.name, param.type, param.value);
        });

        request.on('row', (columns) => {
            const row = {};
            columns.forEach((column) => {
                row[column.metadata.colName] = column.value;
            });
            productos.push(row); // Agregar el producto al arreglo de productos
        });

        connection.execSql(request);
    });
}

// Función para escribir los productos en el archivo productos.js
function writeProductsToFile() {
    const productosString = JSON.stringify(productos, null, 2); // Formatear los datos con 2 espacios de indentación
    fs.writeFileSync('productos.json', productosString);
    console.log("Productos escritos en el archivo productos.json");
}

async function insertProduct(precio, descripcion, imagen) {
    const query = `INSERT INTO Productos (PRECIO, DESCRIPCION, IMAGEN) VALUES (@precio, @descripcion, @imagen)`;
    const parameters = [
        { name: 'precio', type: TYPES.Decimal, value: precio },
        { name: 'descripcion', type: TYPES.NVarChar, value: descripcion },
        { name: 'imagen', type: TYPES.VarBinary, value: imagen }
    ];

    try {
        const rowCount = await executeSql(query, parameters);
        console.log(`${rowCount} fila(s) insertada(s)`);
    } catch (err) {
        console.error("Error al insertar el producto:", err);
    }
}

async function readImageFromFile(imagePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

async function updateProduct(id, precio, descripcion, imagen) {
    const query = `UPDATE Productos SET PRECIO = @precio, DESCRIPCION = @descripcion, IMAGEN = @imagen WHERE ID = @id`;
    const parameters = [
        { name: 'id', type: TYPES.Int, value: id },
        { name: 'precio', type: TYPES.Decimal, value: precio },
        { name: 'descripcion', type: TYPES.NVarChar, value: descripcion },
        { name: 'imagen', type: TYPES.VarBinary, value: imagen }
    ];

    try {
        const rowCount = await executeSql(query, parameters);
        console.log(`${rowCount} fila(s) actualizada(s)`);
    }     catch (err) {
        console.error("Error al actualizar el producto:", err);
    }
}

async function deleteProduct(id) {
    const query = `DELETE FROM Productos WHERE ID = @id`;
    const parameters = [{ name: 'id', type: TYPES.Int, value: id }];

    try {
        const rowCount = await executeSql(query, parameters);
        console.log(`${rowCount} fila(s) eliminada(s)`);
    } catch (err) {
        console.error("Error al eliminar el producto:", err);
    }
}