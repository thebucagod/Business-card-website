// ============================================
// НАСТРОЙКИ АНИМАЦИИ — меняй здесь
// ============================================

const SLIDE_DISTANCE = 100;       // px — расстояние сдвига при уходе/въезде

const EASE_OUT_DURATION = 350;    // мс — время ухода старого слайда
const EASE_IN_DURATION  = 350;    // мс — время появления нового слайда

const EASE_OUT = 'cubic-bezier(0.4, 0, 1, 1)';   // ускорение при уходе
const EASE_IN  = 'cubic-bezier(0, 0, 0.6, 1)';   // замедление при появлении

// ============================================

const slides   = document.querySelectorAll('.card-slide');
const prevBtn  = document.querySelector('.card-slider__btn--prev');
const nextBtn  = document.querySelector('.card-slider__btn--next');

let current     = 0;
let isAnimating = false;

function goTo(newIndex, direction) {
    if (isAnimating) return;
    isAnimating = true;

    const outSlide = slides[current];
    const inSlide  = slides[newIndex];

    const outX = direction === 'left' ? -SLIDE_DISTANCE : SLIDE_DISTANCE;
    const inX  = direction === 'left' ?  SLIDE_DISTANCE : -SLIDE_DISTANCE;

    // --- ФАЗА 1: старый слайд уходит ---
    outSlide.style.transition = `transform ${EASE_OUT_DURATION}ms ${EASE_OUT},
                                  opacity   ${EASE_OUT_DURATION}ms ${EASE_OUT}`;
    outSlide.style.transform  = `translateX(${outX}px)`;
    outSlide.style.opacity    = '0';

    setTimeout(() => {
        // Старый слайд убран — сбрасываем его состояние
        outSlide.classList.remove('card-slide--active');
        outSlide.style.transition = 'none';
        outSlide.style.transform  = '';
        outSlide.style.opacity    = '';

        // --- ФАЗА 2: новый слайд появляется ---
        // Сначала ставим его за пределами видимости без анимации
        inSlide.style.transition = 'none';
        inSlide.style.transform  = `translateX(${inX}px)`;
        inSlide.style.opacity    = '0';
        inSlide.classList.add('card-slide--active');

        // Даём браузеру применить начальное состояние, потом запускаем въезд
        setTimeout(() => {
            inSlide.style.transition = `transform ${EASE_IN_DURATION}ms ${EASE_IN},
                                         opacity   ${EASE_IN_DURATION}ms ${EASE_IN}`;
            inSlide.style.transform  = 'translateX(0)';
            inSlide.style.opacity    = '1';

            setTimeout(() => {
                current     = newIndex;
                isAnimating = false;
            }, EASE_IN_DURATION);

        }, 20);   // минимальная задержка для браузера

    }, EASE_OUT_DURATION);
}

nextBtn.addEventListener('click', () => {
    const next = (current + 1) % slides.length;
    goTo(next, 'left');
});

prevBtn.addEventListener('click', () => {
    const prev = (current - 1 + slides.length) % slides.length;
    goTo(prev, 'right');
});