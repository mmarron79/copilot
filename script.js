const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

function toggleNavigationMenu() {
  const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isExpanded));
  navMenu.classList.toggle('is-open', !isExpanded);
}

if (navToggle && navMenu) {
  navToggle.addEventListener('click', toggleNavigationMenu);
}

if (navMenu) {
  navMenu.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.getElementById(link.hash.slice(1));
      if (!target) return;

      event.preventDefault();
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });

      if (window.location.hash !== link.hash) {
        window.history.pushState(null, '', link.hash);
      }

      if (navToggle && navMenu.classList.contains('is-open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
      }
    });
  });
}

const projectsSection = document.querySelector('#projects');
const projectFilters = projectsSection?.querySelector('.project-filters');

if (projectsSection && projectFilters) {
  const projects = Array.from(projectsSection.querySelectorAll('article[data-category]'));
  const filterButtons = projectFilters.querySelectorAll('button[data-filter]');
  const filterStatus = projectsSection.querySelector('#project-filter-status');

  projectFilters.hidden = false;

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedFilter = button.dataset.filter;
      if (!selectedFilter) return;

      let visibleCount = 0;
      projects.forEach((project) => {
        const isVisible =
          selectedFilter === 'all' || project.dataset.category === selectedFilter;
        project.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
      });

      filterButtons.forEach((filterButton) => {
        filterButton.setAttribute(
          'aria-pressed',
          String(filterButton === button)
        );
      });

      if (filterStatus) {
        filterStatus.textContent = `${visibleCount} ${
          visibleCount === 1 ? 'project' : 'projects'
        } shown.`;
      }
    });
  });
}

const lightbox = document.querySelector('#project-lightbox');
const lightboxImage = lightbox?.querySelector('.lightbox-image');
const lightboxClose = lightbox?.querySelector('.lightbox-close');
let lightboxTrigger = null;

function openProjectLightbox(trigger) {
  if (!lightbox || !lightboxImage) return;

  const projectImage = trigger.querySelector('img');
  if (!projectImage) return;

  lightboxTrigger = trigger;
  lightboxImage.src = projectImage.currentSrc || projectImage.src;
  lightboxImage.alt = projectImage.alt;
  lightbox.showModal();
  lightboxClose?.focus();
}

function closeProjectLightbox() {
  if (!lightbox?.open) return;
  lightbox.close();
}

if (projectsSection && lightbox) {
  projectsSection.querySelectorAll('.project-image-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => openProjectLightbox(trigger));
  });

  lightboxClose?.addEventListener('click', closeProjectLightbox);

  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeProjectLightbox();
    }
  });

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeProjectLightbox();
  });

  lightbox.addEventListener('close', () => {
    lightboxImage?.removeAttribute('src');
    lightboxTrigger?.focus();
    lightboxTrigger = null;
  });
}

const contactForm = document.querySelector('#contact form');

if (contactForm) {
  const fields = Array.from(
    contactForm.querySelectorAll('input[required], textarea[required]')
  );

  function validateContactField(field) {
    const error = document.getElementById(`${field.id}-error`);
    const value = field.value.trim();
    let message = '';

    if (!value) {
      message = `Please enter your ${field.labels[0].textContent.toLowerCase()}.`;
    } else if (field.type === 'email' && field.validity.typeMismatch) {
      message = 'Please enter a valid email address.';
    }

    field.setAttribute('aria-invalid', String(Boolean(message)));
    if (error) error.textContent = message;
    return !message;
  }

  fields.forEach((field) => {
    field.addEventListener('input', () => validateContactField(field));
    field.addEventListener('blur', () => validateContactField(field));
  });

  contactForm.addEventListener('submit', (event) => {
    const invalidFields = fields.filter((field) => !validateContactField(field));

    if (invalidFields.length > 0) {
      event.preventDefault();
      invalidFields[0].focus();
    }
  });
}