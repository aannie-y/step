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
 * Adds a random greeting to the page.
 */
function addRandomGreeting() {
  const greetings =
      ['Hello world!', '¡Hola Mundo!', '你好，世界！', 'Bonjour le monde!'];

  // Pick a random greeting.
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  // Add it to the page.
  const greetingContainer = document.getElementById('greeting-container');
  greetingContainer.innerText = greeting;
}

// sticky navbar code from w3 schools
window.onscroll = function() {
  stickyNav()
};

// Get navbar
const navbar = document.getElementById('myTopNav');
// Get offset position of navbar
const sticky = navbar.offsetTop;

// Add sticky class to navbar when you reach its scroll position. Remove
// "sticky" when you leave scroll position
function stickyNav() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add('sticky');
  } else {
    navbar.classList.remove('sticky');
  }
}

function getMessage() {
  fetch('/data').then(response => response.text()).then((quote) => {
    document.getElementById('quote-container').innerText = quote;
  });
}
