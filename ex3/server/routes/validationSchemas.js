const yup = require('yup');
// Define validation schema for project and image
const projectSchema = yup.object().shape({
    name: yup.string().required('Project name is required'),
    summary: yup.string().min(20, 'Summary must be at least 20 characters').max(80, 'Summary must be no more than 80 characters').required('Summary is required'),
    manager: yup.object({
        name: yup.string().matches(/^[A-Za-z ]+$/, 'Manager name must only contain letters from A to Z').required('Manager name is required'),        
        email: yup.string().email('Invalid email format').required('Manager email is required')
    }).noUnknown(true, 'Cannot add unknown fields to manager').required(),
    team: yup.array().of(
        yup.object({
            name: yup.string().matches(/^[A-Za-z ]+$/, 'Team member name must only contain letters from A to Z').required('Team member name is required'),            
            email: yup.string().email('Invalid email format').required('Team member email is required'),
            role: yup.string().required('Team member role is required')
        }).noUnknown(true, 'Cannot add unknown fields to team members')
    ).required(),    
    start_date: yup
    .string()
    .required('Start date is required')
    .test(
      'is-timestamp',
      'Start date must be a valid timestamp',
      value => !isNaN(new Date(Number(value)).getTime())
    ),
    images: yup.array().of(
        yup.object({
            id: yup.string().required('Image ID is required'),
            thumb: yup.string().url('Invalid URL format').required('Image URL is required'),
            description: yup.string().required('Image description is required')
        }).noUnknown(true, 'Cannot add unknown fields to images')
    ).optional()
}).noUnknown(true, 'Cannot add unknown fields to project');
// Define validation schema for image
const imageSchema = yup.object().shape({
    id: yup.string().required('Image ID is required'),
    thumb: yup.string().url('Invalid URL format').required('Image URL is required'),
    description: yup.string().required('Image description is required')
}).noUnknown(true, 'Cannot add unknown fields to image');

module.exports = { projectSchema, imageSchema };