const nav = document.getElementById("nav")
const basics = document.getElementById("Basics") 
const insruments = document.getElementById("Insruments")
nav.addEventListener('click', function() {
    const navStyle = parseInt(window.getComputedStyle(nav).top);
    nav.style.top = navStyle === 0 ? "-500px" : "0px"
})
nav.addEventListener('dblclick', function() {
    window.location.href = "index.html"
})



basics.addEventListener(('click'), function() {
    window.location.href = 'basics.html'
})
insruments.addEventListener(('click'), function() {
    window.location.href = 'insruments.html'
})





// Добавить обработчики для всех пунктов меню
document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('click', () => {
        const pageMap = {
            'Виды излучения': '#types',
            'Природные источники': '#sources',
            'Технологии и ЭМИ': '#tech',
            'Диапазоны частот': '#freq',
            'Интересные факты': '#facts'
        };
        
        const anchor = pageMap[item.textContent.trim()];
        if (anchor) {
            window.location.href = `basics.html${anchor}`;
        }
    });
});

// Для других страниц (пример для "Риски и угрозы")
const influence = document.getElementById("Influence");
if (influence) {
    influence.addEventListener('click', () => {
        window.location.href = 'influence.html';
    });
}




// Сортировка таблицы
function sortTable(column) {
    const table = document.getElementById("dynamicTable");
    const rows = Array.from(table.rows).slice(1); // Исключаем заголовок
    const isNumeric = !isNaN(parseFloat(rows[0].cells[column].getAttribute('data-sort')));
    
    rows.sort((a, b) => {
        const aVal = a.cells[column].getAttribute('data-sort') || a.cells[column].innerText;
        const bVal = b.cells[column].getAttribute('data-sort') || b.cells[column].innerText;
        
        return isNumeric ? 
            parseFloat(aVal) - parseFloat(bVal) :
            aVal.localeCompare(bVal);
    });

    // Перезаписываем тело таблицы
    table.tBodies[0].append(...rows);
}

// Поиск по таблице
document.getElementById("searchInput").addEventListener("input", function(e) {
    const filter = e.target.value.toLowerCase();
    const rows = document.querySelectorAll("#dynamicTable tbody tr");
    
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(filter) ? "" : "none";
    });
});


// Обработка новых пунктов меню
document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('click', () => {
        const pageMap = {
            'Риски и угрозы': 'influence.html#risks',
            'Методы защиты': 'influence.html#protection',
            'Безопасность в быту': 'influence.html#safety',
            'Научные данные': 'influence.html#science',
            'Мифы vs Реальность': 'influence.html#myths'
        };
        
        const anchor = pageMap[item.textContent.trim()];
        if (anchor) {
            window.location.href = anchor;
        }
    });
});





// Обновленная функция расчета
function calculateRisk() {
    const answers = [
        parseInt(document.querySelector('input[name="q1"]:checked')?.value || 0),
        parseInt(document.querySelector('input[name="q2"]:checked')?.value || 0),
        parseInt(document.querySelector('input[name="q3"]:checked')?.value || 0),
        parseInt(document.querySelector('input[name="q4"]:checked')?.value || 0),
        parseInt(document.querySelector('input[name="q5"]:checked')?.value || 0),
        parseInt(document.querySelector('input[name="q6"]:checked')?.value || 0),
        parseInt(document.querySelector('input[name="q7"]:checked')?.value || 0),
        parseInt(document.querySelector('input[name="q8"]:checked')?.value || 0)
    ];
    
    const total = answers.reduce((a, b) => a + b, 0);
    let result, color;

    if(total <= 15) {
        result = "Низкий риск 🟢";
        color = "#4CAF50";
    } else if(total <= 30) {
        result = "Умеренный риск 🟡";
        color = "#FFC107";
    } else {
        result = "Высокий риск 🔴";
        color = "#F44336";
    }

    document.getElementById("result").innerHTML = `
        <h3 style="color: ${color}">${result}</h3>
        <p>Общий балл: ${total}/40</p>
        <div class="recommendations">${getRecommendations(total)}</div>
    `;
}

// Расширенные рекомендации
function getRecommendations(score) {
    let tips = [];
    if(score > 30) tips.push("🔇 Установите режим «Не беспокоить» ночью");
    if(score > 20) tips.push("🏠 Перенесите роутер из жилых комнат");
    if(score > 15) tips.push("🎧 Используйте проводные наушники");
    
    return tips.length > 0 
        ? "<ul>" + tips.map(t => `<li>${t}</li>`).join("") + "</ul>"
        : "Ваши привычки безопасны! 👍";
}


// Предустановки устройств
const devices = {
    wifi: { power: 0.1, distance: 1 },
    phone: { power: 2, distance: 0.05 },
    microwave: { power: 700, distance: 0.5 }
};

function fillPreset() {
    const device = document.getElementById("deviceSelect").value;
    if(device !== "custom") {
        document.getElementById("power").value = devices[device].power;
        document.getElementById("distance").value = devices[device].distance;
    }
}

function calculateEMF() {
    const P = parseFloat(document.getElementById("power").value) || 0;
    const r = parseFloat(document.getElementById("distance").value) || 1;
    
    if(P <= 0 || r <= 0) {
        alert("⚠️ Введите корректные значения!");
        return;
    }

    const I = P / (4 * Math.PI * r**2);
    const resultElement = document.getElementById("intensityValue");
    const scaleBar = document.getElementById("scaleBar");
    
    // Обновление значений
    resultElement.textContent = `${I.toFixed(4)} Вт/м²`;
    resultElement.style.color = getColor(I);
    
    // Анимация шкалы
    const widthPercentage = Math.min((I / 50) * 100, 100);
    scaleBar.style.width = `${widthPercentage}%`;
    
    // Динамическое описание
    let statusText = "";
    if(I < 10) statusText = "✅ В пределах безопасной нормы";
    else if(I < 50) statusText = "⚠️ Требуется ограничение времени воздействия";
    else statusText = "🚨 Опасный уровень! Избегайте длительного контакта";
    
    resultElement.nextElementSibling?.remove();
    resultElement.insertAdjacentHTML("afterend", 
        `<div class="status">${statusText}</div>`);
}

function getColor(intensity) {
    if(intensity < 10) return "#4CAF50";
    if(intensity < 50) return "#FFC107";
    return "#F44336";
}


// Поиск по глоссарию
document.getElementById("glossarySearch").addEventListener("input", function(e) {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll(".term").forEach(term => {
        const text = term.innerText.toLowerCase();
        term.style.display = text.includes(query) ? "block" : "none";
    });
});