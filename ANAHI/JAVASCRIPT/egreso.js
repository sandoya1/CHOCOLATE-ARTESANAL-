let editandoEgreso = null;
let egresos = [];
let egresosChart;

document.addEventListener('DOMContentLoaded', (event) => {
    inicializar();
});

function inicializar() {
    inicializarGraficoEgresos();
    actualizarResumenEgresos();
}

function mostrarSeccion(seccion) {
    // Implementar lógica para mostrar y ocultar secciones
    // Por ejemplo, ocultar todas las secciones y mostrar solo la que se seleccionó
}

function agregarMovimiento(tipo, event) {
    event.preventDefault();

    const descripcionInput = document.getElementById('egresoDescripcion');
    const montoInput = document.getElementById('egresoMonto');
    const descripcion = descripcionInput.value;
    const monto = parseFloat(montoInput.value);

    if (descripcion && !isNaN(monto)) {
        const listaEgresos = document.getElementById('listaEgresos');
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        li.dataset.id = editandoEgreso ? editandoEgreso.dataset.id : Date.now().toString();
        li.dataset.descripcion = descripcion;
        li.dataset.monto = monto;

        // Crear contenedor para la descripción y el monto
        const div = document.createElement('div');
        div.textContent = `${descripcion} - $${monto}`;
        li.appendChild(div);

        // Crear contenedor para los botones
        const buttonsContainer = document.createElement('div');

        // Botón de editar
        const editButton = document.createElement('button');
        editButton.classList.add('btn', 'btn-primary', 'btn-sm', 'me-2'); // me-2 para agregar margen a la derecha
        editButton.textContent = 'Editar';
        editButton.onclick = function() { editarEgreso(this); };
        buttonsContainer.appendChild(editButton);

        // Botón de eliminar
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
        deleteButton.textContent = 'Eliminar';
        deleteButton.onclick = function() { eliminarEgreso(this); };
        buttonsContainer.appendChild(deleteButton);

        // Agregar contenedor de botones al elemento li
        li.appendChild(buttonsContainer);

        if (editandoEgreso) {
            listaEgresos.replaceChild(li, editandoEgreso);
            egresos = egresos.map(egreso => egreso.id === editandoEgreso.dataset.id ? { ...egreso, descripcion, monto } : egreso);
            editandoEgreso = null;
        } else {
            listaEgresos.appendChild(li);
            egresos.push({ id: li.dataset.id, descripcion, monto });
        }

        actualizarResumenEgresos();
        descripcionInput.value = '';
        montoInput.value = '';
    }
}

function editarEgreso(button) {
    const li = button.parentElement.parentElement;
    document.getElementById('egresoDescripcion').value = li.dataset.descripcion;
    document.getElementById('egresoMonto').value = li.dataset.monto;
    editandoEgreso = li;
}

function eliminarEgreso(button) {
    const li = button.parentElement.parentElement;
    egresos = egresos.filter(egreso => egreso.id !== li.dataset.id);
    li.remove();
    actualizarResumenEgresos();
}

function actualizarResumenEgresos() {
    let totalEgresos = egresos.reduce((total, egreso) => total + parseFloat(egreso.monto), 0);
    document.getElementById('totalEgresos').textContent = totalEgresos.toFixed(2);
    actualizarGraficoEgresos(totalEgresos);
}

function inicializarGraficoEgresos() {
    const ctx = document.getElementById('egresosChart').getContext('2d');
    egresosChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Egresos'],
            datasets: [{
                label: 'Total de Egresos',
                data: [0],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                borderRadius: 20,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Resumen de Egresos'
                },
                tooltip: {
                    usePointStyle: true,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        callback: function(value, index, values) {
                            return '$' + value;
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            elements: {
                bar: {
                    borderWidth: 2,
                }
            }
        }
    });
}

function actualizarGraficoEgresos(totalEgresos) {
    egresosChart.data.datasets.forEach((dataset) => {
        dataset.data = [totalEgresos];
    });
    egresosChart.update();
}


function actualizarResumenEgresos() {
    let totalEgresos = egresos.reduce((total, egreso) => total + parseFloat(egreso.monto), 0);
    document.getElementById('totalEgresos').textContent = totalEgresos.toFixed(2);
    actualizarGraficoEgresos();
    
    // Guardar los egresos actualizados en localStorage
    localStorage.setItem('egresos', JSON.stringify(egresos));
}


function inicializar() {
    // Cargar egresos desde localStorage si existen, de lo contrario, usar un array vacío
    egresos = JSON.parse(localStorage.getItem('egresos')) || [];
    inicializarGraficoEgresos();
    actualizarResumenEgresos();
}

function actualizarGraficoEgresos() {
    egresosChart.data.labels = egresos.map(egreso => egreso.descripcion);
    egresosChart.data.datasets.forEach((dataset) => {
        dataset.data = egresos.map(egreso => egreso.monto);
    });
    egresosChart.update();
}


function eliminarTodosLosEgresos() {
    // Vaciar el array de egresos
    egresos = [];
    
    // Actualizar el localStorage
    localStorage.setItem('egresos', JSON.stringify(egresos));
    
    // Actualizar la interfaz de usuario
    const listaEgresos = document.getElementById('listaEgresos');
    listaEgresos.innerHTML = '';  // Vaciar la lista en el DOM
    
    // Actualizar el resumen y el gráfico
    actualizarResumenEgresos();
}
