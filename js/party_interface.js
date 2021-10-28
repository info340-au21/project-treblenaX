import * as fs from 'fs';



/* @TODO: TEST - Data Load */
function loadTestData() {
    var data = JSON.parse(fs.readFileSync("../json/test_data.json"));
    console.log(data);
}

/* Init Functions */
loadTestData();

// uploadImage();


/* JSON Data Extraction */
function uploadImage() {
    var img = new Image();
    img.src = test_data.tracks.items[0].images[0].url;
    album-image.appendChild(img);
}