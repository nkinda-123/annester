const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data store (replace with database for production)
let portfolioData = {
  name: 'Annester Kibonde',
  role: 'Data Science Student',
  summary: 'I build data-driven insights, predictive analytics solutions, and cloud-ready data applications to support smarter decisions.',
  bio: 'I am a motivated data science student who combines analytics, storytelling, and cloud deployment to create impactful solutions.',
  skills: ['Python', 'Pandas', 'Scikit-learn', 'SQL', 'Tableau', 'Git', 'Express', 'Cloud Deployment'],
  qualifications: [
    { title: 'BSc Data Science', institution: 'University of Dar es Salaam', date: '2024 - Present' },
    { title: 'Machine Learning Specialization', institution: 'Coursera', date: '2025' },
    { title: 'Data Visualization Bootcamp', institution: 'Udacity', date: '2025' }
  ],
  projects: [
    {
      name: 'Smart Sales Dashboard',
      description: 'A responsive analytics dashboard with sales trends, KPI monitoring, and dynamic charts for business stakeholders.',
      tools: ['Python', 'Dash', 'Plotly'],
      status: 'Prototype',
      link: '#contact'
    },
    {
      name: 'Customer Churn Model',
      description: 'A predictive model that identifies retention risk using classification and feature engineering for improved customer loyalty.',
      tools: ['Python', 'Scikit-learn', 'Pandas'],
      status: 'Completed',
      link: '#contact'
    },
    {
      name: 'Cloud Deployment Pipeline',
      description: 'Backend API and frontend pipeline prepared for cloud hosting using Render and Vercel.',
      tools: ['Node.js', 'Express', 'Vercel', 'Render'],
      status: 'Ready',
      link: '#contact'
    }
  ],
  contact: {
    email: 'annekibonde009@gmail.com',
    phone: '0766360158',
    location: 'Dar es Salaam, Tanzania'
  }
};

app.get('/', (req, res) => {
  res.send('Backend server is running.');
});

// GET profile
app.get('/api/profile', (req, res) => {
  res.json(portfolioData);
});

// PUT profile
app.put('/api/profile', (req, res) => {
  const { name, role, summary, bio, contact } = req.body;
  
  if (name) portfolioData.name = name;
  if (role) portfolioData.role = role;
  if (summary) portfolioData.summary = summary;
  if (bio) portfolioData.bio = bio;
  if (contact) portfolioData.contact = { ...portfolioData.contact, ...contact };
  
  res.json({ success: true, message: 'Profile updated' });
});

// GET projects
app.get('/api/projects', (req, res) => {
  res.json(portfolioData.projects);
});

// POST project
app.post('/api/projects', (req, res) => {
  const newProject = req.body;
  portfolioData.projects.push(newProject);
  res.json({ success: true, project: newProject });
});

// PUT project
app.put('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  if (portfolioData.projects[id]) {
    portfolioData.projects[id] = { ...portfolioData.projects[id], ...req.body };
    res.json({ success: true, project: portfolioData.projects[id] });
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

// DELETE project
app.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  if (portfolioData.projects[id]) {
    portfolioData.projects.splice(id, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

// POST skill
app.post('/api/skills', (req, res) => {
  const { name } = req.body;
  if (!portfolioData.skills.includes(name)) {
    portfolioData.skills.push(name);
    res.json({ success: true, skill: name });
  } else {
    res.status(400).json({ error: 'Skill already exists' });
  }
});

// DELETE skill
app.delete('/api/skills', (req, res) => {
  const { name } = req.body;
  portfolioData.skills = portfolioData.skills.filter(s => s !== name);
  res.json({ success: true });
});

// POST qualification
app.post('/api/qualifications', (req, res) => {
  const newQual = req.body;
  portfolioData.qualifications.push(newQual);
  res.json({ success: true, qualification: newQual });
});

// DELETE qualification
app.delete('/api/qualifications/:id', (req, res) => {
  const { id } = req.params;
  if (portfolioData.qualifications[id]) {
    portfolioData.qualifications.splice(id, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Qualification not found' });
  }
});

// POST contact message
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  return res.json({ success: true, message: 'Message received. Thank you!' });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
