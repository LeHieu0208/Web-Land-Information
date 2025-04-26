const SHEET_URL_VI = "https://docs.google.com/spreadsheets/d/1WAAUVwWkuPjMWxkz8jipqu9UzOm0dcsWTYLHHH7Ulas/gviz/tq?tqx=out:json&gid=420273659";
const SHEET_URL_EN = "https://docs.google.com/spreadsheets/d/1WAAUVwWkuPjMWxkz8jipqu9UzOm0dcsWTYLHHH7Ulas/gviz/tq?tqx=out:json&gid=978935665";



let allData = [];

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


window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

function convertToHTML(text) {
    // Chuẩn hóa các lỗi thường gặp khi viết nhầm thẻ
    text = text
        .replace(/<b\/>/g, "</b>")
        .replace(/<i\/>/g, "</i>")
        .replace(/<br\/>/g, "<br>");

    // Escape các ký tự HTML trước khi chuyển ngược tag
    let converted = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Chuyển các thẻ đã escape về HTML thực
    converted = converted
        .replace(/&lt;b&gt;/g, "<b>")
        .replace(/&lt;\/b&gt;/g, "</b>")
        .replace(/&lt;i&gt;/g, "<i>")
        .replace(/&lt;\/i&gt;/g, "</i>")
        .replace(/\n/g, "<br>");

    return converted;
}


function getSheetUrlByLanguage() {
    if (currentLanguage === "vi") {
        return SHEET_URL_VI;
    } else if (currentLanguage === "en") {
        return SHEET_URL_EN;
    } else {
        return SHEET_URL_VI; // default là tiếng Việt
    }
}

async function loadData() {
    try {
        const sheetUrl = getSheetUrlByLanguage();
        const response = await fetch(sheetUrl);
        const text = await response.text();
        const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\)/)[1]);

        const rows = json.table.rows.slice(1);

        const data = rows.map(row => ({
            name: row.c[0]?.v || '',
            content: row.c[1]?.v || '',
        }));

        console.log(data);
        list_topics(data);
        topic_content(data);

    } catch (e) {
        console.error('Lỗi khi tải dữ liệu:', e);
    }
}

function list_topics(data) {
    const ul = document.querySelector('.list-topics');
    ul.innerHTML = '';

    let i = 1; // khai báo ngoài vòng lặp để đếm đúng

    data.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>#</span>
            <a href="#${i}">${convertToHTML(item.name)}</a>
        `;
        ul.appendChild(li);
        i++;
    });
}

function topic_content(data) {
    const div = document.querySelector('.topic-content');
    div.innerHTML = '';

    let i = 1; // khai báo ngoài vòng lặp để đếm đúng

    data.forEach(item => {
        const sub_div = document.createElement('div');
        sub_div.innerHTML = `
            <h2 id="${i}" class="name">${convertToHTML(item.name)}</h2>
            <p class="explain">${convertToHTML(item.content)}</p>
        `;
        div.appendChild(sub_div);
        i++;
    });
}

import { currentLanguage, translations } from './language-switcher.js'; // import currentLanguage từ file language-switcher

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


document.addEventListener("DOMContentLoaded", loadData);

window.addEventListener('DOMContentLoaded', async () => {
    applyTranslations();
});
