  const noteContainer = document.querySelector('.note-container');
const addNoteButton = document.querySelector('.btn');
let notes = document.querySelectorAll('.input-box');

createbtn.addEventListener('click', () => {
    let inputBox = document.createElement('p');
    let img = document.createElement('img');

    inputBox.className = "input-box";
    inputBox.setAttribute('contenteditable', 'true');

    img.src = "images/delete.png";

    noteContainer.appendChild(inputBox).appendChild(img);
     
})