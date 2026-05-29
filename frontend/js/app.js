const apiBase = '';

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

    document.querySelector('.hero-copy h1').textContent = profile.name;
    document.querySelector('.hero-copy p').textContent = profile.summary;
    document.querySelector('.hero-role').textContent = profile.role;
    document.querySelector('.about-text').textContent = profile.bio;
    document.querySelector('.contact-email').href = `mailto:${profile.contact.email}`;
    document.querySelector('.contact-email').textContent = profile.contact.email;
    document.querySelector('.contact-phone').href = `tel:${profile.contact.phone}`;
    document.querySelector('.contact-phone').textContent = profile.contact.phone;

    const skillsList = document.querySelector('.skills-list');
    skillsList.innerHTML = profile.skills
      .map((skill) => `<li class="skill-chip">${skill}</li>`)
      .join('');

    const qualList = document.querySelector('.qual-list');
    qualList.innerHTML = profile.qualifications
      .map(
        (item) => `<li class="timeline-item"><strong>${item.title}</strong><span>${item.institution}</span><span>${item.date}</span></li>`
      )
      .join('');

    const projectsGrid = document.querySelector('.project-grid');
    projectsGrid.innerHTML = projects.map((project) => `
      <div class="project-card">
        <div class="card">
          <h3>${project.name}</h3>
          <p>${project.description}</p>
          <ul class="project-details">
            <li><strong>Tools:</strong> ${project.tools.join(', ')}</li>
            <li><strong>Status:</strong> ${project.status}</li>
          </ul>
          <a class="cta-secondary" href="${project.link}" target="_blank" rel="noreferrer">View Project</a>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.warn('Portfolio data load failed:', error);
  }
}

fetchPortfolioData();
