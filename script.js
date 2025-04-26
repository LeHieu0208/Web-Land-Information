import { currentLanguage, translations } from './language-switcher.js'; // import currentLanguage từ file language-switcher

// JS DÙNG CHUNG
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



// JS của HomePage
const search_data_url = 'https://docs.google.com/spreadsheets/d/1WAAUVwWkuPjMWxkz8jipqu9UzOm0dcsWTYLHHH7Ulas/gviz/tq?tqx=out:json&gid=0';
const qdpl_url = 'https://docs.google.com/spreadsheets/d/1WAAUVwWkuPjMWxkz8jipqu9UzOm0dcsWTYLHHH7Ulas/gviz/tq?tqx=out:json&gid=574556602';

const search_data_url_e = 'https://docs.google.com/spreadsheets/d/1WAAUVwWkuPjMWxkz8jipqu9UzOm0dcsWTYLHHH7Ulas/gviz/tq?tqx=out:json&gid=197171933';
const qdpl_url_e = 'https://docs.google.com/spreadsheets/d/1WAAUVwWkuPjMWxkz8jipqu9UzOm0dcsWTYLHHH7Ulas/gviz/tq?tqx=out:json&gid=438462088';


let search_data = [];
let qdpl_data = [];
let search_data_e = [];
let qdpl_data_e = [];

async function load_search_data() {
    try {
        const response = await fetch(search_data_url);
        const text = await response.text();
        const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\)/)[1]);

        const rows = json.table.rows;
        const dataRows = rows.slice(1);

        search_data = dataRows.map(row => ({
            city: row.c[0]?.v || '',
            type: row.c[1]?.v || '',
            title: row.c[2]?.v || '',
            link: row.c[3]?.v || ''
        }));

        populateCityList(search_data);
    } catch (e) {
        console.error('Lỗi khi tải dữ liệu:', e);
    }
}

async function load_qdpl_data() {
    try {
        const response = await fetch(qdpl_url);
        const text = await response.text();
        const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\)/)[1]);

        const rows = json.table.rows;
        const dataRows = rows.slice(1);
        qdpl_data = dataRows.map(row => ({
            title: row.c[0]?.v || '',
            link: row.c[1]?.v || '',
            main_content: row.c[2]?.v || '',
        }));
    } catch (e) {
        console.error('Lỗi khi tải dữ liệu:', e);
    }
}

async function load_search_data_e() {
    try {
        const response = await fetch(search_data_url_e);
        const text = await response.text();
        const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\)/)[1]);

        const rows = json.table.rows;
        const dataRows = rows.slice(1);

        search_data_e = dataRows.map(row => ({
            city: row.c[0]?.v || '',
            type: row.c[1]?.v || '',
            title: row.c[2]?.v || '',
            link: row.c[3]?.v || ''
        }));

        populateCityList(search_data_e);
    } catch (e) {
        console.error('Lỗi khi tải dữ liệu:', e);
    }
}

