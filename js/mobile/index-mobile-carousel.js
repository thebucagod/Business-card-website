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