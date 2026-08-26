document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.card-slide');
    const slider = document.querySelector('.card-slider');
    
    const prevBtn = document.querySelector('.card-slider__btn--prev');
    const nextBtn = document.querySelector('.card-slider__btn--next');
    const mobilePrevBtn = document.querySelector('.card-slider__mobile-btn--prev');
    const mobileNextBtn = document.querySelector('.card-slider__mobile-btn--next');

    const mqMobile = window.matchMedia('(max-width: 768px)');

    // ============================================
    // 1. ДЕСКТОПНАЯ ЛОГИКА (> 768px)
    // ============================================
    let current = 0;
    let isAnimating = false;
    const SLIDE_DISTANCE = 100;
    const DURATION = 350;
    const EASE_OUT = 'cubic-bezier(0.4, 0, 1, 1)';
    const EASE_IN = 'cubic-bezier(0, 0, 0.6, 1)';

    function goToDesktop(newIndex, direction) {
        if (isAnimating || mqMobile.matches) return; // Блокируем на мобильных
        isAnimating = true;

        const outSlide = slides[current];
        const inSlide = slides[newIndex];
        const outX = direction === 'left' ? -SLIDE_DISTANCE : SLIDE_DISTANCE;
        const inX = direction === 'left' ? SLIDE_DISTANCE : -SLIDE_DISTANCE;

        outSlide.style.transition = `transform ${DURATION}ms ${EASE_OUT}, opacity ${DURATION}ms ${EASE_OUT}`;
        outSlide.style.transform = `translateX(${outX}px)`;
        outSlide.style.opacity = '0';

        setTimeout(() => {
            outSlide.classList.remove('card-slide--active');
            outSlide.style.transition = 'none';
            outSlide.style.transform = '';
            outSlide.style.opacity = '';

            inSlide.style.transition = 'none';
            inSlide.style.transform = `translateX(${inX}px)`;
            inSlide.style.opacity = '0';
            inSlide.classList.add('card-slide--active');

            requestAnimationFrame(() => {
                inSlide.style.transition = `transform ${DURATION}ms ${EASE_IN}, opacity ${DURATION}ms ${EASE_IN}`;
                inSlide.style.transform = 'translateX(0)';
                inSlide.style.opacity = '1';

                setTimeout(() => {
                    current = newIndex;
                    isAnimating = false;
                }, DURATION);
            });
        }, DURATION);
    }

    if (prevBtn && nextBtn) {
        nextBtn.addEventListener('click', () => {
            const next = (current + 1) % slides.length;
            goToDesktop(next, 'left');
        });

        prevBtn.addEventListener('click', () => {
            const prev = (current - 1 + slides.length) % slides.length;
            goToDesktop(prev, 'right');
        });
    }

    // ============================================
    // 2. МОБИЛЬНАЯ ЛОГИКА (≤ 768px) - Бесконечный скролл
    // ============================================
    let slidesCount = 0;
    let scrollTimer = null;
    let isJumping = false;

    const getSlideWidth = () => slider.clientWidth;
    const getCurrentIndex = () => Math.round(slider.scrollLeft / getSlideWidth());

    function jumpTo(index) {
        if (!slider) return;
        isJumping = true;
        slider.style.scrollSnapType = 'none';
        slider.scrollTo({ left: index * getSlideWidth(), behavior: 'auto' });
        
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                slider.style.scrollSnapType = '';
                isJumping = false;
            });
        });
    }

    function buildMobileLoop() {
        if (slider.querySelector('.card-slide--clone')) return;
        const originalSlides = slider.querySelectorAll('.card-slide');
        if (originalSlides.length < 2) return;

        slidesCount = originalSlides.length;
        const firstClone = originalSlides[0].cloneNode(true);
        const lastClone = originalSlides[slidesCount - 1].cloneNode(true);

        [firstClone, lastClone].forEach((clone) => {
            clone.classList.add('card-slide--clone');
            clone.setAttribute('aria-hidden', 'true');
            clone.tabIndex = -1;
            // Сброс десктопных стилей анимации на клонах
            clone.style.transition = 'none';
            clone.style.transform = 'none';
            clone.style.opacity = '1';
        });

        slider.appendChild(firstClone);
        slider.prepend(lastClone);
        jumpTo(1);
    }

    function destroyMobileLoop() {
        slider.querySelectorAll('.card-slide--clone').forEach((c) => c.remove());
        slider.style.scrollSnapType = '';
        slider.scrollLeft = 0;
        
        // Возвращаем десктопное состояние
        slides.forEach((slide, idx) => {
            slide.classList.toggle('card-slide--active', idx === current);
        });
    }

    function checkLoopPosition() {
        if (isJumping) return;
        const i = getCurrentIndex();
        if (i <= 0) {
            jumpTo(slidesCount);
        } else if (i >= slidesCount + 1) {
            jumpTo(1);
        }
    }

    // Обработка свайпа
    slider.addEventListener('scroll', () => {
        if (!mqMobile.matches || isJumping) return;
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(checkLoopPosition, 150);
    }, { passive: true });

    // Мобильные кнопки
    if (mobilePrevBtn) {
        mobilePrevBtn.addEventListener('click', () => {
            if (!mqMobile.matches) return;
            slider.scrollBy({ left: -getSlideWidth(), behavior: 'smooth' });
        });
    }
    
    if (mobileNextBtn) {
        mobileNextBtn.addEventListener('click', () => {
            if (!mqMobile.matches) return;
            slider.scrollBy({ left: getSlideWidth(), behavior: 'smooth' });
        });
    }

    // Реакция на изменение размера окна (поворот экрана)
    window.addEventListener('resize', () => {
        if (!mqMobile.matches) return;
        clearTimeout(scrollTimer);
        setTimeout(() => {
            const i = Math.min(Math.max(getCurrentIndex(), 1), slidesCount);
            jumpTo(i);
        }, 150);
    });

    // Переключение между режимами
    function handleBreakpoint(e) {
        if (e.matches) {
            buildMobileLoop();
        } else {
            destroyMobileLoop();
        }
    }

    if (typeof mqMobile.addEventListener === 'function') {
        mqMobile.addEventListener('change', handleBreakpoint);
    } else {
        mqMobile.addListener(handleBreakpoint);
    }

    // Инициализация
    if (mqMobile.matches) {
        buildMobileLoop();
    }
});