async function load_qdpl_data_e() {
    try {
        const response = await fetch(qdpl_url_e);
        const text = await response.text();
        const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\)/)[1]);

        const rows = json.table.rows;
        const dataRows = rows.slice(1);
        qdpl_data_e = dataRows.map(row => ({
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

window.searchLandDocs = function () {
    console.log(currentLanguage);
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim().toLowerCase();
    let paperType = document.getElementById('paperSelect').value;

    if (city === '') {
        cityInput.style.border = '1px solid red';

        if (currentLanguage === "vi") {
            cityInput.placeholder = "Hãy chọn khu vực";
        } else {
            cityInput.placeholder = "Please select a region";
        }
        return;
    } else {
        cityInput.style.border = '';
        const warning = document.getElementById('city-warning');
        if (warning) {
            warning.remove();
        }
    }

    let filtered = [];

    console.log(search_data)

    console.log(search_data_e)
    console.log(city)
    console.log(paperType)

    if (currentLanguage === "vi") {
        filtered = search_data.filter(item => {
            const matchesCity = item.city.toLowerCase().includes(city);
            const matchesType = paperType === 'All' || item.type === paperType;
            return matchesCity && matchesType;
        });
        renderTable(filtered, paperType);
    } else {
        filtered = search_data_e.filter(item => {
            const matchesCity = item.city.toLowerCase().includes(city);
            if (paperType === "Quy hoạch và sử dụng đất") {
                paperType = "Land planning and use"
            } else if (paperType === "Định giá đất") {
                paperType = "Land valuation"
            } else if (paperType === "Thu hồi, bồi thường, tái định cư") {
                paperType = "Land acquisition, compensation, resettlement"
            }
            const matchesType = paperType === 'All' || item.type === paperType;
            return matchesCity && matchesType;
        });
        renderTable_e(filtered, paperType);
    }
    console.log(filtered)
}

function renderTable(data, type) {
    const results = document.getElementById('results');

    if (data.length === 0 && type !== "Thu hồi, bồi thường, tái định cư") {
        results.innerHTML = '<p class="no-data">Không tìm thấy dữ liệu phù hợp.</p>';
        return;
    }

    let html = '';

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
    } else if (type === "Thu hồi, bồi thường, tái định cư") {
        if (qdpl_data.length === 0) {
            results.innerHTML = '<p>Không có dữ liệu về Thu hồi, bồi thường, tái định cư.</p>';
            return;
        }

        html += `
            <div class="result-card">
                <h4 class="">Tài liệu: Thu hồi, bồi thường, tái định cư</h4>
                <ul class="result-list">
                    ${qdpl_data.map(item => `
                        <li class="result-list-items">
                            <a href="${item.link}" target="_blank">${item.title}</a>
                            <p class="main-content"> - ${item.main_content}</p>
                        </li>`).join('')}
                </ul>
            </div>`;
    } else if (type === "All") {
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

        if (qdpl_data.length > 0) {
            html += `
                <div class="result-card">
                    <h4 class="">Tài liệu: Thu hồi, bồi thường, tái định cư</h4>
                    <ul class="result-list">
                        ${qdpl_data.map(item => `
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

function renderTable_e(data, type) {
    const results = document.getElementById('results');

    if (data.length === 0 && type !== "Land acquisition, compensation, resettlement") {
        results.innerHTML = '<p class="no-data">No matching data found.</p>';
        return;
    }

    let html = '';

    if (type === "Land planning and use" || type === "Land valuation") {
        html += `
            <div class="result-card">
                <h4 class="">Documents: ${type}</h4>
                <ul class="result-list">
                    ${data.map(item => `
                        <li class="result-list-items">
                            <a href="${item.link}" target="_blank">${item.title}</a>
                        </li>`).join('')}
                </ul>
            </div>`;
    } else if (type === "Land acquisition, compensation, resettlement") {
        if (qdpl_data_e.length === 0) {
            results.innerHTML = '<p>No data about Land Acquisition, Compensation, and Resettlement.</p>';
            return;
        }

        html += `
            <div class="result-card">
                <h4 class="">Documents: Land Acquisition, Compensation, Resettlement</h4>
                <ul class="result-list">
                    ${qdpl_data_e.map(item => `
                        <li class="result-list-items">
                            <a href="${item.link}" target="_blank">${item.title}</a>
                            <p class="main-content"> - ${item.main_content}</p>
                        </li>`).join('')}
                </ul>
            </div>`;
    } else if (type === "All") {
        const grouped = {};

        data.forEach(item => {
            if (!grouped[item.type]) grouped[item.type] = [];
            grouped[item.type].push(item);
        });

        for (const [groupType, items] of Object.entries(grouped)) {
            html += `
                <div class="result-card">
                    <h4 class="">Documents: ${groupType}</h4>
                    <ul class="result-list">
                        ${items.map(item => `
                            <li class="result-list-items">
                                <a href="${item.link}" target="_blank">${item.title}</a>
                            </li>`).join('')}
                    </ul>
                </div>`;
        }

        if (qdpl_data_e.length > 0) {
            html += `
                <div class="result-card">
                    <h4 class="">Documents: Land Acquisition, Compensation, Resettlement</h4>
                    <ul class="result-list">
                        ${qdpl_data_e.map(item => `
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


// translations bạn đã có rồi (đưa vào cùng file hoặc import từ file khác)

function applyTranslations() {
    for (const id in translations) {
        if (id.includes("::placeholder")) {
            const realId = id.split("::")[0];
            const inputElement = document.getElementById(realId);
            if (inputElement) {
                inputElement.placeholder = translations[id][currentLanguage];
            }
        } else {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = translations[id][currentLanguage];
            }
        }
    }
    const ps = document.querySelectorAll('.footer-contact p');
    const thirdP = ps[2];

    thirdP.innerHTML = `<span id="footer-address-label">Address</span>: Hanoi Law University, 87 Nguyen Chi Thanh Street, Lang Thuong Ward, Dong Da District, Hanoi.`;
}


window.addEventListener('DOMContentLoaded', async () => {
    applyTranslations();
    if (currentLanguage === "vi") {
        await load_search_data();
        await load_qdpl_data();
    } else {
        await load_search_data_e();
        await load_qdpl_data_e();
    }

});
