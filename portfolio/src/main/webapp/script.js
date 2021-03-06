// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Adds a random fact to the page.
 */
function addRandomFact() {
  const facts = [
    'My childhood dream job was to be a police officer!',
    'I am a huge fan of the Marvel universe!',
    'My favourite superhero is Iron Man!', 'I do Taekwondo',
    'I love playing tennis', 'I recently started to learn tricking!'
  ];

  // Pick a random fact.
  const fact = facts[Math.floor(Math.random() * facts.length)];

  // Add it to the page.
  const factContainer = document.getElementById('fact-container');
  factContainer.innerText = fact;
}

document.addEventListener('DOMContentLoaded', function() {
  window.addEventListener('scroll', stickyNav);
  // Get navbar.
  const navbar = document.getElementById('myTopNav');
  // Get offset position of navbar.
  const sticky = navbar.offsetTop;

  // Add sticky class to navbar when you reach its scroll position.
  // Remove "sticky" when you leave scroll position.
  function stickyNav() {
    if (window.pageYOffset >= sticky) {
      navbar.classList.add('sticky');
    } else {
      navbar.classList.remove('sticky');
    }
  }
})
/**
 * Fetches comments from the server and adds them to the DOM.
 */
function loadComments() {
  fetch('/comment').then(response => response.json()).then((comments) => {
    const commentListElement = document.getElementById('comment-list');
    comments.forEach((comment) => {
      commentListElement.appendChild(createCommentElement(comment));
    })
  });
}

function createCommentElement(comment) {
  const commentElement = document.createElement('li');
  commentElement.className = 'comment';

  const titleElement = document.createElement('span');
  titleElement.innerText = comment.content;
  commentElement.appendChild(titleElement);

  const deleteButtonElement = document.createElement('button');
  deleteButtonElement.innerText = 'Delete';
  deleteButtonElement.addEventListener('click', () => {
    deleteComment(comment);
    commentElement.remove();
  });

  if (comment.imageUrl != null) {
    const imgElement = document.createElement('img');
    imgElement.src = comment.imageUrl;
    commentElement.appendChild(imgElement);
  }

  commentElement.appendChild(deleteButtonElement);
  return commentElement;
}

function deleteComment(comment) {
  const params = new URLSearchParams();
  params.append('id', comment.id);
  fetch('/delete-data', {method: 'POST', body: params});
}

/** Make a GET request to /blobstore-url */
function fetchBlobstoreUrlAndShowForm() {
  fetch('/blobstore-url')
      .then((response) => {
        return response.text();
      })
      .then((imageUploadUrl) => {
        const messageForm = document.getElementById('comment-form');
        messageForm.action = imageUploadUrl;
        messageForm.classList.remove('hidden');
      });
}

/** Map of Sydney CBD. */
function createMap() {
  const sydneyMap = new google.maps.Map(
      document.getElementById('map'),
      {center: {lat: -33.865, lng: 151.209}, zoom: 14});

  const ichibanMarker = new google.maps.Marker({
      position: {lat: -33.87220, lng: 151.20723},
      map: map,
      title: 'Ichi-ban Boshi (Japanese)'
  });

  const donDonMarker = new google.maps.Marker({
      position: {lat: -33.87600, lng: 151.20644},
      map: map,
      title: 'Don don (Korean)'
  });

  const masuyaMarker = new google.maps.Marker({
      position: {lat: -33.86508, lng: 151.20987},
      map: map,
      title: 'Masuya (Japanese)'
  });

  const malatangMarker = new google.maps.Marker({
      position: {lat: -33.87619, lng: 151.20446},
      map: map,
      title: 'Malatang (Chinese)'
  });

  const vapianoMarker = new google.maps.Marker({
      position: {lat: -33.86866, lng: 151.20596},
      map: map,
      title: 'Vapiano (Italian)'
  });

  const kfcMarker = new google.maps.Marker({
      position: {lat: -33.87462, lng: 151.20707},
      map: map,
      title: 'KFC'
  });
}
