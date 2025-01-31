// Initialize the form validation
document.addEventListener('DOMContentLoaded', function() {
    //global array to store selected images
    let selectedImages = [];
    //to get the project form
    const form = document.getElementById('project_form');
    //counter to keep track of team members
    let teamMemberCounter = 0;
    // Add a new team member
    document.getElementById('addTeamMemberButton').addEventListener('click', function () {
        // Increment the team member counter
        teamMemberCounter++;
        // Create a new team member div
        const teamMembersDiv = document.getElementById('teamList');
        // Get the index of the new team member
        const newMemberIndex = teamMembersDiv.children.length;
        // Create a new team member div
        const newMemberDiv = document.createElement('div');
        // Add the team member class to the new member div
        newMemberDiv.classList.add('team-member');
        // Set the inner HTML of the new member div
        newMemberDiv.innerHTML = `
            
            <br>
            <br>    
            <div id="name-group" class="form-group">
                <label for="teamMemberName">Team Member's Name ${teamMemberCounter}</label>
                <input type="text" class="form-control" name="team[${newMemberIndex}][name]" id="teamMemberName"
                    placeholder="Enter team Member Name" required>
                <!-- errors will go here -->
            </div>

            <!-- EMAIL -->
            <div id="email-group" class="form-group">
                <label for="teamMemberEmail">Team Member's Email ${teamMemberCounter}</label>
                <input type="email" class="form-control" name="team[${newMemberIndex}][email]" placeholder="team@gmail.com">
                <!-- errors will go here -->
            </div>

            <!-- Team Position -->
            <div id="name-group" class="form-group">
                <label for="teamMemberPosition">Team Member's Position ${teamMemberCounter}</label>
                <input type="text" class="form-control" name="team[${newMemberIndex}][role]" id="teamMemberPosition"
                    placeholder="Enter Position here">
                <!-- errors will go here -->
            </div>
        <br>    
        `;
        // Append the new member div to the team members div
        teamMembersDiv.appendChild(newMemberDiv);
    });

    // add image to the project
    $(document).ready(function() {
        // Add an image to the selected images array
        $(document).on('click', '.btn-add-image', function(event) {
            // Prevent default action if the button is within a form
            event.preventDefault();
            // Get the selected image data
            const selectedImage = {
                imageId: $(this).data('image-id'), 
                imagePath: $(this).data('path'),
                imageDescription: $(this).data('description') 
            };
            // Check if the image is already selected
            const imageExists = selectedImages.some(image => image.imageId === selectedImage.imageId);
            
            // Add the image if it doesn't exist
            if (!imageExists) {
                selectedImages.push(selectedImage);
                
            } else {
                alert("This Image is already exists");
            }
        });
    });

    // Submit the form
    form.addEventListener('submit', function() {
        // to check if the form is valid
        if(!$("#project_form").valid()){
            return;
        } 
        // Create the form data object
        const formData = {
            name: document.querySelector('[name="name"]').value,
            summary: document.querySelector('[name="summary"]').value,
            manager: {
                name: document.querySelector('[name*="[name]"]').value,
                email: document.querySelector('[name="manager[email]"]').value,
            },
            // Get the team members
            team :Array.from(document.querySelectorAll('.team-member')).map((member, index) => ({
                name: member.querySelector(`[name="team[${index}][name]"]`).value,
                email: member.querySelector(`[name="team[${index}][email]"]`).value,
                role: member.querySelector(`[name="team[${index}][role]"]`).value,
            })),
            // Get the selected images
            images: selectedImages.map(image => ({
                id: image.imageId,
                thumb: image.imagePath,
                description:image.imageDescription,
            })),
            // Get the start date
            start_date: new Date(document.querySelector('[name="start_date"]').value).getTime().toString(),
            };
        // Define the URL for the AJAX request
        const url = `http://localhost:3001/projects`;
        // Send the AJAX request
        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: function(response) {
                alert('Form submitted successfully');
                // Redirect to the list page
                window.location.href = 'http://localhost:3001/list';
            },
            error: function(error) {
                alert('Error submitting form:', error);
            }
        });
    });
});