let chart;

document.getElementById('convert').addEventListener('click', async () => {
    const amount = document.getElementById('amount').value;
    const currency = document.getElementById('currency').value;
    const resultElement = document.getElementById('result');

    try {
        let data;
        try {
            const response = await fetch('https://mindicador.cl/api');
            data = await response.json();
        } catch (fetchError) {
            const offlineData = await fetch('mindicador.json');
            data = await offlineData.json();
        }

        if (!data[currency]) {
            throw new Error('Moneda no disponible');
        }

        const rate = data[currency].valor;
        const result = amount / rate;
        resultElement.textContent = `Resultado: ${result.toFixed(8)} ${currency.toUpperCase()}`;

        const historyResponse = await fetch(`https://mindicador.cl/api/${currency}`);
        const historyData = await historyResponse.json();
        const dates = historyData.serie.slice(0, 10).map(entry => entry.fecha);
        const values = historyData.serie.slice(0, 10).map(entry => entry.valor);

        const ctx = document.getElementById('historyChart').getContext('2d');

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates.map(date => new Date(date).toLocaleDateString()), 
            
                datasets: [{
                    label: `Valor de ${currency.toUpperCase()} en los últimos 10 días`,
                    data: values,
                    borderColor: '#d5c6dc', 
                    backgroundColor: 'rgba(255, 107, 129, 0.2)', 
                    pointBackgroundColor: '#d5c6dc', 
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: ''
                        }
                    },
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: ''
                        }
                    }
                }
            }
        });

    } catch (error) {
        resultElement.textContent = `Error: ${error.message}`;
    }
});
