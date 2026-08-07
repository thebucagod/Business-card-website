const steps  = document.querySelectorAll('.process__step');
const desc   = document.querySelector('.process__content-desc');
const image  = document.querySelector('.process__image');
const mobileMQ = window.matchMedia('(max-width: 640px)');

steps.forEach(step => {
    step.addEventListener('click', () => {
        if (mobileMQ.matches) return; // мобильная версия — статичный список

        steps.forEach(s => s.classList.remove('process__step--active'));
        step.classList.add('process__step--active');

        desc.style.opacity  = '0';
        image.style.opacity = '0';

        setTimeout(() => {
            desc.innerHTML = step.querySelector('.process__step-desc').innerHTML;

            image.src = step.dataset.img;
            image.alt = step.querySelector('.process__step-name').textContent;

            desc.style.opacity  = '1';
            image.style.opacity = '1';
        }, 300);
    });
});