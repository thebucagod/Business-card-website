const steps    = document.querySelectorAll('.process__step');
const desc     = document.querySelector('.process__content-desc');
const image    = document.querySelector('.process__image');
const mobileMQ = window.matchMedia('(max-width: 640px)');

/* Предзагрузка всех изображений секции */
steps.forEach(s => {
    const pre = new Image();
    pre.src = s.dataset.img;
});

let timer = null;

steps.forEach(step => {
    step.addEventListener('click', () => {
        if (mobileMQ.matches) return;

        steps.forEach(s => s.classList.remove('process__step--active'));
        step.classList.add('process__step--active');

        desc.style.opacity  = '0';
        image.style.opacity = '0';

        clearTimeout(timer);
        timer = setTimeout(() => {
            // Текст синхронный — показываем сразу
            desc.innerHTML = step.querySelector('.process__step-desc').innerHTML;
            desc.style.opacity = '1';

            // Фото — только после загрузки нового кадра
            image.alt    = step.querySelector('.process__step-name').textContent;
            image.onload  = () => { image.style.opacity = '1'; };
            image.onerror = () => { image.style.opacity = '1'; }; // не блокируем UI при ошибке
            image.src = step.dataset.img;
            if (image.complete) image.style.opacity = '1';        // случай кэша
        }, 300);
    });
});