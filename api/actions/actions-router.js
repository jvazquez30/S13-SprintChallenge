const express = require('express');
const Actions = require('./actions-model');
const Projects = require('../projects/projects-model');
const { validateAction, validateActionId } = require('./actions-middleware.js');
const router = express.Router();

// [GET] /api/actions
router.get('/', async (req, res) => {
  try {
    const actions = await Actions.get();
    res.json(actions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get actions' });
  }
});

// [GET] /api/actions/:id
router.get('/:id', validateActionId, async (req, res) => {
  res.json(req.action);
});

// [POST] /api/actions
router.post('/', validateAction, async (req, res) => {
  try {
    const action = req.body;
    const project = await Projects.get(action.project_id);
    if (project) {
      const newAction = await Actions.insert(action);
      res.status(201).json(newAction);
    } else {
      res.status(400).json({ message: 'Invalid project ID' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to create action' });
  }
});

// [PUT] /api/actions/:id
router.put('/:id', validateActionId, validateAction, async (req, res) => {
  try {
    const changes = req.body;
    const updatedAction = await Actions.update(req.params.id, changes);
    res.json(updatedAction);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update action' });
  }
});

// [DELETE] /api/actions/:id
router.delete('/:id', validateActionId, async (req, res) => {
  try {
    const count = await Actions.remove(req.params.id);
    if (count > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Action not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete action' });
  }
});

module.exports = router;
