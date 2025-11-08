import express from 'express';
import constructionService from '../services/construction.service.js';

const router = express.Router();

// GET /api/construction/projects - Get all projects
router.get('/projects', (req, res) => {
  try {
    const projects = constructionService.getAllProjects();
    res.json({
      success: true,
      projects
    });
  } catch (error) {
    console.error('Projects fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch projects',
      details: error.message
    });
  }
});

// GET /api/construction/projects/:projectId - Get project info
router.get('/projects/:projectId', (req, res) => {
  try {
    const { projectId } = req.params;
    const project = constructionService.getProjectInfo(projectId);

    if (!project) {
      return res.status(404).json({
        error: 'Project not found'
      });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Project fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch project',
      details: error.message
    });
  }
});

// GET /api/construction/updates/:projectId - Get daily update
router.get('/updates/:projectId', (req, res) => {
  try {
    const { projectId } = req.params;
    const update = constructionService.generateDailyUpdate(projectId);

    if (!update) {
      return res.status(404).json({
        error: 'Project not found'
      });
    }

    res.json({
      success: true,
      update
    });
  } catch (error) {
    console.error('Update fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch update',
      details: error.message
    });
  }
});

// GET /api/construction/timeline/:projectId - Get construction timeline
router.get('/timeline/:projectId', (req, res) => {
  try {
    const { projectId } = req.params;
    const timeline = constructionService.getConstructionTimeline(projectId);

    if (!timeline) {
      return res.status(404).json({
        error: 'Project not found'
      });
    }

    res.json({
      success: true,
      timeline
    });
  } catch (error) {
    console.error('Timeline fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch timeline',
      details: error.message
    });
  }
});

export default router;
