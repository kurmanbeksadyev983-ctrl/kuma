
let chart;

const dataContainer = document.getElementById("dataContainer");

function addRow(label = "", value = "") {
    const row = document.createElement("div");
    row.className = "row";

    const nameInput = document.createElement("input");
    nameInput.placeholder = "Название";
    nameInput.value = label;
    nameInput.className = "data-label";

    const valueInput = document.createElement("input");
    valueInput.type = "number";
    valueInput.placeholder = "Значение";
    valueInput.value = value;
    valueInput.className = "data-value";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.type = "button";
    deleteButton.onclick = () => row.remove();

    row.append(nameInput, valueInput, deleteButton);
    dataContainer.appendChild(row);
}

function getData() {
    const labels = [];
    const values = [];

    document.querySelectorAll(".row").forEach(row => {
        const label = row.querySelector(".data-label").value;
        const value = row.querySelector(".data-value").value;

        if (label.trim() !== "" && value !== "") {
            labels.push(label);
            values.push(Number(value));
        }
    });

    return { labels, values };
}

function updateChart() {
    const { labels, values } = getData();

    if (labels.length === 0) {
        alert("Введите данные для диаграммы!");
        return;
    }

    const type = document.getElementById("chartType").value;
    const color = document.getElementById("chartColor").value;
    const title = document.getElementById("chartTitle").value;

    const colors = [
        color, "#06b6d4", "#f59e0b",
        "#10b981", "#ef4444", "#8b5cf6"
    ];

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(document.getElementById("myChart"), {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: values,
                backgroundColor: type === "pie" || type === "doughnut"
                    ? labels.map((_, i) => colors[i % colors.length])
                    : color,
                borderColor: color,
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: { size: 20 }
                },
                legend: {
                    display: true
                }
            }
        }
    });
}

function exportHTML() {
    const { labels, values } = getData();

    if (labels.length === 0) {
        alert("Сначала добавьте данные!");
        return;
    }

    const type = document.getElementById("chartType").value;
    const color = document.getElementById("chartColor").value;
    const title = document.getElementById("chartTitle").value;

    const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>${escapeHTML(title)}</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js"><\/script>
<style>
body {
    font-family: Arial;
    max-width: 900px;
    margin: 40px auto;
    padding: 20px;
}
</style>
</head>
<body>
<h2>${escapeHTML(title)}</h2>
<canvas id="chart"></canvas>
<script>
new Chart(document.getElementById("chart"), {
    type: ${JSON.stringify(type)},
    data: {
        labels: ${JSON.stringify(labels)},
        datasets: [{
            label: ${JSON.stringify(title)},
            data: ${JSON.stringify(values)},
            backgroundColor: ${JSON.stringify(
                type === "pie" || type === "doughnut"
                ? labels.map((_, i) => [
                    color, "#06b6d4", "#f59e0b",
                    "#10b981", "#ef4444", "#8b5cf6"
                ][i % 6])
                : color
            )},
            borderColor: ${JSON.stringify(color)},
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: ${JSON.stringify(title)}
            }
        }
    }
});
<\/script>
</body>
</html>`;

    const blob = new Blob([html], {
        type: "text/html;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "my-chart.html";
    link.click();

    URL.revokeObjectURL(url);
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// Начальные данные
addRow("Январь", 50);
addRow("Февраль", 80);
addRow("Март", 120);
addRow("Апрель", 100);

updateChart();
