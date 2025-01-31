$(document).ready(function() {
    //to load the projects and sort them by date
    async function loadProjectData() {
        try {
            const url = `http://localhost:3001/projects`;
            $.ajax({
                type: 'GET',
                url: url, 
                success: function(projects) {
                //Sort projects by date
                let response = Object.values(projects).sort((a, b) => b.start_date - a.start_date);
                let tableRows = '';
                // Populate the table with project data
                Object.values(response).forEach(project => {
                    tableRows +=`<tr>
                                    <td>${project.id}</td>
                                    <td>${project.name}</td>
                                    <td>${project.manager.name}</td>
                                    <td>${new Date(parseInt(project.start_date)).toLocaleDateString('en-GB')}</td>
                                    <td>${project.summary}</td>
                                     <td class="btn-e">
                                          <button class="btn btn-default btn-edit" data-id="${project.id}">Edit project</button>
                                          <button class="btn btn-danger btn-delete" data-id="${project.id}">Delete project</button>
                                          <button class="btn btn-primary btn-add-image" data-id="${project.id}">Add image </button>
                                          <button class="btn btn-default btn-show" data-id="${project.id}">Show image </button>
                                        </td>
                                </tr>`;
                                     
                    });
                    $('#projectTable tbody').html(tableRows);
                },
                // Handle error
                error: function(error) {
                    console.error('Error loading data:', error);
                }
            });
        // Handle error
        } catch (error) {
            console.error('Error loading data', error);
            alert('Error loading data');
        }
    }

    //Function to handle the delete of a project
     async function handleDelete(projectId) {
        if (confirm(`Are you sure you want to delete project ${projectId}?`)) {
            try {
                const response = await $.ajax({
                    type: 'DELETE',
                    url: `http://localhost:3001/projects/${projectId}`, // Corrected URL
                });
                // Reload data after deletion
                loadProjectData(); 
            } catch (error) {
                console.error(`Error deleting project ${projectId}:`, error);
            }
        }
    }

    //delete buttons
    $('#projectTable').on('click', '.btn-delete', function() {
        // Get the project ID from the button data attribute
        const projectId = $(this).data('id');
        // Call the function to handle the delete
        handleDelete(projectId);
    });
    
    //add image buttons
    var projectIdForRequest;
    $('#projectTable').on('click', '.btn-add-image', function() {
        // Get the project ID from the button data attribute
        var projectId = $(this).data('id');
        // Set the project ID in the hidden input field
        $('#imageSearchModal').modal('show');
        projectIdForRequest = projectId;
        $('#result').on('click', '.btn-add-image', function() {
            // Get the selected image data
            const selectedImage = {
                imageId: $(this).data('image-id'),
                imagePath: $(this).data('path'),
                imageDescription: $(this).data('description')
            };
            $.ajax({
                url: `http://localhost:3001/projects/${projectIdForRequest}`,
                type: 'GET',
                success: function(response) {
                    const images = response.images;
                    const imageExists = images.some(image => image.id === selectedImage.imageId);
                    if (!imageExists) {
                        $.ajax({
                            url: `http://localhost:3001/projects/${projectIdForRequest}/images`,
                            type: 'POST',
                            data: {
                                id: selectedImage.imageId,
                                thumb: selectedImage.imagePath,
                                description: selectedImage.imageDescription
                            },
                            // Handle success. For example, add the image to selectedImages array
                            success: function(response) {
                                alert('Image added successfully');
                                
                            },
                            // Handle error
                            error: function(error) {
                                alert('Error adding image: ' + error);
                            }
                        });
                    } else {
                        alert("This Image is already exists");
                    }
                },
                error: function(error) {
                    // Handle error
                    console.log('Error fetching project details: ' + error);
                }
            });
        });
    });

    //add image buttons
    $(document).on('click', '.btn-show', function() {
        // Get the project ID from the button data attribute
        const projectId = $(this).data('id');
        const url = `http://localhost:3001/projects/${projectId}`;
        //prefom ajax request to get the images of the project
        $.ajax({
            type: 'GET',
            url: url,
            success: function(project) {
                // Display the images in a modal
                if (project && project.images) {
                    let imagesHtml = '';

                    imagesHtml += `<div class="image-container" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px;">`;
                    project.images.forEach(image => {
                        imagesHtml += `
                        <div class="col-md-4 mb-2">
                        <div class="custom-card card">
                        <div class="image-${image.id}" style="text-align: center;">
                                       <img src="${image.thumb}" alt="${image.description}" class="card-img-top fixed-size" ">
                                       <br>
                                       <button class="btn btn-danger btn-delete-image" data-image-id="${image.id}" data-project-id="${projectId}">Delete</button>
                                   </div>
                                    </div>
                                     </div>
                                   
                                   `;
                    });
                    imagesHtml += `</div>`;
                    
                    //insert the images in the html
                    $('#imageModalBody').html(imagesHtml);
                    $('#imageModal').modal('show');
                }
            },
            // Handle error
            error: function(error) {
                console.error('Error fetching project images:', error);
            }
        });
    });

    //delete buttons
    $(document).on('click', '.btn-delete-image', function() {
        // Get the image ID from the button data attributes
        const imageId = $(this).data('image-id');
        // Get the project ID from the button data attribute
        const projectId = $(this).data('project-id');
        const url = `http://localhost:3001/projects/${projectId}/images/${imageId}`;

        //prefom ajax request to delete the image
        $.ajax({
            type: 'DELETE',
            url: url,
            success: function(response) {
                console.log('Image deleted successfully');
                // Remove the image and button from the DOM
                $(`button[data-image-id='${imageId}'][data-project-id='${projectId}']`).closest(`.image-${imageId}`).remove();
            },

            // Handle error
            error: function(error) {
                console.error('Error deleting image:', error);
            }
        });
    });

    //edit buttons
    $('#projectTable').on('click', '.btn-edit', function() {
        // Get the project ID from the button data attribute
        const projectId = $(this).data('id');
        //prefom ajax request to get the project details to edit
        $.ajax({
            type: 'GET',
            url: `http://localhost:3001/projects/${projectId}`,
            success: function(project) {
                // Populate the edit form with project details
                $('#editId').val(project.id);
                $('#editProjectName').val(project.name);
                $('#editProjectDescription').val(project.summary);
                $('#editStartDate').val(new Date(parseInt(project.start_date)).toISOString().split('T')[0]);
                $('#editManagerName').val(project.manager.name);
                $('#editManagerEmail').val(project.manager.email);

                // Show the edit form modal
                $('#editProjectModal').modal('show'); 
            },
            // Handle error
            error: function(error) {
                console.error('Error fetching project details:', error);
                alert('Error fetching project details');
            }
        });
    });

    //edit buttons submit
    $('#editProjectModal').on('submit', function(event) {
        event.preventDefault();
        // Get the project ID from the button data attribute
        const projectId = $('.btn-edit').data('id');
        // create the form data
        const formData = {
            name: document.querySelector('[name="name"]').value,
            summary: document.querySelector('[name="summary"]').value,
            manager: {
                name: document.querySelector('[name="manager[name]').value,
                email: document.querySelector('[name="manager[email]"]').value,
            },
            start_date: new Date(document.querySelector('[name="start_date"]').value).getTime().toString(),
        };
        // Submit updated project details
        //prefom ajax request to get the project details to edit
        $.ajax({
            type: 'PUT',
            url: `http://localhost:3001/projects/${projectId}`,
            data: formData,
            success: function(response) {
                console.log('Project updated successfully');
                // Reload table data after update
                loadProjectData();
                // Close modal or reset form as needed
                $('#editProjectModal').modal('hide');
            },
            error: function(error) {
                console.error('Error updating project:', error);
                alert('Error updating project');
            }
        });
    });
    // Call the function to load data
    loadProjectData();
});

