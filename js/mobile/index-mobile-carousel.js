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
/* === Зацикленная карусель «ОТЗЫВЫ» (≤768px) === */
/* ================================================= */
/* ================================================= */
/* === Зацикленная карусель «ОТЗЫВЫ» (≤768px) === */
/* ================================================= */
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.reviews__grid');
    if (!grid) return;

    const prevBtn  = document.querySelector('.reviews__arrow--left');
    const nextBtn  = document.querySelector('.reviews__arrow--right');
    const dots     = document.querySelectorAll('.reviews__dot');
    const mq       = window.matchMedia('(max-width: 768px)');

    let slidesCount   = 0;
    let scrollTimer   = null;
    let revealTimer   = null;
    let resizeTimer   = null;
    let isJumping     = false;   /* защита от ложных срабатываний во время jumpTo */

    const slideWidth   = () => grid.clientWidth;
    const currentIndex = () => Math.round(grid.scrollLeft / slideWidth());

    /* Мгновенный переход к слайду */
    function jumpTo(index) {
        isJumping = true;
        grid.style.scrollSnapType = 'none';
        grid.scrollTo({ left: index * slideWidth(), behavior: 'auto' });
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                grid.style.scrollSnapType = '';
                isJumping = false;
            });
        });
    }

    /* Преобразование индекса карусели в индекс оригинального слайда */
    function toRealIndex(i) {
        if (i <= 0) return slidesCount - 1;
        if (i >= slidesCount + 1) return 0;
        return i - 1;
    }

    /* Обновление активной точки */
    function updateDots() {
        if (!dots.length) return;
        const realIndex = toRealIndex(currentIndex());
        dots.forEach((dot, idx) => {
            dot.classList.toggle('reviews__dot--active', idx === realIndex);
        });
    }

    /* Сброс всех активных карточек и таймеров */
    function resetAllCards() {
        clearTimeout(revealTimer);
        grid.querySelectorAll('.reviews__card--active').forEach((card) => {
            card.classList.remove('reviews__card--active');
        });
    }

    /* Запуск таймера для текущей карточки */
    function scheduleReveal(delay = 3000) {
        clearTimeout(revealTimer);
        revealTimer = setTimeout(() => {
            const i = currentIndex();
            const cards = grid.querySelectorAll('.reviews__card');
            if (i >= 0 && i < cards.length) {
                cards[i].classList.add('reviews__card--active');
            }
        }, delay);
    }

    /* Проверка позиции — незаметный перенос с клона на оригинал */
    function checkLoopPosition() {
        if (isJumping) return;
        const i = currentIndex();
        if (i <= 0) {
            jumpTo(slidesCount);
        } else if (i >= slidesCount + 1) {
            jumpTo(1);
        }
    }

    /* Клонирование первого и последнего слайдов */
    function buildLoop() {
        if (grid.querySelector('.reviews__card--clone')) return;

        const slides = grid.querySelectorAll('.reviews__card');
        if (slides.length < 2) return;

        slidesCount = slides.length;

        const firstClone = slides[0].cloneNode(true);
        const lastClone  = slides[slidesCount - 1].cloneNode(true);

        [firstClone, lastClone].forEach((clone) => {
            clone.classList.add('reviews__card--clone');
            clone.setAttribute('aria-hidden', 'true');
            clone.tabIndex = -1;
        });

        grid.appendChild(firstClone);
        grid.prepend(lastClone);

        jumpTo(1);
        updateDots();
        scheduleReveal();
    }

    function destroyLoop() {
        resetAllCards();
        clearTimeout(scrollTimer);
        grid.querySelectorAll('.reviews__card--clone').forEach((c) => c.remove());
        grid.style.scrollSnapType = '';
        grid.scrollLeft = 0;
    }

    /* Обработка остановки скролла */
    function onScrollStopped() {
        if (!mq.matches || isJumping) return;
        checkLoopPosition();
        updateDots();
        scheduleReveal();
    }

    /* Scroll event — используем scrollend если поддерживается, иначе debounce */
    if ('onscrollend' in window) {
        grid.addEventListener('scrollend', onScrollStopped, { passive: true });
    } else {
        grid.addEventListener('scroll', () => {
            if (!mq.matches || isJumping) return;
            resetAllCards();
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(onScrollStopped, 400); /* увеличено с 150 до 400 */
        }, { passive: true });
    }

    /* Стрелки — вычисляем целевой индекс и обновляем точки сразу */
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (!mq.matches) return;
            resetAllCards();
            clearTimeout(scrollTimer);
            const targetIndex = currentIndex() - 1;
            grid.scrollBy({ left: -slideWidth(), behavior: 'smooth' });
            /* обновляем точки сразу, зная целевой индекс */
            const realIndex = toRealIndex(targetIndex);
            dots.forEach((dot, idx) => {
                dot.classList.toggle('reviews__dot--active', idx === realIndex);
            });
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (!mq.matches) return;
            resetAllCards();
            clearTimeout(scrollTimer);
            const targetIndex = currentIndex() + 1;
            grid.scrollBy({ left: slideWidth(), behavior: 'smooth' });
            const realIndex = toRealIndex(targetIndex);
            dots.forEach((dot, idx) => {
                dot.classList.toggle('reviews__dot--active', idx === realIndex);
            });
        });
    }

    /* Клики по точкам */
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            if (!mq.matches) return;
            resetAllCards();
            clearTimeout(scrollTimer);
            jumpTo(idx + 1);
            updateDots();
            scheduleReveal();
        });
    });

    /* Resize */
    window.addEventListener('resize', () => {
        if (!mq.matches) return;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const i = Math.min(Math.max(currentIndex(), 1), slidesCount);
            jumpTo(i);
            updateDots();
            scheduleReveal();
        }, 150);
    });

    /* Breakpoint */
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