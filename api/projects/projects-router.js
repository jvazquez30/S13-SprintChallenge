const express = require('express');
const Projects = require('./projects-model');
const { validateProject, validateProjectId } = require('./projects-middleware');
const router = express.Router();

// [GET] /api/projects
router.get('/', async (req, res) => {
  try {
    const projects = await Projects.get();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get projects' });
  }
});

// [GET] /api/projects/:id
router.get('/:id', validateProjectId, async (req, res) => {
  res.json(req.project);
});

// [POST] /api/projects
router.post('/', validateProject, async (req, res) => {
  try {
    const project = req.body;
    const newProject = await Projects.insert(project);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create project' });
  }
});

// [PUT] /api/projects/:id
router.put('/:id', validateProjectId, validateProject, async (req, res) => {
  try {
    const changes = req.body;
    const updatedProject = await Projects.update(req.params.id, changes);
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update project' });
  }
});

// [DELETE] /api/projects/:id
router.delete('/:id', validateProjectId, async (req, res) => {
  try {
    const count = await Projects.remove(req.params.id);
    if (count > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

// [GET] /api/projects/:id/actions
router.get('/:id/actions', validateProjectId, async (req, res) => {
  try {
    const actions = await Projects.getProjectActions(req.params.id);
    res.json(actions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get actions for project' });
  }
});

module.exports = router;
