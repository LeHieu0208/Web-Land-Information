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

import { currentLanguage, translations } from './language-switcher.js'; // import currentLanguage từ file language-switcher

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
    if(currentLanguage === "en"){
        const ps = document.querySelectorAll('.footer-contact p');
    const thirdP = ps[2];

    thirdP.innerHTML = `<span id="footer-address-label">Address</span>: Hanoi Law University, 87 Nguyen Chi Thanh Street, Lang Thuong Ward, Dong Da District, Hanoi.`;
    }
    
}


window.addEventListener('DOMContentLoaded', async () => {
    applyTranslations();
});
