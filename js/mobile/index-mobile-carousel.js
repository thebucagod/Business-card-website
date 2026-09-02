/* ================================================= */
/* === Зацикленная карусель «МОИ ПРОЕКТЫ» (≤768px) === */
/* ================================================= */

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.projects__grid');
    if (!grid) return;

    const prevBtn = document.querySelector('.projects__arrow--left');
    const nextBtn = document.querySelector('.projects__arrow--right');
    const mq = window.matchMedia('(max-width: 768px)');

    let slidesCount = 0;
    let scrollTimer = null;
    let resizeTimer = null;

    const slideWidth = () => grid.clientWidth;
    const currentIndex = () => Math.round(grid.scrollLeft / slideWidth());

    /* Мгновенный переход к слайду без анимации */
    function jumpTo(index) {
        grid.style.scrollSnapType = 'none';
        grid.scrollTo({ left: index * slideWidth(), behavior: 'auto' });
        /* возвращаем snap после перерисовки */
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                grid.style.scrollSnapType = '';
            });
        });
    }

    /* Клонирование первого и последнего слайдов */
    function buildLoop() {
        if (grid.querySelector('.projects__card--clone')) return;

        const slides = grid.querySelectorAll('.projects__card');
        if (slides.length < 2) return;

        slidesCount = slides.length;

        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[slidesCount - 1].cloneNode(true);

        [firstClone, lastClone].forEach((clone) => {
            clone.classList.add('projects__card--clone');
            clone.setAttribute('aria-hidden', 'true');
            clone.tabIndex = -1;
        });

        grid.appendChild(firstClone);   /* клон 1-го — в конец */
        grid.prepend(lastClone);        /* клон последнего — в начало */

        jumpTo(1);                      /* старт — первый настоящий слайд */
    }

    function destroyLoop() {
        grid.querySelectorAll('.projects__card--clone').forEach((c) => c.remove());
        grid.style.scrollSnapType = '';
        grid.scrollLeft = 0;
    }

    /* Прокрутка остановилась на клоне — незаметно переносим на оригинал */
    function checkLoopPosition() {
        const i = currentIndex();
        if (i <= 0) {
            jumpTo(slidesCount);        /* клон последнего → настоящий последний */
        } else if (i >= slidesCount + 1) {
            jumpTo(1);                  /* клон первого → настоящий первый */
        }
    }

    grid.addEventListener('scroll', () => {
        if (!mq.matches) return;
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(checkLoopPosition, 120);
    }, { passive: true });

    /* Стрелки */
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (!mq.matches) return;
            grid.scrollBy({ left: -slideWidth(), behavior: 'smooth' });
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (!mq.matches) return;
            grid.scrollBy({ left: slideWidth(), behavior: 'smooth' });
        });
    }

    /* Смена ориентации / изменение ширины окна */
    window.addEventListener('resize', () => {
        if (!mq.matches) return;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const i = Math.min(Math.max(currentIndex(), 1), slidesCount);
            jumpTo(i);
        }, 150);
    });

    /* Включение/отключение цикла при переходе через 768px */
    function handleBreakpoint(e) {
        if (e.matches) buildLoop();
        else destroyLoop();
    }

    if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', handleBreakpoint);
    } else {
        mq.addListener(handleBreakpoint); /* Safari старых версий */
    }

    if (mq.matches) buildLoop();
});

/* ================================================= */
/* === Зацикленная карусель «МОИ ПРОЕКТЫ» (≤768px) === */
/* ================================================= */
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.projects__grid');
    if (!grid) return;
    const prevBtn = document.querySelector('.projects__arrow--left');
    const nextBtn = document.querySelector('.projects__arrow--right');
    const mq = window.matchMedia('(max-width: 768px)');
    let slidesCount = 0;
    let scrollTimer = null;
    let resizeTimer = null;
    const slideWidth = () => grid.clientWidth;
    const currentIndex = () => Math.round(grid.scrollLeft / slideWidth());

    function jumpTo(index) {
        grid.style.scrollSnapType = 'none';
        grid.scrollTo({ left: index * slideWidth(), behavior: 'auto' });
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                grid.style.scrollSnapType = '';
            });
        });
    }

    function buildLoop() {
        if (grid.querySelector('.projects__card--clone')) return;
        const slides = grid.querySelectorAll('.projects__card');
        if (slides.length < 2) return;
        slidesCount = slides.length;
        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[slidesCount - 1].cloneNode(true);
        [firstClone, lastClone].forEach((clone) => {
            clone.classList.add('projects__card--clone');
            clone.setAttribute('aria-hidden', 'true');
            clone.tabIndex = -1;
        });
        grid.appendChild(firstClone);
        grid.prepend(lastClone);
        jumpTo(1);
    }

    function destroyLoop() {
        grid.querySelectorAll('.projects__card--clone').forEach((c) => c.remove());
        grid.style.scrollSnapType = '';
        grid.scrollLeft = 0;
    }

    function checkLoopPosition() {
        const i = currentIndex();
        if (i <= 0) jumpTo(slidesCount);
        else if (i >= slidesCount + 1) jumpTo(1);
    }

    grid.addEventListener('scroll', () => {
        if (!mq.matches) return;
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(checkLoopPosition, 120);
    }, { passive: true });

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (!mq.matches) return;
            grid.scrollBy({ left: -slideWidth(), behavior: 'smooth' });
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (!mq.matches) return;
            grid.scrollBy({ left: slideWidth(), behavior: 'smooth' });
        });
    }

    window.addEventListener('resize', () => {
        if (!mq.matches) return;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const i = Math.min(Math.max(currentIndex(), 1), slidesCount);
            jumpTo(i);
        }, 150);
    });

    function handleBreakpoint(e) {
        if (e.matches) buildLoop();
        else destroyLoop();
    }

    if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', handleBreakpoint);
    } else {
        mq.addListener(handleBreakpoint);
    }

    if (mq.matches) buildLoop();
});

