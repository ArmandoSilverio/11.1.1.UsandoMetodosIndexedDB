function start() {
    cajadatos = document.getElementById('cajadatos');
    var boton = document.getElementById('grabar');
    boton.addEventListener('click', agregarObjeto, false);

    if ('webkitIndexedDB' in window) {
        window.indexedDB = window.webkitIndexedDB;
        window.IDBTransaction = window.webkitIDBTransaction;
        window.IDBKeyRange = window.webkitIDBKeyRange;
        window.IDBCursor = window.webkitIDBCursor;
    } else if ('mozIndexedDB' in window) {
        window.indexedDB = window.mozIndexedDB;
    }
    var solicitud = indexedDB.open('mibase');
    solicitud.addEventListener('error', errores, false);
    solicitud.addEventListener('success', crear, false);
} //Fin function start

function errores(e) {
    alert('Error: ' + e.code + ' ' + e.message);
}

//Version de la base de datos
function crear() {
    db = e.result || e.target.result;
    if (db.version == '') {
        var solicitud = db.setVersion('1.0');
        solicitud.addEventListener('error', errores, false);
        solicitud.addEventListener('success', crearbd, false)
    } //FIn if crear
} //Fin function crear

//Declarando Almacenes de Objetos e Indices
function crearbd() {
    var almacen = db.createObjectStore('peliculas', { keyPath: 'id' });
    almacen.createIndex('BuscarFecha', 'fecha', { unique: false });
} //Fin fucntion crearbd

//Agregando Objetos
function agregarObjeto() {
    var clave = document.getElementById('clave').value;
    var titulo = document.getElementById('titulo').value;
    var fecha = document.getElementById('fecha').value;

    var transaction = db.transaction(['peliculas'], IDBTransaction.READ_WRITE);
    var almacen = transaction.objectStore('peliculas');
    var solicitud = almacen.add({ id: clave, nombre: titulo, fecha: fecha });
    solicitud.addEventListener("success", function() {
        mostrar(clave)
    }, false);

    document.getElementById('clave').value = '';
    document.getElementById('titulo').value = '';
    document.getElementById('fecha').value = '';
} //Fin function agregarObjeto

//Leyendo y mostrando el objeto almacenado
function mostrar(clave) {
    var transaction = db.transaction(['peliculas']);
    var almacen = transaction.objectStore('peliculas');
    var solicitud = almacen.get(clave);
    solicitud.addEventListener('success', mostrarLista, false);
} //FIn function mostar

function mostrarLista(e) {
    var resultado = e.result || e.target.result;
    cajadatos.innerHTML = '<div>' + resultado.id + ' - ' + resultado.nombre + ' - ' + resultado.fecha + '</div>';
} //Fin function mostrarLista
window.addEventListener("load", start, false);