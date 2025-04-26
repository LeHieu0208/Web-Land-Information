const scriptURL = 'https://script.google.com/macros/s/AKfycbziqP25J3g2p5pXQ5dJ3neiyzJpF046II_jaj6qLeHG13xx59Y_nisU6zDN5wycWkkW/exec'; // Replace with the Web App URL from Step 2
const form = document.forms['questionForm'];

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

form.addEventListener('submit', e => {
    e.preventDefault();
    const submitButton = form.querySelector('.btn');
    submitButton.disabled = true;

    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                alert('Câu hỏi đã được gửi thành công!');
                form.reset();
            } else {
                alert('Có lỗi xảy ra: ' + data.error);
            }
            submitButton.disabled = false;
        })
        .catch(error => {
            alert('Lỗi: ' + error.message);
            submitButton.disabled = false;
        });
});


let allQuestions = [];
const pageSize = 5;
let currentPage = 1;

async function fetchGoogleSheetData() {
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1WAAUVwWkuPjMWxkz8jipqu9UzOm0dcsWTYLHHH7Ulas/gviz/tq?tqx=out:json&gid=274850438';

    try {
        const response = await fetch(sheetUrl);
        const text = await response.text();
        const json = JSON.parse(text.substring(47).slice(0, -2));
        const rows = json.table.rows;

        allQuestions = rows.map(row => {
            let rawDate = row.c[0]?.v;
            let formattedDate = "";

            if (rawDate instanceof Date) {
                // Nếu đã là object Date
                const day = String(rawDate.getDate()).padStart(2, '0');
                const month = String(rawDate.getMonth() + 1).padStart(2, '0');
                const year = rawDate.getFullYear();
                formattedDate = `${day}/${month}/${year}`;
            } else if (typeof rawDate === 'string' && rawDate.startsWith("Date(")) {
                // Nếu là chuỗi dạng Date(2025,3,23)
                const match = rawDate.match(/Date\((\d+),(\d+),(\d+)\)/);
                if (match) {
                    const year = parseInt(match[1]);
                    const month = parseInt(match[2]) + 1; // Cộng 1 vì JS Date bắt đầu từ 0
                    const day = parseInt(match[3]);
                    formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
                }
            } else {
                formattedDate = rawDate || '';
            }

            return {
                time: formattedDate,
                person: row.c[1]?.v || '',
                question: row.c[2]?.v || '',
                summary: row.c[3]?.v || '',
                answer: row.c[4]?.v || ''
            };
        });

        renderPage(1);
        renderPagination();

    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
    }
}

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

function renderPage(page) {
    const questionList = document.querySelector(".list-ques");
    const answerSection = document.querySelector(".answer-sec");
    answerSection.style.display = "none";

    questionList.innerHTML = "";

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageQuestions = allQuestions.slice(start, end);

    pageQuestions.forEach(entry => {
        const card = document.createElement("div");
        card.className = "question-card";
        card.innerHTML = `
          <h3>${entry.question}</h3>
          <p>${entry.summary}</p>
          <div class="question-meta">${entry.time} | Trả lời bởi: ${entry.person}</div>
        `;
        card.addEventListener("click", () => {
            answerSection.style.display = "block";
            document.querySelector(".detail-answer").innerHTML = convertToHTML(entry.answer || "Chưa có câu trả lời.");
            window.scrollTo({ top: answerSection.offsetTop - 20, behavior: "smooth" });
        });
        questionList.appendChild(card);
    });

    currentPage = page;
    updatePaginationButtons();
}

function renderPagination() {
    const totalPages = Math.ceil(allQuestions.length / pageSize);
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = (i === currentPage) ? "active" : "";
        btn.addEventListener("click", () => renderPage(i));
        pagination.appendChild(btn);
    }
}

function updatePaginationButtons() {
    const buttons = document.querySelectorAll(".pagination button");
    buttons.forEach((btn, index) => {
        btn.className = (index + 1 === currentPage) ? "active" : "";
    });
}

fetchGoogleSheetData();