/* ================================================= /
/ === Зацикленная карусель «ОТЗЫВЫ» (≤768px)    === /
/ ================================================= */
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.reviews__carousel');
    if (!carousel) return;
    
    const grid = carousel.querySelector('.reviews__grid');
    const dots = Array.from(document.querySelectorAll('.reviews__dot'));
    
    const prevBtn = carousel.querySelector('.reviews__arrow--left');
    const nextBtn = carousel.querySelector('.reviews__arrow--right');
    const mq = window.matchMedia('(max-width: 768px)');

    let slidesCount = 0;
    let scrollTimer = null;

    const slideWidth = () => grid.clientWidth;
    const getCurrentIndex = () => Math.round(grid.scrollLeft / slideWidth());

    function jumpTo(index) {
        grid.style.scrollSnapType = 'none';
        grid.scrollTo({ left: index * slideWidth(), behavior: 'auto' });
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                grid.style.scrollSnapType = '';
            });
        });
        updateActiveState(index);
    }

    function buildLoop() {
        if (grid.querySelector('.reviews__card--clone')) return;
        const realCards = Array.from(grid.querySelectorAll('.reviews__card:not(.reviews__card--clone)'));
        if (realCards.length < 2) return;
        
        slidesCount = realCards.length;
        const firstClone = realCards[0].cloneNode(true);
        const lastClone = realCards[slidesCount - 1].cloneNode(true);
        
        [firstClone, lastClone].forEach((clone) => {
            clone.classList.add('reviews__card--clone');
            clone.classList.remove('reviews__review--visible');
            clone.setAttribute('aria-hidden', 'true');
            clone.tabIndex = -1;
        });
        
        grid.appendChild(firstClone);
        grid.prepend(lastClone);
        jumpTo(1);
    }

    function destroyLoop() {
        grid.querySelectorAll('.reviews__card--clone').forEach((c) => c.remove());
        grid.style.scrollSnapType = '';
        grid.scrollLeft = 0;
        
        const cards = Array.from(grid.querySelectorAll('.reviews__card'));
        if (cards.length > 0) {
            cards[0].classList.add('reviews__card--active');
            dots[0]?.classList.add('reviews__dot--active');
        }
    }

    function updateActiveState(domIndex) {
        let realIndex = domIndex - 1;
        if (realIndex < 0) realIndex = slidesCount - 1;
        if (realIndex >= slidesCount) realIndex = 0;

        const cards = Array.from(grid.querySelectorAll('.reviews__card'));
        cards.forEach((card, i) => {
            if (i === domIndex) {
                card.classList.add('reviews__card--active');
            } else {
                card.classList.remove('reviews__card--active');
                card.classList.remove('reviews__review--visible');
            }
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('reviews__dot--active', i === realIndex);
        });
    }

    function checkLoopPosition() {
        const domIndex = getCurrentIndex();
        if (domIndex <= 0) {
            jumpTo(slidesCount);
        } else if (domIndex >= slidesCount + 1) {
            jumpTo(1);
        } else {
            updateActiveState(domIndex);
        }
    }

    let pointerStartX = 0;
    let pointerStartY = 0;
    let isDragging = false;

    grid.addEventListener('pointerdown', (e) => {
        pointerStartX = e.clientX;
        pointerStartY = e.clientY;
        isDragging = false;
    });

    grid.addEventListener('pointermove', (e) => {
        if (Math.abs(e.clientX - pointerStartX) > 10 || Math.abs(e.clientY - pointerStartY) > 10) {
            isDragging = true;
        }
    });

    grid.addEventListener('click', (e) => {
        if (isDragging) return;

        const card = e.target.closest('.reviews__card');
        if (!card) return;

        card.classList.toggle('reviews__review--visible');
    });

    // --- Обработчики скролла, кнопок и точек ---
    grid.addEventListener('scroll', () => {
        if (!mq.matches) return;
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(checkLoopPosition, 120);
    }, { passive: true });

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!mq.matches) return;
            grid.scrollBy({ left: -slideWidth(), behavior: 'smooth' });
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!mq.matches) return;
            grid.scrollBy({ left: slideWidth(), behavior: 'smooth' });
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            jumpTo(index + 1);
        });
    });

    window.addEventListener('resize', () => {
        if (!mq.matches) return;
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            const domIndex = Math.min(Math.max(getCurrentIndex(), 1), slidesCount);
            jumpTo(domIndex);
        }, 150);
    });

    function handleBreakpoint(e) {
        if (e.matches) buildLoop();
        else destroyLoop();
    }

    if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', handleBreakpoint);
    } else {
        mq.addListener(handleBreakpoint);
    }

    if (mq.matches) buildLoop();
    else {
        const cards = Array.from(grid.querySelectorAll('.reviews__card'));
        if (cards.length > 0) {
            cards[0].classList.add('reviews__card--active');
            dots[0]?.classList.add('reviews__dot--active');
        }
    }
});