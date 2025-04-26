
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1WAAUVwWkuPjMWxkz8jipqu9UzOm0dcsWTYLHHH7Ulas/gviz/tq?tqx=out:json&gid=0';
const SHEET_URL_2 = 'https://docs.google.com/spreadsheets/d/1WAAUVwWkuPjMWxkz8jipqu9UzOm0dcsWTYLHHH7Ulas/gviz/tq?tqx=out:json&gid=574556602';
let allData = [];
let allData2 = [];


window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.navbar ul');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});


async function loadData() {
    try {
        const response = await fetch(SHEET_URL);
        const text = await response.text();
        const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\)/)[1]);

        const rows = json.table.rows;
        const dataRows = rows.slice(1);

        allData = dataRows.map(row => ({
            city: row.c[0]?.v || '',
            type: row.c[1]?.v || '',
            title: row.c[2]?.v || '',
            link: row.c[3]?.v || ''
        }));

        populateCityList(allData);
    } catch (e) {
        console.error('Lỗi khi tải dữ liệu:', e);
    }
}

async function loadData2() {
    try {
        const response = await fetch(SHEET_URL_2);
        const text = await response.text();
        const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\)/)[1]);

        const rows = json.table.rows;
        const dataRows = rows.slice(1);
        allData2 = dataRows.map(row => ({
            title: row.c[0]?.v || '',
            link: row.c[1]?.v || '',
            main_content: row.c[2]?.v || '',
        }));
    } catch (e) {
        console.error('Lỗi khi tải dữ liệu:', e);
    }
}

function populateCityList(data) {
    const citySet = new Set(data.map(item => item.city));
    const datalist = document.getElementById('cityList');
    citySet.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        datalist.appendChild(option);
    });
}

function searchLandDocs() {
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim().toLowerCase();
    const paperType = document.getElementById('paperSelect').value;

    // Kiểm tra nếu chưa chọn thành phố
    if (city === '') {
        cityInput.style.border = '1px solid red';

        cityInput.placeholder = "Hãy chọn khu vực"

        return; // Không thực hiện tìm kiếm khi không có thành phố
    } else {
        // Nếu đã nhập thành phố, xoá cảnh báo (nếu có)
        cityInput.style.border = '';
        const warning = document.getElementById('city-warning');
        if (warning) {
            warning.remove();
        }
    }

    // Lọc dữ liệu nếu hợp lệ
    const filtered = allData.filter(item => {
        const matchesCity = item.city.toLowerCase().includes(city);
        const matchesType = paperType === 'All' || item.type === paperType;
        return matchesCity && matchesType;
    });

    renderTable(filtered, paperType);
}

function renderTable(data, type) {
    const results = document.getElementById('results');

    if (data.length === 0 && type !== "Thu hồi, bồi thường, tái định cư") {
        results.innerHTML = '<p class="no-data">Không tìm thấy dữ liệu phù hợp.</p>';
        return;
    }

    let html = '';

    // Trường hợp từng loại cụ thể
    if (type === "Quy hoạch và sử dụng đất" || type === "Định giá đất") {
        html += `
            <div class="result-card">
                <h4 class="">Tài liệu: ${type}</h4>
                <ul class="result-list">
                    ${data.map(item => `
                        <li class="result-list-items">
                            <a href="${item.link}" target="_blank">${item.title}</a>
                        </li>`).join('')}
                </ul>
            </div>`;
    }

    // Trường hợp đặc biệt: dữ liệu từ bảng 2 (allData2)
    else if (type === "Thu hồi, bồi thường, tái định cư") {
        if (allData2.length === 0) {
            results.innerHTML = '<p>Không có dữ liệu về Thu hồi, bồi thường, tái định cư.</p>';
            return;
        }

        html += `
            <div class="result-card">
                <h4 class="">Tài liệu: Thu hồi, bồi thường, tái định cư</h4>
                <ul class="result-list">
                    ${allData2.map(item => `
                        <li class="result-list-items">
                            <a href="${item.link}" target="_blank">${item.title}</a>
                            <p class="main-content"> - ${item.main_content}</p>
                        </li>`).join('')}
                </ul>
            </div>`;
    }

    // Trường hợp chọn "All"
    else if (type === "All") {
        // Nhóm dữ liệu theo loại
        const grouped = {};

        data.forEach(item => {
            if (!grouped[item.type]) grouped[item.type] = [];
            grouped[item.type].push(item);
        });

        for (const [groupType, items] of Object.entries(grouped)) {
            html += `
                <div class="result-card">
                    <h4 class="">Tài liệu: ${groupType}</h4>
                    <ul class="result-list">
                        ${items.map(item => `
                            <li class="result-list-items">
                                <a href="${item.link}" target="_blank">${item.title}</a>
                            </li>`).join('')}
                    </ul>
                </div>`;
        }

        // Thêm phần "Thu hồi, bồi thường, tái định cư" vào cuối nếu có
        if (allData2.length > 0) {
            html += `
                <div class="result-card">
                    <h4 class="">Tài liệu: Thu hồi, bồi thường, tái định cư</h4>
                    <ul class="result-list">
                        ${allData2.map(item => `
                            <li class="result-list-items">
                                <a href="${item.link}" target="_blank">${item.title}</a>
                                <p class="main-content"> - ${item.main_content}</p>
                            </li>`).join('')}
                    </ul>
                </div>`;
        }
    }

    results.innerHTML = html;
}

// Gọi khi trang tải xong
window.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    await loadData2();
});
