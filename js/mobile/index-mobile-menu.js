const burger  = document.querySelector('.header__burger');
const overlay = document.querySelector('.header__mobile-overlay');
const close   = document.querySelector('.header__close');
const links   = document.querySelectorAll('.header__mobile-link');

function openMenu() {
    overlay.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; /* блокируем скролл страницы */
}

function closeMenu() {
    overlay.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

burger.addEventListener('click', openMenu);
close.addEventListener('click', closeMenu);

/* Закрываем меню при клике на любую ссылку */
links.forEach(link => link.addEventListener('click', closeMenu));