const siteLanguage = document.querySelector('.language-switch');
const languageButtons = [...siteLanguage.querySelectorAll('[data-lang]')];
const translations = [...document.querySelectorAll('[data-en], [data-en-label], [data-en-alt]')]
  .map(element => ({
    element,
    text: element.hasAttribute('data-en') ? [element.textContent, element.dataset.en] : null,
    label: element.hasAttribute('data-en-label') ? [element.getAttribute('aria-label'), element.dataset.enLabel] : null,
    alt: element.hasAttribute('data-en-alt') ? [element.getAttribute('alt'), element.dataset.enAlt] : null,
  }));
const statusText = document.querySelector('#hours-status');
const shopTime = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Athens',
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});
const closingHours = { Tue: 20, Wed: 18, Thu: 20, Fri: 20, Sat: 18 };
let currentLanguage = 'el';

function updateHours() {
  const clock = Object.fromEntries(shopTime.formatToParts().map(part => [part.type, part.value]));
  const closes = closingHours[clock.weekday];
  const minutes = Number(clock.hour) * 60 + Number(clock.minute);
  const isOpen = Boolean(closes && minutes >= 600 && minutes < closes * 60);
  const status = statusText.parentElement;

  if (isOpen) {
    statusText.textContent = currentLanguage === 'en' ? `Open until ${closes}:00` : `Ανοιχτά έως τις ${closes}:00`;
  } else if (closes && minutes < 600) {
    statusText.textContent = currentLanguage === 'en' ? 'Opens today at 10:00' : 'Ανοίγει σήμερα στις 10:00';
  } else {
    statusText.textContent = currentLanguage === 'en' ? 'Closed now' : 'Κλειστά τώρα';
  }

  status.classList.toggle('is-open', isOpen);
  status.hidden = false;
}

function setLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language;
  document.title = language === 'en'
    ? 'JustBarber Athens | Barbershop & online booking'
    : 'JustBarber Athens | Κουρείο & online ραντεβού';

  const index = language === 'en' ? 1 : 0;
  for (const { element, text, label, alt } of translations) {
    if (text) element.textContent = text[index];
    if (label) element.setAttribute('aria-label', label[index]);
    if (alt) element.setAttribute('alt', alt[index]);
  }
  for (const button of languageButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.lang === language));
  }
  updateHours();
}

try {
  if (localStorage.getItem('justbarber-language') === 'en') currentLanguage = 'en';
} catch {
  // The language switch still works when storage is unavailable.
}

setLanguage(currentLanguage);
siteLanguage.hidden = false;
window.setInterval(updateHours, 30_000);
window.addEventListener('pageshow', updateHours);
for (const button of languageButtons) {
  button.addEventListener('click', () => {
    setLanguage(button.dataset.lang);
    try {
      localStorage.setItem('justbarber-language', currentLanguage);
    } catch {
      // Keep the language selected for the current page.
    }
  });
}

const serviceTabs = document.querySelector('.service-tabs');
const filterButtons = [...serviceTabs.querySelectorAll('[data-filter]')];
const servicePanels = [...document.querySelectorAll('[data-category]')];

function filterServices(category) {
  for (const button of filterButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.filter === category));
  }
  for (const panel of servicePanels) {
    panel.hidden = panel.dataset.category !== category;
  }
}

for (const button of filterButtons) {
  button.addEventListener('click', () => filterServices(button.dataset.filter));
}
filterServices('hair');
document.body.classList.add('has-service-filters');
serviceTabs.hidden = false;

const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('#site-nav');
const mobileWidth = matchMedia('(max-width: 760px)');

function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.querySelector('.menu-open-icon').hidden = open;
  menuToggle.querySelector('.menu-close-icon').hidden = !open;
  siteNav.classList.toggle('is-open', open);
}

document.body.classList.add('has-mobile-menu');
menuToggle.hidden = false;
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  setMenu(open);
  if (open) siteNav.querySelector('a').focus();
});
siteNav.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
});
mobileWidth.addEventListener('change', () => setMenu(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuToggle.focus();
  }
});

const bookingDialog = document.querySelector('#booking');
const lightbox = document.querySelector('#lightbox');
const galleryItems = [...document.querySelectorAll('.gallery-item')];
let activePhoto = 0;

if (typeof bookingDialog.showModal === 'function') {
  for (const link of document.querySelectorAll('[data-book]')) {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      setMenu(false);
      bookingDialog.showModal();
    });
  }

  const lightboxImage = document.querySelector('#lightbox-image');
  const lightboxCaption = document.querySelector('#lightbox-caption');

  function showPhoto(index) {
    activePhoto = (index + galleryItems.length) % galleryItems.length;
    const link = galleryItems[activePhoto];
    lightboxImage.alt = link.querySelector('img').alt;
    lightboxImage.src = link.href;
    lightboxCaption.textContent = link.querySelector('.gallery-caption span').textContent;
  }

  galleryItems.forEach((link, index) => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      showPhoto(index);
      lightbox.showModal();
    });
  });
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showPhoto(activePhoto - 1));
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(activePhoto + 1));
  lightbox.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(activePhoto + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });

  for (const dialog of [bookingDialog, lightbox]) {
    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close();
    });
  }
}

if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }
  }, { rootMargin: '0px 0px -24px', threshold: 0.08 });

  document.body.classList.add('motion-ready');
  for (const section of document.querySelectorAll('.reveal')) revealObserver.observe(section);
}
