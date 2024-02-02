// JavaScript: balance.js

document.addEventListener('DOMContentLoaded', () => {
    const ingresos = JSON.parse(localStorage.getItem('ingresos')) || [];
    const egresos = JSON.parse(localStorage.getItem('egresos')) || [];
    mostrarTotales(ingresos, egresos); // Mostrar los totales cuando se cargue el DOM
    inicializarGraficoResumen(ingresos, egresos);
});

function mostrarTotales(ingresos, egresos) {
    // Calcula los totales
    const totalIngresos = ingresos.reduce((sum, { monto }) => sum + parseFloat(monto), 0);
    const totalEgresos = egresos.reduce((sum, { monto }) => sum + parseFloat(monto), 0);
    const balance = totalIngresos - totalEgresos;

    // Muestra los totales en el documento
    document.getElementById('totalIngresosTexto').textContent = `Total Ingresos: $${totalIngresos.toFixed(2)}`;
    document.getElementById('totalEgresosTexto').textContent = `Total Egresos: $${totalEgresos.toFixed(2)}`;
    document.getElementById('balanceTotalTexto').textContent = `Balance: $${balance.toFixed(2)}`;
}

function inicializarGraficoResumen(ingresos, egresos) {
    const ctx = document.getElementById('resumenChart').getContext('2d');
    if (ctx) {
        const totalIngresos = ingresos.reduce((sum, { monto }) => sum + parseFloat(monto), 0);
        const totalEgresos = egresos.reduce((sum, { monto }) => sum + parseFloat(monto), 0);

        resumenChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Ingresos', 'Egresos'], // Etiquetas para el eje X
                datasets: [{
                    label: 'Total',
                    data: [totalIngresos, totalEgresos],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.6)', // Color para ingresos
                        'rgba(255, 99, 132, 0.6)'  // Color para egresos
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)', 
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false // Ocultar leyenda ya que solo hay un dataset
                    },
                    title: {
                        display: true,
                        text: 'Resumen de Ingresos y Egresos'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Monto ($)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Categoría'
                        }
                    }
                }
            }
        });
    } else {
        console.error('No se encontró el elemento del canvas para el gráfico.');
    }
}
