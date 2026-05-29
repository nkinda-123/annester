const API_BASE = '';

// Tab switching
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    const tabName = button.getAttribute('data-tab');
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(tabName).classList.add('active');

    // Load content when tab is activated
    if (tabName === 'skills') loadSkills();
    if (tabName === 'projects') loadProjects();
    if (tabName === 'qualifications') loadQualifications();
  });
});

// Show message helper
function showMessage(elementId, text, type = 'success') {
  const messageEl = document.getElementById(elementId);
  messageEl.textContent = text;
  messageEl.className = `message show ${type}`;
  setTimeout(() => messageEl.classList.remove('show'), 3000);
}

// PROFILE
document.getElementById('profileForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const profileData = {
    name: document.getElementById('profileName').value,
    role: document.getElementById('profileRole').value,
    summary: document.getElementById('profileSummary').value,
    bio: document.getElementById('profileBio').value,
    contact: {
      email: document.getElementById('profileEmail').value,
      phone: document.getElementById('profilePhone').value,
    }
  };

  try {
    const res = await fetch(`${API_BASE}/api/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });

    if (res.ok) {
      showMessage('profileMessage', 'Profile updated successfully!', 'success');
    } else {
      showMessage('profileMessage', 'Error updating profile', 'error');
    }
  } catch (error) {
    showMessage('profileMessage', 'Failed to update profile', 'error');
  }
});

// Load profile data
window.addEventListener('load', async () => {
  try {
    const res = await fetch(`${API_BASE}/api/profile`);
    const data = await res.json();
    document.getElementById('profileName').value = data.name;
    document.getElementById('profileRole').value = data.role;
    document.getElementById('profileSummary').value = data.summary;
    document.getElementById('profileBio').value = data.bio;
    document.getElementById('profileEmail').value = data.contact.email;
    document.getElementById('profilePhone').value = data.contact.phone;
  } catch (error) {
    console.error('Failed to load profile:', error);
  }
});

// SKILLS
document.getElementById('skillForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const skillName = document.getElementById('skillName').value.trim();

  if (!skillName) {
    showMessage('skillsMessage', 'Skill name cannot be empty', 'error');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: skillName })
    });

    if (res.ok) {
      document.getElementById('skillName').value = '';
      showMessage('skillsMessage', 'Skill added successfully!', 'success');
      loadSkills();
    } else {
      const errorData = await res.json();
      showMessage('skillsMessage', errorData.error || 'Failed to add skill', 'error');
    }
  } catch (error) {
    console.error('Skill error:', error);
    showMessage('skillsMessage', `Error: ${error.message}. Make sure the server is running on port 3000.`, 'error');
  }
});

async function loadSkills() {
  try {
    const res = await fetch(`${API_BASE}/api/profile`);
    const data = await res.json();
    const skillsList = document.getElementById('skillsList');

    skillsList.innerHTML = data.skills.map((skill, idx) => `
      <div class="item-card">
        <div class="item-content">
          <h3>${skill}</h3>
        </div>
        <div class="item-actions">
          <button class="btn btn-danger btn-small" onclick="deleteSkill('${skill}')">Delete</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Failed to load skills:', error);
  }
}

async function deleteSkill(skillName) {
  try {
    const res = await fetch(`${API_BASE}/api/skills`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: skillName })
    });

    if (res.ok) {
      showMessage('skillsMessage', 'Skill deleted!', 'success');
      loadSkills();
    }
  } catch (error) {
    showMessage('skillsMessage', 'Failed to delete skill', 'error');
  }
}

// PROJECTS
document.getElementById('projectForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const projectData = {
    name: document.getElementById('projectName').value,
    description: document.getElementById('projectDesc').value,
    tools: document.getElementById('projectTools').value.split(',').map(t => t.trim()),
    status: document.getElementById('projectStatus').value,
    link: document.getElementById('projectLink').value
  };

  const projectId = document.getElementById('projectId').value;
  const method = projectId ? 'PUT' : 'POST';
  const url = projectId ? `${API_BASE}/api/projects/${projectId}` : `${API_BASE}/api/projects`;

  try {
    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    });

    if (res.ok) {
      document.getElementById('projectForm').reset();
      document.getElementById('projectId').value = '';
      document.getElementById('clearProjectForm').style.display = 'none';
      showMessage('projectsMessage', 'Project saved successfully!', 'success');
      loadProjects();
    }
  } catch (error) {
    showMessage('projectsMessage', 'Failed to save project', 'error');
  }
});

