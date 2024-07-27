const Actions = require('./actions-model');

// Middleware for validating action data
function validateAction(req, res, next) {
  const { project_id, description, notes, completed } = req.body;
  if (!project_id || !description || !notes || completed === undefined) {
    return res.status(400).json({ message: 'Missing required project_id, description, notes or completed field' });
  }
  next();
}

// Middleware for checking action ID
async function validateActionId(req, res, next) {
  try {
    const action = await Actions.get(req.params.id);
    if (action) {
      req.action = action;
      next();
    } else {
      res.status(404).json({ message: 'Action not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to validate action ID' });
  }
}

module.exports = {
  validateAction,
  validateActionId,
};
