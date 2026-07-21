const educationData = {
    "Mathematics": { grade: "Grade 9", board: "Edexcel (Higher)", marks: "71 (P1), 78 (P2), 75 (P3)" },
    "Physics": { grade: "Grade 9", board: "AQA (Triple, Higher)", marks: "89 (P1), 93 (P2)" },
    "Computer Science": { grade: "Grade 8", board: "OCR", marks: "70 (P1), 72 (P2)" },
    "Further Mathematics": { grade: "Grade 9", board: "AQA (L2 Cert)", marks: "73 (P1), 72 (P2)" }
};

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const sunIcon = '<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 000-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>';
const moonIcon = '<path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>';

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeIcon.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
    localStorage.setItem('theme', theme);
}

function setInitialTheme(theme) {
    applyTheme(theme);
    document.getElementById('theme-picker').classList.add('hidden');
    localStorage.setItem('picker-seen', 'true');
}

const savedTheme = localStorage.getItem('theme') || 'dark';
const pickerSeen = localStorage.getItem('picker-seen');

applyTheme(savedTheme);

if (pickerSeen) {
    document.getElementById('theme-picker').style.display = 'none';
}

themeToggle.onclick = () => {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
};

window.onscroll = () => {
    document.querySelectorAll('section').forEach(sec => {
        const top = window.scrollY;
        const offset = sec.offsetTop - 150;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        if (top >= offset && top < offset + height) {
            document.querySelectorAll('.nav a').forEach(links => {
                links.classList.remove('active');
                if (links.getAttribute('href') === '#' + id) links.classList.add('active');
            });
        }
    });
};

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), index * 100);
        }
    });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

function openModal(id) {
    document.getElementById(id).classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('open'));
    document.body.style.overflow = '';
}

document.querySelectorAll('.row[data-subject]').forEach(row => {
    row.onclick = () => {
        const data = educationData[row.getAttribute('data-subject')];
        document.getElementById('edu-title').innerText = row.getAttribute('data-subject');
        document.getElementById('edu-grade').innerText = data.grade;
        document.getElementById('edu-board').innerText = data.board;
        document.getElementById('edu-marks').innerText = data.marks;
        openModal('edu-modal');
    };
});

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModals(); });
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');
document.querySelectorAll('.modal-gallery img').forEach(img => {
    img.onclick = (e) => { e.stopPropagation(); lightboxImg.src = img.src; lightbox.classList.add('open'); };
});
lightbox.onclick = () => lightbox.classList.remove('open');
window.onclick = (e) => { if(e.target.classList.contains('modal')) closeModals(); }
