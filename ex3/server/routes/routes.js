// Initialize express router
const express = require('express'),
// Import project controller
projectRoutes = require('./projects');
// Create express router
var router = express.Router();
// Set default API response
router.get('/projects/:id', projectRoutes.getProject);
router.post('/projects', projectRoutes.CreateProjects);
router.get('/projects', projectRoutes.getProjects);
router.put('/projects/:id', projectRoutes.updateProjects);
router.delete('/projects/:id', projectRoutes.deleteProject);

router.post('/projects/:id/images', projectRoutes.AddImagesToProject);
router.delete('/projects/:id/images/:imageId', projectRoutes.deleteImageFromProject);

router.get('/projects/searchImages/:search', projectRoutes.searchImage);
// Export API routes
module.exports = router;