'use strict';

/* @TODO: replace this with prod code */
function setAlbumImageTest() {
    var image = document.createElement("img");
    let imageParent = document.getElementById("album-image");

    image.id = "album-image";
    image.src = "https://i.scdn.co/image/ab67616d0000b27384ad36183dea63a65967a2a8";

    imageParent.appendChild(image);
}

/* Init functions */
setAlbumImageTest();