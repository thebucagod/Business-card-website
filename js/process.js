const steps = document.querySelectorAll('.process__step');
const desc  = document.querySelector('.process__content-desc');
const image = document.querySelector('.process__image');

steps.forEach(step => {
    step.addEventListener('click', () => {

        // 1. Снимаем active у всех шагов
        steps.forEach(s => s.classList.remove('process__step--active'));

        // 2. Ставим active на кликнутый
        step.classList.add('process__step--active');

        // 3. Плавно скрываем контент
        desc.style.opacity  = '0';
        image.style.opacity = '0';

        // 4. Ждём пока контент скроется (300ms), потом подменяем и показываем
        setTimeout(() => {
            desc.textContent    = step.dataset.desc;
            image.src           = step.dataset.img;
            image.alt           = step.querySelector('.process__step-name').textContent;

            desc.style.opacity  = '1';
            image.style.opacity = '1';
        }, 300);
    });
});