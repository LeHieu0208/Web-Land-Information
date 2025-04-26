let currentLanguage = localStorage.getItem('selectedLanguage') || 'vi';

const switchButton = document.getElementById('languageSwitch');
const cityInput = document.getElementById('cityInput');

// Nếu ngôn ngữ đang lưu là 'en' thì bật công tắc khi tải trang
if (currentLanguage === 'en') {
    switchButton.checked = true;
}

switchButton.addEventListener('change', function () {
    if (this.checked) {
        currentLanguage = 'en';
    } else {
        currentLanguage = 'vi';
    }

    // ✅ Update vào localStorage mỗi lần người dùng đổi ngôn ngữ
    localStorage.setItem('selectedLanguage', currentLanguage);
    location.reload(); // 👉 Tự động reload lại trang cho dịch
    console.log(currentLanguage);
});

// Dictionary containing Vietnamese and English text for each ID
const translations = {
    // --- General / Shared ---
    "page-title": { // Used across multiple pages, content might vary slightly but ID is the same
        vi: "Thông tin đất đai", // Default/Index page title
        en: "Land Information"
    },
    "nav-home": {
        vi: "Trang chủ",
        en: "Home"
    },
    "nav-search": {
        vi: "Tra cứu thông tin",
        en: "Information Lookup"
    },
    "nav-legal": {
        vi: "Văn bản pháp luật",
        en: "Legal Documents"
    },
    "nav-guide": {
        vi: "Hướng dẫn thủ tục",
        en: "Procedure Guide"
    },
    "nav-qa": {
        vi: "Hỏi đáp pháp lý",
        en: "Legal Q&A"
    },
    "brand-text": {
        vi: "Thông tin đất đai",
        en: "Land Information"
    },
    "footer-about-title": {
        vi: "Về chúng tôi",
        en: "About Us"
    },
    "footer-about-text": {
        vi: "Trang web là bài dự thi của nhóm sinh viên lớp 4733, ngành Luật chất lượng cao nằm trong cuộc thi “Sinh viên ứng dụng Công nghệ thông tin vào thiết kế các sản phẩm tuyên truyền phổ biến giáo dục pháp luật” do trường Đại học Luật Hà Nội tổ chức nhằm góp phần tuyên truyền và phổ biến pháp luật.",
        en: "This website is a submission by a group of students from class 4733, High-Quality Law Program, for the contest 'Students Applying Information Technology in Designing Legal Propaganda and Education Products' organized by Hanoi Law University to contribute to legal propaganda and dissemination."
    },
    "footer-team-link": {
        vi: "Thành viên dự án",
        en: "Project Members"
    },
    "footer-contact-title": {
        vi: "Liên hệ",
        en: "Contact"
    },
    "footer-phone-label": {
        vi: "Điện thoại",
        en: "Phone"
    },
    "footer-address-label": {
        vi: "Địa chỉ",
        en: "Address"
    },
    "footer-links-title": {
        vi: "Liên kết",
        en: "Links"
    },
    "footer-copyright": {
        vi: "© 2025 Thông tin đất đai. Mọi quyền được bảo lưu.",
        en: "© 2025 Land Information. All rights reserved."
    },
    "footer-nav-home": {
        vi: "Trang chủ",
        en: "Home"
    },
    "footer-nav-search": {
        vi: "Tra cứu thông tin",
        en: "Information Lookup"
    },
    "footer-nav-legal": {
        vi: "Văn bản pháp luật",
        en: "Legal Documents"
    },
    "footer-nav-guide": {
        vi: "Hướng dẫn thủ tục",
        en: "Procedure Guide"
    },
    "footer-nav-qa": {
        vi: "Hỏi đáp pháp lý",
        en: "Legal Q&A"
    },

    // --- index.html Specific ---
    "hero-title": {
        vi: "THÔNG TIN ĐẤT ĐAI",
        en: "LAND INFORMATION"
    },
    "hero-desc": {
        vi: "Trang web phổ biến pháp luật công khai, minh bạch đất đai cung cấp thông tin pháp lý rõ ràng, dễ tiếp cận về các quy định liên quan đến quản lý, sử dụng và giao dịch đất đai.",
        en: "A website promoting transparent land law dissemination, providing clear and accessible legal information on regulations related to land management, use, and transactions."
    },
    "find-more-btn": {
        vi: "Tìm hiểu thêm",
        en: "Find out more"
    },
    "search-title": {
        vi: "Tra cứu giấy tờ đất đai",
        en: "Land Document Lookup"
    },
    "city-label": {
        vi: "Nhập hoặc chọn khu vực",
        en: "Enter or select an area"
    },
    // Placeholder translation requires specific handling in JS (target placeholder attribute)
    "cityInput::placeholder": { // Special notation for placeholder
        vi: "Nhập hoặc chọn thành phố...",
        en: "Enter or select a city..."
    },
    "paper-label": {
        vi: "Chọn loại giấy tờ bạn muốn tìm kiếm",
        en: "Choose the document type you want to search"
    },
    "paper-opt-all": {
        vi: "Tất cả",
        en: "All"
    },
    "paper-opt-planning": {
        vi: "Quy hoạch và sử dụng đất",
        en: "Land planning and use"
    },
    "paper-opt-valuation": {
        vi: "Định giá đất",
        en: "Land valuation"
    },
    "paper-opt-compensation": {
        vi: "Thu hồi, bồi thường, tái định cư",
        en: "Land recovery, compensation, resettlement"
    },
    "search-button": {
        vi: "Tìm kiếm",
        en: "Search"
    },
    "vbpl-title": { // Title within the card on index.html
        vi: "Văn bản pháp luật",
        en: "Legal Documents"
    },
    "vbpl-desc": { // Description within the card on index.html
        vi: "Chuyên mục cung cấp sự giải đáp chi tiết về nhưng điều luật quan trọng về đất đai mới được cập nhật.",
        en: "A section providing detailed explanations of newly updated important land laws."
    },
    "instruc-title": { // Title within the card on index.html
        vi: "Hướng dẫn thủ tục",
        en: "Procedure Guide"
    },
    "instruc-desc": { // Description within the card on index.html
        vi: "Các thủ tục liên quan đến đấu giá, thu hồi và các đơn từ cần thiết đều có ở đây!",
        en: "Procedures related to auctions, land recovery, and required documents are available here!"
    },
    "question-title": { // Title within the card on index.html
        vi: "Hỏi đáp pháp lý",
        en: "Legal Q&A"
    },
    "question-desc": { // Description within the card on index.html
        vi: "Chuyên mục giải đáp thắc mắc của người dân và doanh nghiệp về các vấn đề pháp luật đất đai, với sự tham gia của chuyên gia pháp lý.",
        en: "A section answering questions from citizens and businesses about land law issues, with participation from legal experts."
    },

    // --- introduce-page.html Specific ---
    "page-title-introduce": { // Example if you need a specific title for this page
        vi: "Giới thiệu thành viên - Thông tin đất đai",
        en: "Team Introduction - Land Information"
    },
    "team-title": {
        vi: "Đội ngũ thực hiện",
        en: "Implementation Team"
    },
    "member-name-1": { // Names generally aren't translated, but included for completeness if needed
        vi: "Phan Ngọc Nhi",
        en: "Phan Ngoc Nhi"
    },
    "member-major-1": { // Includes HTML tags
        vi: "<strong>Ngành học:</strong> Luật Chất lượng cao",
        en: "<strong>Major:</strong> High-Quality Law Program"
    },
    "member-role-1": { // Includes HTML tags
        vi: "<strong>Nhiệm vụ:</strong> Thiết kế trang web",
        en: "<strong>Role:</strong> Website Design"
    },
    "member-name-2": {
        vi: "Trần Đức Minh Hoàng",
        en: "Tran Duc Minh Hoang"
    },
    "member-major-2": {
        vi: "<strong>Ngành học:</strong> Luật Chất lượng cao",
        en: "<strong>Major:</strong> High-Quality Law Program"
    },
    "member-role-2": {
        vi: "<strong>Nhiệm vụ:</strong> Lập trình trang web",
        en: "<strong>Role:</strong> Website Programming"
    },
    "member-name-3": {
        vi: "Nguyễn Huy Anh",
        en: "Nguyen Huy Anh"
    },
    "member-major-3": {
        vi: "<strong>Ngành học:</strong> Luật Chất lượng cao",
        en: "<strong>Major:</strong> High-Quality Law Program"
    },
    "member-role-3": {
        vi: "<strong>Nhiệm vụ:</strong> Nghiên cứu nội dung",
        en: "<strong>Role:</strong> Content Research"
    },
    "member-name-4": {
        vi: "Nguyễn Hoàng Anh",
        en: "Nguyen Hoang Anh"
    },
    "member-major-4": {
        vi: "<strong>Ngành học:</strong> Luật Chất lượng cao",
        en: "<strong>Major:</strong> High-Quality Law Program"
    },
    "member-role-4": {
        vi: "<strong>Nhiệm vụ:</strong> Nghiên cứu nội dung",
        en: "<strong>Role:</strong> Content Research"
    },

    // --- question-page.html Specific ---
    "page-title-qa": { // Example specific title
        vi: "Hỏi đáp pháp lý - Thông tin đất đai",
        en: "Legal Q&A - Land Information"
    },
    "breadcrumb-text-hdpl": { // Specific ID for breadcrumb on this page
        vi: "/ Hỏi đáp pháp lý",
        en: "/ Legal Q&A"
    },
    "featured-questions-title": {
        vi: "Câu hỏi nổi bật",
        en: "Featured Questions"
    },
    "detailed-answers-title": {
        vi: "Trả lời chi tiết",
        en: "Detailed Answers"
    },
    "ask-expert-title": {
        vi: "Hỏi đáp cùng chuyên gia",
        en: "Ask the Expert"
    },
    "label-name": {
        vi: "Tên của bạn:",
        en: "Your Name:"
    },
    "name::placeholder": { // Placeholder
        vi: "Nhập tên của bạn",
        en: "Enter your name"
    },
    "label-email": {
        vi: "Email của bạn:",
        en: "Your Email:"
    },
    "email::placeholder": { // Placeholder
        vi: "Nhập email của bạn",
        en: "Enter your email"
    },
    "label-question": {
        vi: "Nội dung:",
        en: "Your Question:"
    },
    "question::placeholder": { // Placeholder
        vi: "Nhập câu hỏi tại đây...",
        en: "Enter your question here..."
    },
    "submit-button": {
        vi: "Gửi câu hỏi",
        en: "Submit Question"
    },

    // --- vbpl-page.html Specific ---
    "page-title-legal": { // Example specific title
        vi: "Văn bản pháp luật - Thông tin đất đai",
        en: "Legal Documents - Land Information"
    },
    "breadcrumb-text-vbpl": { // Specific ID for breadcrumb on this page
        // Assuming the breadcrumb should reflect the current page
        vi: "/ Văn bản pháp luật",
        en: "/ Legal Documents"
        // If it was indeed "/ Hỏi đáp pháp lý" as in the HTML, adjust accordingly:
        // vi: "/ Hỏi đáp pháp lý",
        // en: "/ Legal Q&A"
    },
    "legal-documents-title": {
        vi: "Văn bản pháp luật",
        en: "Legal Documents"
    }
    // Note: Dynamically generated list items (topics) and content in vbpl-page.html
    // need to be translated either from the data source or within the JS that generates them.
};

export { currentLanguage, translations };