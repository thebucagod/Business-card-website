const steps = document.querySelectorAll('.process__step');
const desc  = document.querySelector('.process__content-desc');
const image = document.querySelector('.process__image');

steps.forEach(step => {
    step.addEventListener('click', () => {
        // Снимаем active
        steps.forEach(s => s.classList.remove('process__step--active'));
        step.classList.add('process__step--active');

        // Плавное скрытие
        desc.style.opacity  = '0';
        image.style.opacity = '0';

        setTimeout(() => {
            const rawText = step.dataset.desc;
            
            // Преобразуем переносы строк в <br>
            desc.innerHTML = rawText.replace(/\n/g, '<br>');

            image.src = step.dataset.img;
            image.alt = step.querySelector('.process__step-name').textContent;

            desc.style.opacity  = '1';
            image.style.opacity = '1';
        }, 300);
    });
});