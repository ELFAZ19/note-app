const noteContainer = document.querySelector('.note-container');
const createbtn = document.querySelector(".btn");
let notes = document.querySelectorAll('.input-box');

function updatestorage(){
    localStorage.setItem('notes',noteContainer.innerHTML);
}

createbtn.addEventListener('click', () => {
    let inputBox = document.createElement('p');
    let img = document.createElement('img');

    inputBox.className = "input-box";
    inputBox.setAttribute('contenteditable', 'true');

    img.src = "images/delete.png";

    noteContainer.appendChild(inputBox).appendChild(img);
     
})

noteContainer.addEventListener('click', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.parentElement.remove();
        updatestorage();
    } 
    else if (e.target.Name == "p"){
        notes.document.querySelectorAll(".input-box");
        notes.forEach(nt => {
            nt.onkeyup = function() {
                updatestorage();
            }
        })
    }
}  );