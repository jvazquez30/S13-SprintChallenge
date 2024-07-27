const Projects = require('./projects-model');

function validateProject(req, res, next) {
  const { name, description, completed } = req.body;
  if (!name || !description || completed === undefined) {
    return res.status(400).json({ message: 'Missing required name, description or completed field' });
  }
  next();
}

async function validateProjectId(req, res, next) {
  try {
    const project = await Projects.get(req.params.id);
    if (project) {
      req.project = project;
      next();
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to validate project ID' });
  }
}

module.exports = {
  validateProject,
  validateProjectId,
};

