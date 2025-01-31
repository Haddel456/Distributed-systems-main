const fs = require('fs');
const { projectSchema, imageSchema } = require('./validationSchemas');
const axios = require('axios');


// variables
const dataPath = './server/data/projects.json';

// helper methods
const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
    fs.readFile(filePath, encoding, (err, data) => {
        if (err) {
            console.log(err);
        }
        if (!data) data = "{}";
        callback(returnJson ? JSON.parse(data) : data);
    });
};

const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {
    fs.writeFile(filePath, fileData, encoding, (err) => {
        if (err) {
            console.log(err);
        }

        callback();
    });
};

// Generate a unique project ID
const generateProjectId = (data) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let autoId = '';
    // Generate a 13-character alphanumeric string
    do {
        autoId = '';
        for (let i = 0; i < 13; i++) {
            autoId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    } while (data[autoId]);
    // Return the unique ID
    return autoId;
};

// Export the methods
module.exports = {
    // READ BY ID
    getProject: function (req, res) {
        // Get the project ID from the request parameters
        const projectId = req.params["id"];
        // Read the projects data from the file
        readFile(data => {
            // Check if the project exists
            if (data[projectId])
                res.send(data[projectId]);
            else res.sendStatus(400);
        }, true);
    },

    // READ
    getProjects: function (req, res) {
        // Read the projects data from the file
        readFile(data => {
            res.status(200).send(data);
        }, true);
    },

    // CREATE
    CreateProjects: async function (req, res) {
        try {
            // Validate the request body
            await projectSchema.validate(req.body, { abortEarly: false, strict: true});
            // Read the projects data from the file
            readFile(data => {
                // add the new project
                const projectId = generateProjectId(data);
                req.body.id = projectId;
                data[projectId] = req.body;
                // Write the data back to the file
                writeFile(JSON.stringify(data, null, 2), () => {
                    res.status(200).send({ id: projectId });
                });
            }, true);
            // Handle validation errors
        } catch (error) {
            res.status(400).json({ errors: error.errors });
        }
    },

    // UPDATE
    updateProjects: async function (req, res) {
        // Get the project ID from the request parameters
        const projectId = req.params["id"];
        try {
            //read the projects data from the file
            readFile(data => {
                // Check if the project exists
                if (data[projectId]) {
                    // Get the existing project data
                    const existingData = data[projectId];
                    const { id: existingId, ...dataWithoutId } = existingData;
                    const { id: bodyId, team, manager, images,...bodyWithoutIdTeamManagerImages } = req.body;
                    // Merge existing data with the request body
                    const mergedData = { ...dataWithoutId, ...bodyWithoutIdTeamManagerImages };
                    // Validate the merged data
                    projectSchema.validate(mergedData, { abortEarly: false, strict: true })
                        .then(() => {
                            // Update project data
                            data[projectId] = mergedData;
                            // Explicitly set 'id' to ensure it matches projectId
                            data[projectId].id = projectId;
                            // Write the updated data back to the file
                            writeFile(JSON.stringify(data, null, 2), () => {
                                res.status(200).send(`Project id:${projectId} updated.`);
                            });
                        })
                        // Handle validation errors
                        .catch(validationError => {
                            // Handle validation errors
                            res.status(400).json({ errors: validationError.errors });
                        });
                        // Project not found
                } else {
                    res.sendStatus(404); // Not Found
                }
            }, true);
            // Handle server errors
        } catch (error) {
            res.status(500).json({ errors: error.message }); // Internal Server Error
        }
    },

    // DELETE
    deleteProject: function (req, res) {
        // Read the projects data from the file
        readFile(data => {
            // Get the project ID from the request parameters
            const projectId = req.params["id"];
            // Check if the project exists
            if (data[projectId]) {
                // Remove the project
                delete data[projectId];
                // Write the data back to the file
                writeFile(JSON.stringify(data, null, 2), () => {
                    res.status(200).send(`Project id:${projectId} removed`);
                });
                // Project not found
            } else {
                res.sendStatus(404).send('Project not found');
            }
        }, true);
    },

    // ADD IMAGE
    AddImagesToProject: async function (req, res) {
        // Get the project ID from the request parameters
        const projectId = req.params["id"];
        try {
            // Validate the request body
            await imageSchema.validate(req.body, { abortEarly: false, strict: true});
            // Read the projects data from the file
            const image = req.body;
            // Add the new image to the project
            readFile(data => {
                // Check if the project exists
                if (data[projectId]) {
                    // Check if the project has an 'images' array
                    if (!data[projectId].images) {
                        data[projectId].images = [];
                    }
                    // Check if the image already exists in the project
                    const imageExists = data[projectId].images.find(img => img.id === image.id);
                    // Add the image if it doesn't exist
                    if (!imageExists) {
                        // Add the image to the project
                        data[projectId].images.push(image);
                        // Write the updated data back to the file
                        writeFile(JSON.stringify(data, null, 2), () => {
                            res.status(200).send({ id: image.id });
                        });
                        // Image already exists
                    } else {
                        res.status(409).send('Image already exists in the project');
                    }
                    // Project not found
                } else {
                    res.sendStatus(400).send('Project not found');
                }
            }, true);
            // Handle validation errors
        } catch (error) {
            res.status(400).json({ errors: error.errors });
        }
    },

    // DELETE IMAGE
    deleteImageFromProject: function (req, res) {
        // Get the project ID from the request parameters
        const projectId = req.params["id"];
        // Get the image ID from the request parameters
        const imageId = req.params["imageId"];
        // Read the projects data from the file
        readFile(data => {
            // Check if the project exists
            if (data[projectId]) {
                // Check if the project has an 'images' array
                const imageIndex = data[projectId].images.findIndex(img => img.id === imageId);
                // Remove the image if it exists
                if (imageIndex !== -1) {
                    // Remove the image from the project
                    data[projectId].images.splice(imageIndex, 1);
                    // Write the updated data back to the file
                    writeFile(JSON.stringify(data, null, 2), () => {
                        res.status(200).send(`Image with id ${imageId} removed`);
                    });
                    // Image not found
                } else {
                    res.status(404).send('Image not found');
                }
                // Project not found
            } else {
                res.sendStatus(400);
            }
        }, true);
    },


    //SEARCH IMAGE
    searchImage: async function(req, res) {
        const numberOfImages = 10; // Number of images to fetch
        const timestamp = new Date().getTime();
        const pageNum = Math.floor((timestamp % 10) + 1);
        const searchQuery = req.params["search"]; // Assuming the search query is passed as a query parameter
        const myId = 'R3WYXCxWwVM-y1sOirv4T7sm_93RrlLR2S-iYSXochg'; // Replace with your Unsplash Access Key
        const url = `https://api.unsplash.com/search/photos?query=${searchQuery}&client_id=${myId}&per_page=${numberOfImages}&page=${pageNum}`;
    
        try {
            // Fetch images from Unsplash API
            const response = await axios.get(url);
            const images = response.data.results.map(image => {
                return {
                    id: image.id,
                    thumb: image.urls.thumb,
                    description: image.alt_description 
                };
            });
            // Send the images in the response
            res.status(200).send({ results: images });
            // Handle errors
        } catch (error) {
            console.error('Error fetching images:', error);
            res.status(500).send('Error fetching images');
        }
    }
};