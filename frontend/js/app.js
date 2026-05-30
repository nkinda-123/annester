const apiBase = 'https://annester.onrender.com';

// Scroll Progress Bar
function updateScrollProgress() {
  const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (window.scrollY / windowHeight) * 100;
  document.querySelector('.scroll-progress').style.width = scrolled + '%';
}

window.addEventListener('scroll', updateScrollProgress);

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-scale').forEach(el => {
  observer.observe(el);
});

// Smooth scroll navigation
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

async function fetchPortfolioData() {
  try {
    const [profileRes, projectsRes] = await Promise.all([
      fetch(`${apiBase}/api/profile`),
      fetch(`${apiBase}/api/projects`),
    ]);

    if (!profileRes.ok || !projectsRes.ok) {
      throw new Error('Could not load portfolio data');
    }

    const profile = await profileRes.json();
    const projects = await projectsRes.json();

    // Update header
    document.querySelector('.hero-copy h1').textContent = profile.name;
    document.querySelector('.hero-intro').textContent = profile.summary;
    document.querySelector('.hero-role').textContent = profile.role;
    document.querySelector('.about-text').textContent = profile.bio;

    // Update contact info
    const emailElement = document.querySelector('.contact-email');
    if (emailElement) {
      emailElement.href = `mailto:${profile.contact.email}`;
      emailElement.textContent = profile.contact.email;
    }

    const phoneElement = document.querySelector('.contact-phone');
    if (phoneElement) {
      phoneElement.href = `tel:${profile.contact.phone}`;
      phoneElement.textContent = profile.contact.phone;
    }

    // Update skills
    const skillsList = document.querySelector('.skills-list');
    if (skillsList) {
      skillsList.innerHTML = profile.skills
        .map((skill) => `<li class="skill-chip fade-in-up">${skill}</li>`)
        .join('');
      
      // Re-observe new skill elements
      document.querySelectorAll('.skill-chip').forEach(el => observer.observe(el));
    }

    // Update qualifications
    const timeline = document.querySelector('.timeline');
    if (timeline) {
      timeline.innerHTML = profile.qualifications
        .map((item, index) => `
          <div class="timeline-item fade-in-left" style="animation-delay: ${index * 0.1}s">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <strong>${item.title}</strong>
              <span class="timeline-school">${item.institution}</span>
              <span class="timeline-date">${item.date}</span>
            </div>
          </div>
        `)
        .join('');
      
      // Re-observe new timeline elements
      document.querySelectorAll('.timeline-item').forEach(el => observer.observe(el));
    }

    // Update projects
    const projectsGrid = document.querySelector('.project-grid');
    if (projectsGrid) {
      projectsGrid.innerHTML = projects.map((project, index) => `
        <div class="project-card fade-in-up" style="animation-delay: ${index * 0.15}s">
          <div class="card">
            <div class="project-icon">📊</div>
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            <div class="tech-tags">
              ${project.tools.map(tool => `<span>${tool}</span>`).join('')}
            </div>
            <a class="cta-secondary" href="${project.link}" target="_blank" rel="noreferrer">View Project →</a>
          </div>
        </div>
      `).join('');
      
      // Re-observe new project elements
      document.querySelectorAll('.project-card').forEach(el => observer.observe(el));
    }
  } catch (error) {
    console.error('Error loading portfolio:', error);
  }
}

// Fetch data on page load
document.addEventListener('DOMContentLoaded', fetchPortfolioData);

// Add ripple effect to buttons
document.querySelectorAll('.cta-primary, .cta-secondary, .contact-link').forEach(button => {
  button.addEventListener('mouseenter', function() {
    this.style.transition = 'all 0.3s ease';
  });
});