//sort functions
var sortAscendingDate = true;
var sortAscendingProjectName = true;
var sortAscendingManagerName = true;

//sort function to sort the table by project name
function sortTableByProjectName() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("projectTable");
    switching = true;
    // Make a loop that will continue until no switching has been done:
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        // Loop through all table rows (except the first, which contains table headers):
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            // Get the two elements you want to compare, one from current row and one from the next:
            x = rows[i].getElementsByTagName("TD")[1]; // Assuming the Project Name is in the second column
            y = rows[i + 1].getElementsByTagName("TD")[1];
            // Check if the two rows should switch place:
            if (sortAscendingProjectName && (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase())) {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
            if (!sortAscendingProjectName && (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase())) {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            // If a switch has been marked, make the switch and mark that a switch has been done:
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
    sortAscendingProjectName = !sortAscendingProjectName;
}

//sort function to sort the table by date
function sortTableByDate() {
    var table, rows, switching, i, x, y, shouldSwitch, xDate, yDate;
    table = document.getElementById("projectTable");
    switching = true;
    // Make a loop that will continue until no switching has been done:
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        // Loop through all table rows (except the first, which contains table headers):
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            // Get the two elements you want to compare, one from current row and one from the next:
            x = rows[i].getElementsByTagName("TD")[3]; // Assuming the date is in the fourth column
            y = rows[i + 1].getElementsByTagName("TD")[3];
            // Convert the innerHTML of the TD elements to Date objects for comparison:
            xDate = new Date(x.innerHTML.split("/").reverse().join("/")); // Convert dd-mm-yyyy to yyyy-mm-dd for Date parsing
            yDate = new Date(y.innerHTML.split("/").reverse().join("/")); // Convert dd-mm-yyyy to yyyy-mm-dd for Date parsing
            // Check if the two rows should switch place, based on ascending or descending order:
            if (sortAscendingDate && xDate > yDate) {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
            if (!sortAscendingDate && xDate < yDate) {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            // If a switch has been marked, make the switch and mark that a switch has been done:
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
    sortAscendingDate = !sortAscendingDate; // Toggle the sorting order for the next call
}

//sort function to sort the table by manager name
function sortTableByManagerName() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("projectTable");
    switching = true;
    // Make a loop that will continue until no switching has been done:
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        // Loop through all table rows (except the first, which contains table headers):
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            // Get the two elements you want to compare, one from current row and one from the next:
            x = rows[i].getElementsByTagName("TD")[2]; // Assuming the Project Name is in the second column
            y = rows[i + 1].getElementsByTagName("TD")[2];
            // Check if the two rows should switch place:
            if (sortAscendingManagerName && (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase())) {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
            if (!sortAscendingManagerName && (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase())) {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            // If a switch has been marked, make the switch and mark that a switch has been done:
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
    sortAscendingManagerName = !sortAscendingManagerName;
}