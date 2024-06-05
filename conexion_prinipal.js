const { Connection, Request, TYPES } = require('tedious');
const fs = require('fs');

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
                const imageBuffer = await readImageFromFile('targaryen.png');
                // await insertProduct(19.99, 'Nuevo Producto', imageBuffer);
                // await printTable();

                // Modificar un producto existente
                // await updateProduct(1, 29.99, 'Producto Modificado', imageBuffer);

                // Eliminar un producto por su ID
                // await deleteProduct(16);

                // Volver a imprimir la tabla para ver los cambios
                await printTable();
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
            console.log(row);
        });

        connection.execSql(request);
    });
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

async function printTable() {
    const query = "SELECT * FROM Productos";

    try {
        const rowCount = await executeSql(query);
        console.log(`${rowCount} filas encontradas`);
    } catch (err) {
        console.error("Error al ejecutar la consulta:", err);
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
    } catch (err) {
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
