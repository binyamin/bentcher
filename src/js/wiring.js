/// <reference lib="dom" />

/**
 * @type {HTMLElement[]}
 */
const secs = [...document.querySelectorAll('.section')];

for (const sec of secs) {
    const btn = sec.querySelector('.trigger');
    const div = sec.querySelector('.content');

    btn.addEventListener('click', (_e) => {
        const expanded = btn.getAttribute('aria-expanded') === 'true' || false;
        btn.setAttribute('aria-expanded', !expanded);
        div.hidden = expanded;

        if (!expanded) {
            btn.scrollIntoView({
                block: 'start',
                behavior: 'smooth'
            })
        }
    })
}