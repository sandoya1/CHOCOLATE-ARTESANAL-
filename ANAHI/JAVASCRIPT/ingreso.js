let editandoIngreso = null;
let ingresos = [];
let ingresosChart;

document.addEventListener('DOMContentLoaded', (event) => {
    inicializar();
});

function inicializar() {
    inicializarGraficoIngresos();
    actualizarResumenIngresos();
}

function mostrarSeccion(seccion) {
    // Implementar lógica para mostrar y ocultar secciones
}

function agregarMovimiento(tipo, event) {
    event.preventDefault();

    const descripcionInput = document.getElementById('ingresoDescripcion');
    const montoInput = document.getElementById('ingresoMonto');
    const descripcion = descripcionInput.value;
    const monto = parseFloat(montoInput.value);

    if (descripcion && !isNaN(monto)) {
        const listaIngresos = document.getElementById('listaIngresos');
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        li.dataset.id = editandoIngreso ? editandoIngreso.dataset.id : Date.now().toString();
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
        editButton.classList.add('btn', 'btn-primary', 'btn-sm', 'me-2');
        editButton.textContent = 'Editar';
        editButton.onclick = function() { editarIngreso(this); };
        buttonsContainer.appendChild(editButton);

        // Botón de eliminar
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
        deleteButton.textContent = 'Eliminar';
        deleteButton.onclick = function() { eliminarIngreso(this); };
        buttonsContainer.appendChild(deleteButton);

        // Agregar contenedor de botones al elemento li
        li.appendChild(buttonsContainer);

        if (editandoIngreso) {
            listaIngresos.replaceChild(li, editandoIngreso);
            ingresos = ingresos.map(ingreso => ingreso.id === editandoIngreso.dataset.id ? { ...ingreso, descripcion, monto } : ingreso);
            editandoIngreso = null;
        } else {
            listaIngresos.appendChild(li);
            ingresos.push({ id: li.dataset.id, descripcion, monto });
        }

        actualizarResumenIngresos();
        descripcionInput.value = '';
        montoInput.value = '';
    }
}

function editarIngreso(button) {
    const li = button.parentElement.parentElement;
    document.getElementById('ingresoDescripcion').value = li.dataset.descripcion;
    document.getElementById('ingresoMonto').value = li.dataset.monto;
    editandoIngreso = li;
}

function eliminarIngreso(button) {
    const li = button.parentElement.parentElement;
    ingresos = ingresos.filter(ingreso => ingreso.id !== li.dataset.id);
    li.remove();
    actualizarResumenIngresos();
}

function actualizarResumenIngresos() {
    let totalIngresos = ingresos.reduce((total, ingreso) => total + parseFloat(ingreso.monto), 0);
    document.getElementById('totalIngresos').textContent = totalIngresos.toFixed(2);
    actualizarGraficoIngresos();
}

function inicializarGraficoIngresos() {
    const ctx = document.getElementById('ingresosChart').getContext('2d');
    ingresosChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Total de Ingresos',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
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
                    text: 'Resumen de Ingresos'
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

function actualizarGraficoIngresos() {
    ingresosChart.data.labels = ingresos.map(ingreso => ingreso.descripcion);
    ingresosChart.data.datasets.forEach((dataset) => {
        dataset.data = ingresos.map(ingreso => ingreso.monto);
    });
    ingresosChart.update();
}









function actualizarResumenIngresos() {
    let totalIngresos = ingresos.reduce((total, ingreso) => total + parseFloat(ingreso.monto), 0);
    document.getElementById('totalIngresos').textContent = totalIngresos.toFixed(2);
    actualizarGraficoIngresos();
    
    // Guardar los ingresos actualizados en localStorage
    localStorage.setItem('ingresos', JSON.stringify(ingresos));
}


function inicializar() {
    // Cargar ingresos desde localStorage si existen, de lo contrario, usar un array vacío
    ingresos = JSON.parse(localStorage.getItem('ingresos')) || [];
    inicializarGraficoIngresos();
    actualizarResumenIngresos();
}



function eliminarTodosLosIngresos() {
    // Vaciar el array de ingresos
    ingresos = [];
    
    // Actualizar el localStorage
    localStorage.setItem('ingresos', JSON.stringify(ingresos));
    
    // Actualizar la interfaz de usuario
    const listaIngresos = document.getElementById('listaIngresos');
    listaIngresos.innerHTML = '';  // Vaciar la lista en el DOM
    
    // Actualizar el resumen y el gráfico
    actualizarResumenIngresos();
}