async function loadProjects() {
  try {
    const res = await fetch(`${API_BASE}/api/projects`);
    const projects = await res.json();
    const projectsList = document.getElementById('projectsList');

    projectsList.innerHTML = projects.map((project, idx) => `
      <div class="item-card">
        <div class="item-content">
          <h3>${project.name}</h3>
          <p>${project.description}</p>
          <p><strong>Status:</strong> ${project.status} | <strong>Tools:</strong> ${project.tools.join(', ')}</p>
        </div>
        <div class="item-actions">
          <button class="btn btn-secondary btn-small" onclick="editProject(${idx})">Edit</button>
          <button class="btn btn-danger btn-small" onclick="deleteProject(${idx})">Delete</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Failed to load projects:', error);
  }
}

async function editProject(idx) {
  try {
    const res = await fetch(`${API_BASE}/api/projects`);
    const projects = await res.json();
    const project = projects[idx];

    document.getElementById('projectId').value = idx;
    document.getElementById('projectName').value = project.name;
    document.getElementById('projectDesc').value = project.description;
    document.getElementById('projectTools').value = project.tools.join(', ');
    document.getElementById('projectStatus').value = project.status;
    document.getElementById('projectLink').value = project.link;
    document.getElementById('clearProjectForm').style.display = 'inline-block';
    document.querySelector('[data-tab="projects"]').click();
  } catch (error) {
    console.error('Failed to load project:', error);
  }
}

async function deleteProject(idx) {
  try {
    const res = await fetch(`${API_BASE}/api/projects/${idx}`, { method: 'DELETE' });

    if (res.ok) {
      showMessage('projectsMessage', 'Project deleted!', 'success');
      loadProjects();
    }
  } catch (error) {
    showMessage('projectsMessage', 'Failed to delete project', 'error');
  }
}

document.getElementById('clearProjectForm').addEventListener('click', () => {
  document.getElementById('projectForm').reset();
  document.getElementById('projectId').value = '';
  document.getElementById('clearProjectForm').style.display = 'none';
});

// QUALIFICATIONS
document.getElementById('qualForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const qualData = {
    title: document.getElementById('qualTitle').value,
    institution: document.getElementById('qualInstitution').value,
    date: document.getElementById('qualDate').value
  };

  try {
    const res = await fetch(`${API_BASE}/api/qualifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(qualData)
    });

    if (res.ok) {
      document.getElementById('qualForm').reset();
      showMessage('qualMessage', 'Qualification added successfully!', 'success');
      loadQualifications();
    }
  } catch (error) {
    showMessage('qualMessage', 'Failed to add qualification', 'error');
  }
});

async function loadQualifications() {
  try {
    const res = await fetch(`${API_BASE}/api/profile`);
    const data = await res.json();
    const qualList = document.getElementById('qualList');

    qualList.innerHTML = data.qualifications.map((qual, idx) => `
      <div class="item-card">
        <div class="item-content">
          <h3>${qual.title}</h3>
          <p><strong>${qual.institution}</strong> · ${qual.date}</p>
        </div>
        <div class="item-actions">
          <button class="btn btn-danger btn-small" onclick="deleteQualification(${idx})">Delete</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Failed to load qualifications:', error);
  }
}

async function deleteQualification(idx) {
  try {
    const res = await fetch(`${API_BASE}/api/qualifications/${idx}`, { method: 'DELETE' });

    if (res.ok) {
      showMessage('qualMessage', 'Qualification deleted!', 'success');
      loadQualifications();
    }
  } catch (error) {
    showMessage('qualMessage', 'Failed to delete qualification', 'error');
  }
}
