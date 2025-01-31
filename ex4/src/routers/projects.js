const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const Member = require('../models/member');

// Create Project
router.post('/projects', async (req, res) => {
  try {
    const { name, summary, start_date, manager, team } = req.body;
    const projectManger = await Member.findById(manager).lean();

    if (!projectManger) {
      return res.status(404).send({ error: 'Manager not found' });
    }
    // Validate and prepare the team array
      const teamMembers = await Promise.all(team.map(async (teamMember) => {
      const member = await Member.findById(teamMember._id).lean();
      if (!member) {
        return res.status(404).send({ error: 'Team Member not found' });
      }
      return { _id: member._id, role: teamMember.role };
    }));
    const project = new Project({
      name,
      summary,
      start_date,
      manager: { _id: manager._id },
      team: teamMembers
    });

    await project.save();
    res.status(201).send({ _id: project._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get Projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().populate('manager._id');
    const mappedProjects = await Promise.all(projects.map(async (project) => {
      const teamMembers = await Promise.all(project.team.map(async (teamMember) => {
        const member = await Member.findById(teamMember._id).lean();
        if (!member) {
          throw new Error('Team Member not found');
        }
        return { _id: member._id, name: member.name, email: member.email, role: teamMember.role };
      }));
      return { ...project.toObject(), team: teamMembers };
    }));
    res.status(200).send(mappedProjects);
  } catch (error) {
    if (error.message === 'Team Member not found') {
      res.status(404).send({ error: error.message });
    } else {
      res.status(400).send(error);
    }
  }
});

// Add Image to Project
router.post('/projects/:projectId/images', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { thumb, description } = req.body;
    // Check if any project has an image with the same thumb
    const existingImage = await Project.findOne({ 'images.thumb': thumb });
    if (existingImage) {
      return res.status(400).send('An image with the same thumb already exists in another project');
    }
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).send('Project not found');
    }
    project.images.push({ thumb, description });
    await project.save();
    const addedImage = project.images[project.images.length - 1];
    res.status(200).send({ _id: addedImage._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete Image from Project
router.delete('/projects/:projectId/images/:imageId', async (req, res) => {
  try {
    const { projectId, imageId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).send('Project not found');
    }
    const imageIndex = project.images.findIndex(image => image._id.toString() === imageId);
    if (imageIndex === -1) {
      return res.status(404).send('Image not found');
    }
    project.images.splice(imageIndex, 1);
    await project.save();
    res.status(200).send(project);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;