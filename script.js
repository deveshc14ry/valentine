// ======================================
// Create floating hearts for landing page
// ======================================
function createHearts() {
    const heartsContainer = document.getElementById('hearts-container');
    const heartCount = 25;

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');

        const size = Math.random() * 20 + 10;
        const left = Math.random() * 100;
        const delay = Math.random() * 8;
        const duration = Math.random() * 10 + 10;

        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;
        heart.style.left = `${left}vw`;
        heart.style.animationDelay = `${delay}s`;
        heart.style.animationDuration = `${duration}s`;

        const colors = ['#ff6b8b', '#ff8fab', '#ff4d6d', '#ffafcc'];
        heart.style.background =
            colors[Math.floor(Math.random() * colors.length)];

        heartsContainer.appendChild(heart);
    }
}

// ========================
// Page navigation helpers
// ========================
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p =>
        p.classList.add('hidden')
    );

    const page = document.getElementById(pageId);
    if (page) page.classList.remove('hidden');
}

// ========================
// Envelope modal helpers
// ========================
function showContentModal(contentId) {
    const modal = document.getElementById(`${contentId}-content`);
    if (modal) modal.classList.remove('hidden');
}

function closeContentModal(modal) {
    modal.classList.add('hidden');
}

// ========================
// Heart explosion (YES)
// ========================
function heartExplosion() {
    for (let i = 0; i < 25; i++) {
        const heart = document.createElement('div');
        heart.textContent = '❤️';

        heart.style.position = 'fixed';
        heart.style.left = '50%';
        heart.style.top = '50%';
        heart.style.fontSize = '24px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';

        const x = (Math.random() - 0.5) * 400;
        const y = (Math.random() - 0.5) * 400;

        heart.animate(
            [
                { transform: 'translate(0,0)', opacity: 1 },
                { transform: `translate(${x}px, ${y}px)`, opacity: 0 }
            ],
            { duration: 900, easing: 'ease-out' }
        );

        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 900);
    }
}

// ======================================
// Image + floating hearts interaction
// ======================================
function bindQuestionImageEffects() {
    const wrapper = document.querySelector('.question-image-wrapper');
    const hearts = document.querySelectorAll('.mini-heart');
    const image = document.querySelector('.question-image');

    if (!wrapper || !image) return;

    wrapper.addEventListener('mousemove', e => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        hearts.forEach((heart, i) => {
            const moveX = (x - rect.width / 2) * 0.03 * (i + 1);
            const moveY = (y - rect.height / 2) * 0.03 * (i + 1);

            heart.style.transform =
                `rotate(45deg) translate(${moveX}px, ${moveY}px)`;
        });
    });

    wrapper.addEventListener('mouseleave', () => {
        hearts.forEach(h =>
            h.style.transform = 'rotate(45deg) translate(0,0)'
        );
    });
}

// ========================
// Main app initialization
// ========================
function initApp() {
    createHearts();

    // Landing page
    const mainEnvelope = document.getElementById('main-envelope');
    mainEnvelope.addEventListener('click', () => {
        showPage('question-page');
    });

    // Buttons
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const questionImage = document.querySelector('.question-image');

    let yesSize = 1;
    let isMoving = false;
    const isMobile = !window.matchMedia('(hover: hover)').matches;

    const buttonsContainer = document.querySelector('.buttons-container');


    const card = document.querySelector('#question-page .card');
    
    function moveNoButton() {
        if (isMobile || isMoving) return;
        isMoving = true;

        noBtn.style.position = 'absolute';
        card.appendChild(noBtn);
        
        const containerRect = card.getBoundingClientRect();
        const btnRect = noBtn.getBoundingClientRect();
        const yesRect = yesBtn.getBoundingClientRect();
        
        const padding = 20;    
        let x, y, tries = 0;

        do {
            x = Math.max(
                padding, Math.random() * (containerRect.width - btnRect.width - padding * 2)
            );
            
            y = Math.max(
                padding, Math.random() * (containerRect.height - btnRect.height - padding * 2)
            );
            
            tries++;
        } while (
            x + btnRect.width > yesRect.left - containerRect.left &&
            x < yesRect.right - containerRect.left &&
            y + btnRect.height > yesRect.top - containerRect.top &&
            y < yesRect.bottom - containerRect.top &&
            tries < 25
        );
        
        noBtn.style.left = `${x}px`;
        noBtn.style.top = `${y}px`;
        
        yesSize += 0.06;
        if (yesSize > 1.6) {
            yesSize += 0.02;
        }
        
        yesBtn.style.transform = `scale(${yesSize}) translateZ(0)`;
        
        setTimeout(() => isMoving = false, 220);
    }
    
    // hover
    noBtn.addEventListener('mouseenter', moveNoButton);
    
    // proximity
    card.addEventListener('mousemove', e => {
        if (isMobile || isMoving) return;
        
        const r = noBtn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        
        if (Math.sqrt(dx * dx + dy * dy) < 130) {
            moveNoButton();
        }
    });


    // YES ↔ Image sync
    if (questionImage) {
        yesBtn.addEventListener('mouseenter', () => {
            questionImage.style.transform = 'rotate(-4deg) scale(1.06)';
            questionImage.style.boxShadow =
                '0 18px 40px rgba(255,105,135,0.55)';
        });

        yesBtn.addEventListener('mouseleave', () => {
            questionImage.style.transform = 'rotate(0deg) scale(1)';
            questionImage.style.boxShadow =
                '0 12px 30px rgba(255,105,135,0.35)';
        });
    }

    // Mobile NO click
    noBtn.addEventListener('click', () => {
        if (!isMobile) return;

        navigator.vibrate?.([100, 50, 100]);

        noBtn.style.animation = 'noWiggle 0.35s ease';

        yesBtn.classList.remove('shake');
        void yesBtn.offsetWidth;
        yesBtn.classList.add('shake');

        setTimeout(() => {
            noBtn.style.animation = '';
        }, 350);
    });

    // YES click
    yesBtn.addEventListener('click', () => {
        heartExplosion();
        showPage('acceptance-page');

        yesSize = 1;
        yesBtn.style.transform = 'scale(1)';
    });

    // Envelope clicks
    document.querySelectorAll('.tree-envelope').forEach(env => {
        env.addEventListener('click', () =>
            showContentModal(env.dataset.content)
        );
    });

    // Close modals
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () =>
            closeContentModal(btn.closest('.envelope-content'))
        );
    });

    document.querySelectorAll('.envelope-content').forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target === modal) closeContentModal(modal);
        });
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document
                .querySelectorAll('.envelope-content:not(.hidden)')
                .forEach(closeContentModal);
        }
    });

    bindQuestionImageEffects();
}

// ========================
document.addEventListener('DOMContentLoaded', initApp);

