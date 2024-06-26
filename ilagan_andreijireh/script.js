function validateInput() {
const inputField = document.getElementById("comment");
const nameField = document.getElementById("name");
const submitBtn = document.getElementById("submit_btn");

const isValid = (field) => !field.value.trim().length;

const enableSubmit = isValid(inputField) && isValid(nameField);
submitBtn.disabled = !enableSubmit;

submitBtn.classList.toggle('enabled', enableSubmit);
}

document.getElementById("comment").addEventListener('input', validateInput);
document.getElementById("name").addEventListener('input', validateInput);


//-- TESTING --
document.addEventListener("DOMContentLoaded", function () {
  let nameInput = document.getElementById("name");
  let commentTextarea = document.getElementById("textarea_for_comment");
  let commentButton = document.getElementById("comment");

  nameInput.addEventListener("input", checkFormValidity);
  commentTextarea.addEventListener("input", checkFormValidity);
  commentButton.addEventListener("click", addComment);
  console.log("test")
  loadComments();
});

let comments = [];

function checkFormValidity() {
  let nameValue = nameInput.value.trim();
  let commentValue = commentTextarea.value.trim();
  commentButton.disabled = !(nameValue && commentValue);
}

function addComment() {
  const nameInput = document.getElementById("name").value;
  const commentInput = document.getElementById("textarea_for_comment").value;
  nameInput.trim(); 
  commentInput.trim(); 
    const comment = {
      name: nameInput,
      text: commentInput,
      date: new Date().toISOString(),
    };
    console.log(comment)

    comments.push(comment);
    saveComments();
    displayComments();
    document.getElementById("name").value = "";
    document.getElementById("textarea_for_comment").value = "";
  
}

function displayComments() {
  const commentsSection = document.querySelector(".comments-of-team");
  commentsSection.innerHTML = "<h3>Comments</h3>";
  comments.forEach((comment) => {
    const commentDiv = document.createElement("div");
    commentDiv.classList.add("comment");
    const commentDate = new Date(comment.date).toLocaleString();
    commentDiv.innerHTML = `
              <p>Name: ${comment.name}</p>
              <p>Comment: ${comment.text}</p>
              <p class="comment-date">Date: ${commentDate}</p>
          `;
    commentsSection.appendChild(commentDiv);
  });
}

function searchCountry() {
  var countryName = document.getElementById('countryInput').value.trim();
  if (!countryName) {
    document.getElementById('countryDetails').innerHTML = '<p>Please enter a country name.</p>';
    document.getElementById('sameRegionCountries').innerHTML = '';
    return;
  }

  fetch('https://restcountries.com/v3.1/name/' + countryName)
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Country not found');
      }
      return response.json();
    })
    .then(function(countryData) {
      let country = countryData[0];
      let details = `
        <h2>Country Details - ${country.name.common}</h2>
        <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" width="100">
        <p><strong>Area:</strong> ${country.area ? country.area.toLocaleString() + ' square kilometers' : 'N/A'}</p>
        <p><strong>Languages:</strong> ${country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</p>
        <p><strong>Subregion:</strong> ${country.subregion ? country.subregion : 'N/A'}</p>
        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
        <p><strong>Timezones:</strong> ${country.timezones ? country.timezones.join(', ') : 'N/A'}</p>
`;
      document.getElementById('countryDetails').innerHTML = details;

      return fetch('https://restcountries.com/v3.1/region/' + country.region);
    })
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Region not found');
      }
      return response.json();
    })
    .then(function(regionData) {
      let region = regionData[0].region;
      let sameRegionCountriesList = regionData.map(function(c) {
        return `
          <div style="display: inline-block; margin: 10px; text-align: center;">
            <img src="${c.flags.svg}" alt="Flag of ${c.name.common}" width="50">
            <p>${c.name.common}</p>
          </div>
        `;
      }).join('');
      document.getElementById('sameRegionCountries').innerHTML = `
        <h2>Countries in the Same Region (${region})</h2>
        <div>${sameRegionCountriesList}</div>
      `;
    })
    .catch(function(error) {
      console.error('Error fetching data:', error);
      document.getElementById('countryDetails').innerHTML = '<p>An error occurred: ' + error.message + '</p>';
      document.getElementById('sameRegionCountries').innerHTML = '';
    });
}