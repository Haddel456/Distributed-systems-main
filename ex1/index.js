const searchInput = document.getElementById('searchInput');
const result = document.getElementById('result');
const nextBtn = document.getElementById('Next-bto');
let pageNum = 0;
let currentImageName = ''; 

searchInput.addEventListener('input' , function (){
    const imageName = searchInput.value;
    currentImageName = imageName;
    pageNum = 1;
    if (imageName.length >=3 ){
        sendRequest(imageName);
    
    }
    else{
        result.innerHTML = ''; 
        nextBtn.style.display = 'none';
    }

    return;
});
 

nextBtn.addEventListener('click', function (){
    pageNum++;
    sendRequest(currentImageName);

});




function sendRequest(imageName){
    const myId = 'R3WYXCxWwVM-y1sOirv4T7sm_93RrlLR2S-iYSXochg';
    const url = `https://api.unsplash.com/search/photos?query=${imageName}&client_id=${myId}&per_page=20&page=${pageNum}`;

    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        timeout : '5000',

        success: function(data) {
            showImage(data.results);
            
            
            if ( pageNum < data.total_pages ){
                nextBtn.style.display = 'block';
            } else{
                nextBtn.style.display = 'none';
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching images:', error);
        }
    });
}



function showImage(images) {
    result.innerHTML = '';  // Clear the previous results
    if (images.length === 0) {  // Check if the images array is empty
        result.innerHTML = '<p>No images found.</p>';  
        nextBtn.style.display = 'none';  
    } else {
        images.forEach(image => {
            const imgElement = document.createElement('img');
            const divElement = document.createElement('div');
            const infoElement = document.createElement('div');
            infoElement.className = 'info-container';

            imgElement.src = image.urls.thumb;
            imgElement.alt = image.alt_description;
            imgElement.title = `Titel: ${image.description}\nLiles: ${image.likes}` ;
          
            infoElement.style.display = 'none';
            infoElement.innerHTML = `
            <p>Title:  ${image.description}</p>
            <img src="${image.urls.small}" />  
            <p>Description: ${image.alt_description}</p>
            <p>Likes: ${image.likes}</p>
        `;
          
            imgElement.addEventListener('click', function() {
                infoElement.style.display = infoElement.style.display === 'none' ? 'block' : 'none';
                
            });
          
            divElement.appendChild(imgElement);
            divElement.appendChild(infoElement);
            result.appendChild(divElement);
        });
    }
}
