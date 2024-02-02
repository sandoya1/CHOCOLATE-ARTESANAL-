let ingresos = [];
let egresos = [];
let editandoIndex = -1; // Variable para rastrear el índice de la transacción en edición

document.addEventListener('DOMContentLoaded', function () {
    ctx = document.getElementById('ingresosEgresosChart').getContext('2d');
    ingresosEgresosChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ingresos', 'Egresos'],
            datasets: [{
                label: 'Total',
                data: [0, 0],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    mostrarResumen();  // Inicializar el resumen al cargar la página
});

function agregarIngreso(event) {
    event.preventDefault();
    const descripcion = document.getElementById('ingresoDescripcion').value;
    const monto = parseFloat(document.getElementById('ingresoMonto').value);
    if (editandoIndex !== -1) {
        ingresos[editandoIndex] = { descripcion, monto };
        editandoIndex = -1; // Restablecer el índice de edición
    } else {
        ingresos.push({ descripcion, monto });
    }
    mostrarResumen();
    document.getElementById('ingresoDescripcion').value = '';
    document.getElementById('ingresoMonto').value = '';
    document.getElementById('agregarIngresoBtn').style.display = 'block'; // Mostrar el botón "Agregar Ingreso"
    document.getElementById('editarIngresoBtn').style.display = 'none'; // Ocultar el botón "Editar Ingreso"
}

function agregarEgreso(event) {
    event.preventDefault();
    const descripcion = document.getElementById('egresoDescripcion').value;
    const monto = parseFloat(document.getElementById('egresoMonto').value);
    if (editandoIndex !== -1) {
        egresos[editandoIndex] = { descripcion, monto };
        editandoIndex = -1; // Restablecer el índice de edición
    } else {
        egresos.push({ descripcion, monto });
    }
    mostrarResumen();
    document.getElementById('egresoDescripcion').value = '';
    document.getElementById('egresoMonto').value = '';
    document.getElementById('agregarEgresoBtn').style.display = 'block'; // Mostrar el botón "Agregar Egreso"
    document.getElementById('editarEgresoBtn').style.display = 'none'; // Ocultar el botón "Editar Egreso"
}

function calcularTotal(transacciones) {
    return transacciones.reduce((total, transaccion) => total + transaccion.monto, 0);
}

function mostrarResumen() {
    const totalIngresos = calcularTotal(ingresos);
    const totalEgresos = calcularTotal(egresos);
    const balance = totalIngresos - totalEgresos;

    document.getElementById('totalIngresos').textContent = totalIngresos.toFixed(2);
    document.getElementById('totalEgresos').textContent = totalEgresos.toFixed(2);
    document.getElementById('balance').textContent = balance.toFixed(2);

    // Actualiza el gráfico
    ingresosEgresosChart.data.datasets[0].data[0] = totalIngresos;
    ingresosEgresosChart.data.datasets[0].data[1] = totalEgresos;
    ingresosEgresosChart.update();

    // Actualizar listas de ingresos y egresos
    actualizarListaIngresos();
    actualizarListaEgresos();
}

function actualizarListaIngresos() {
    const listaIngresos = document.getElementById('listaIngresos');
    listaIngresos.innerHTML = '';
    ingresos.forEach((ingreso, index) => {
        const ingresoItem = document.createElement('li');
        ingresoItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        ingresoItem.innerHTML = `
            <span>${ingreso.descripcion}: $${ingreso.monto.toFixed(2)}</span>
            <div>
                <button onclick="editarIngreso(${index})" class="btn btn-secondary btn-sm">Editar</button>
                <button onclick="eliminarIngreso(${index})" class="btn btn-danger btn-sm">Eliminar</button>
            </div>
        `;
        listaIngresos.appendChild(ingresoItem);
    });
}

function actualizarListaEgresos() {
    const listaEgresos = document.getElementById('listaEgresos');
    listaEgresos.innerHTML = '';
    egresos.forEach((egreso, index) => {
        const egresoItem = document.createElement('li');
        egresoItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        egresoItem.innerHTML = `
            <span>${egreso.descripcion}: $${egreso.monto.toFixed(2)}</span>
            <div>
                <button onclick="editarEgreso(${index})" class="btn btn-secondary btn-sm">Editar</button>
                <button onclick="eliminarEgreso(${index})" class="btn btn-danger btn-sm">Eliminar</button>
            </div>
        `;
        listaEgresos.appendChild(egresoItem);
    });
}

function editarIngreso(index) {
    editandoIndex = index; // Establecer el índice de edición
    const ingreso = ingresos[index];
    document.getElementById('ingresoDescripcion').value = ingreso.descripcion;
    document.getElementById('ingresoMonto').value = ingreso.monto;
    document.getElementById('agregarIngresoBtn').style.display = 'none'; // Ocultar el botón "Agregar Ingreso"
    document.getElementById('editarIngresoBtn').style.display = 'block'; // Mostrar el botón "Editar Ingreso"
}

function editarEgreso(index) {
    editandoIndex = index; // Establecer el índice de edición
    const egreso = egresos[index];
    document.getElementById('egresoDescripcion').value = egreso.descripcion;
    document.getElementById('egresoMonto').value = egreso.monto;
    document.getElementById('agregarEgresoBtn').style.display = 'none'; // Ocultar el botón "Agregar Egreso"
    document.getElementById('editarEgresoBtn').style.display = 'block'; // Mostrar el botón "Editar Egreso"
}

function eliminarIngreso(index) {
    ingresos.splice(index, 1);
    mostrarResumen();
    document.getElementById('agregarIngresoBtn').style.display = 'block'; // Mostrar el botón "Agregar Ingreso"
    document.getElementById('editarIngresoBtn').style.display = 'none'; // Ocultar el botón "Editar Ingreso"
    document.getElementById('ingresoDescripcion').value = '';
    document.getElementById('ingresoMonto').value = '';
}

function eliminarEgreso(index) {
    egresos.splice(index, 1);
    mostrarResumen();
    document.getElementById('agregarEgresoBtn').style.display = 'block'; // Mostrar el botón "Agregar Egreso"
    document.getElementById('editarEgresoBtn').style.display = 'none'; // Ocultar el botón "Editar Egreso"
    document.getElementById('egresoDescripcion').value = '';
    document.getElementById('egresoMonto').value = '';
}
