$(document).ready(function() {
    // Add image to the project
    $('#searchButton').click(function() {
        let searchQuery = $('#searchInput').val().trim();
        // Check if search query is empty
        if (searchQuery === '') {
            return;
        }
        // Fetch images from the server
        const url = `http://localhost:3001/projects/searchImages/${searchQuery}`;
        // Make an AJAX request
        $.ajax({
            url: url,
            method: 'GET',
            success: function(data) {
                displaySearchResults(data.results);
            },
            error: function(error) {
                console.error('Error fetching images:', error);
            }
        });
    });

    //to display the search results
    function displaySearchResults(images) {
        $('#result').empty(); 
        // Check if no images are found
        if (images.length === 0) {
            $('#result').append('<p>No images found</p>');
            return;
        }
        // Display each image in a card
        $.each(images, function(index, image) {
            let imageElement = `
            <div class="col-md-4 mb-2">
              <div class="custom-card card">
                  <img src="${image.thumb}" class="card-img-top fixed-size" alt="${image.description}">
                  <div class="card-body">
                      <p class="card-title">${image.description}</p>
                       <button class="btn btn-primary btn-add-image" data-image-id="${image.id}" data-path="${image.thumb}" data-description="${image.description}">Add Image</button>
                  </div>
              </div> 
              </div>   
              `;
              
              $('#result').append(imageElement);
          });
    }
});