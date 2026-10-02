/* Values - definitions */
let pageLength;
let settingButtons;
let deleteBook;
let settingsToggle;
let allBooks;

/* Values - let */
let readToggle = document.querySelectorAll(".read-status");
let firstTime = true;
let filterToggle = document.querySelectorAll("#left .select");
let myLibrary = [];
let sortDirection = "desc";

/* Values - const */
const addButton = document.getElementById("new-bar");
const kindleScreen = document.getElementById("kindle");
const addModal = document.getElementById("add-modal");
const closeModal = document.getElementById("close");
const bookForm = document.getElementById("book-form");
const bookList = document.getElementById("container");
const flipSort = document.getElementById("flip-sort");
const sortType = document.querySelector("#right select");
const searchField = document.getElementById("searchfield");

/* Eventlisteners */
searchField.addEventListener("input",()=>{
    allBooks = document.querySelectorAll(".book");
    if(document.getElementById("no-books")){document.getElementById("no-books").remove();}
    let hiddenBooks = 0;
    myLibrary.forEach(element => {
        if(element.title.toUpperCase().includes(searchField.value.toUpperCase()) || element.author.toUpperCase().includes(searchField.value.toUpperCase())){
            document.getElementById(element.id).style.display = "flex";
        } else{
            document.getElementById(element.id).style.display = "none";
            hiddenBooks++;
        }
    });
    if(hiddenBooks == allBooks.length){
        let noBooks = document.createElement("h4");
        noBooks.innerText = "No books found";
        noBooks.id = "no-books"
        bookList.appendChild(noBooks);
    }
})

flipSort.addEventListener("click", ()=>{
    if(sortDirection == "desc"){
        sortDirection = "asc"
    } else{
        sortDirection = "desc";
    }
    sortList(sortDirection, sortType.value)
})

sortType.addEventListener("change", ()=>{
    sortList(sortDirection, sortType.value)
})

bookForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    let title = document.getElementById("form-title").value;
    let author = document.getElementById("form-author").value;
    let pages = document.getElementById("form-pages").value;
    let read = document.getElementById("form-read").checked;

    addToList(title, author, pages, read)
})

kindleScreen.addEventListener("click", ()=>{
    if(document.querySelectorAll(".settings-menu").length>0 && firstTime == false){
        document.querySelectorAll(".settings-menu")[0].remove();
        firstTime = true;
    }
    else{
        firstTime = false;
    }
})

addButton.addEventListener("click", ()=>{
    if(addModal.open == false){
        addModal.open = true;
    } else {
       addModal.open = false;
    }
})
closeModal.addEventListener("click", ()=>{
    addModal.open = false;
})

/* forEach's */
filterToggle.forEach((fT) =>{
    fT.addEventListener("click", ()=>{
        let showAll = true;
        if(fT.classList.contains("active") == false){
            for(let i = 0; filterToggle.length>i;i++){
                if(filterToggle[i].classList.contains("active") == true){
                    filterToggle[i].classList.remove("active");
                }
                else{
                    filterToggle[i].classList.add("active");
                    if(filterToggle[i].innerText == "Read"){
                        showAll = false;
                    }
                }
            }
        }
        
        allBooks = document.querySelectorAll(".book");
        for(let i = 0;allBooks.length>i;i++){
            if(!allBooks[i].querySelector(".read") && showAll == false){
                allBooks[i].style.display = "none";
            }
            else{
                allBooks[i].style.display = "flex";
            }
        }
        
    })
})

/* Functions */


function sortList(direction, sortBy){
let sortA;
let sortB;
    switch (sortBy) {
        case "recent":
            myLibrary.sort((a, b) => a.added - b.added);
            break;
        case "author":
            myLibrary.sort((a, b) =>{
                sortA = a.author.toUpperCase();
                sortB = b.author.toUpperCase();
                if(sortA < sortB){
                    return -1;
                }
                if(sortA > sortB){
                    return 1;
                }
                return 0;
            })
            break;
        case "title":
            myLibrary.sort((a, b) =>{
                sortA = a.title.toUpperCase();
                sortB = b.title.toUpperCase();
                if(sortA < sortB){
                    return -1;
                }
                if(sortA > sortB){
                    return 1;
                }
                return 0;
            })
            break;
        case "length":
            myLibrary.sort((a, b) => a.pages - b.pages);
            break;
    }
    if(direction == "asc"){
                myLibrary.reverse();
            }
    displayBooks();
}

function buttonClicks(){
readToggle = document.querySelectorAll(".read-status");
settingButtons = document.querySelectorAll(".settings-button");

readToggle.forEach((rT) =>{
    rT.addEventListener("click", ()=>{
        console.log()
        if(rT.src.search("assets/unread.png") == -1){
                rT.src = "assets/unread.png";
                rT.classList.remove("read");
                rT.parentElement.parentElement.querySelector(".card-read-badge").style.display = "none";
        }
        else{
            rT.src = "assets/read.png";
            rT.classList.add("read");
            rT.parentElement.parentElement.querySelector(".card-read-badge").style.display = "block";
        }
    })
});


settingButtons.forEach((e) =>{
    e.addEventListener("click", ()=>{
        firstTime = true;
        settingsMenu(e);
    });
})}



function settingsMenu(clickedButton){
    console.log(clickedButton)
    if(document.querySelectorAll(".settings-menu").length>0 && clickedButton.nextElementSibling == null){document.querySelectorAll(".settings-menu")[0].remove();}
        if(clickedButton.nextElementSibling == null){
            const settingsDiv = document.createElement("div");
            settingsDiv.className = "settings-menu";

            const toggleText = document.createElement("p");
            toggleText.className = "status-toggle";
            toggleText.innerText = "Read / Unread";

            const seperatorElement = document.createElement("hr");

            const deleteText = document.createElement("p");
            deleteText.className = "delete-button";
            deleteText.innerText = "DELETE";

            settingsDiv.appendChild(toggleText);
            settingsDiv.appendChild(seperatorElement);
            settingsDiv.appendChild(deleteText);
            clickedButton.parentElement.appendChild(settingsDiv);
            
            deleteBook = document.querySelector(".delete-button");
            settingsToggle = document.querySelector(".status-toggle");
        }
        else{
            clickedButton.nextElementSibling.remove();
        }
    deleteBook.addEventListener("click", ()=>{
        document.querySelector(".book:has(.delete-button)").remove();
        for(let i = 0;myLibrary.length>i;i++){
            if(myLibrary[i].id == clickedButton.parentElement.parentElement.id){
                myLibrary.splice(i,1)
            }
        }
        displayBooks();
    })
    settingsToggle.addEventListener("click", ()=>{
        document.querySelector(".book:has(.status-toggle) .read-status").click();
    })
}

function pageWidth(){
    pageLength = document.querySelectorAll(".card-pages");
    pageLength.forEach((element) => {
        if(parseInt(element.innerText)/10 < 30){
        element.style.width = 30+"%"; 
        }
        else if(parseInt(element.innerText)/10 > 80){
            element.style.width = 80+"%"; 
        }
        else{
            element.style.width = parseInt(element.innerText)/10+"%";
        }
    })
}

function Book(title, author, pages, read){
    this.title = title;
    this.author = author;
    this.pages = parseInt(pages);
    this.read = read;
    this.id = crypto.randomUUID();
    this.added = Date.now();
}

function addToList(title, author, pages, read){
    const newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
    closeModal.click();
    displayBooks();
}

function displayBooks(){
    bookList.innerHTML = "";
    myLibrary.forEach(book =>{
        let bookDiv = document.createElement("div");
        bookDiv.className = "book";
        bookDiv.id = book.id;
        let infoDiv = document.createElement("div");
        infoDiv.className = "info";
            let cardTitle = document.createElement("h2");
            cardTitle.className = "card-title";
            cardTitle.innerText = book.title;

            let cardAuthor = document.createElement("h3");
            cardAuthor.className = "card-author";
            cardAuthor.innerText = book.author;

            let cardReadBadge = document.createElement("div");
            cardReadBadge.className = "card-read-badge";
            cardReadBadge.innerText = "Read";
        
            let cardPages = document.createElement("div");
            cardPages.className = "card-pages";
                
                let cardBookLength = document.createElement("hr");
                
                let cardPageNumber = document.createElement("div");
                cardPageNumber.className = "number";
                cardPageNumber.innerText = book.pages;

                let pagesText = document.createElement("p");
                pagesText.innerText = "pages";
                
                cardPages.appendChild(cardBookLength);
                cardPages.appendChild(cardPageNumber);
                cardPages.appendChild(pagesText);

        infoDiv.appendChild(cardTitle);
        infoDiv.appendChild(cardAuthor);
        infoDiv.appendChild(cardReadBadge);
        infoDiv.appendChild(cardPages);
        
        let settingsContainer = document.createElement("div");
        settingsContainer.className = "settings-container";

            let readStatus = document.createElement("img");
            readStatus.className = "read-status";
            readStatus.src = "assets/unread.png"
            if(book.read == false){
                cardReadBadge.style.display = "none";
            }
            else{
                cardReadBadge.style.display = "block";
                readStatus.classList.add("read");
                readStatus.src = "assets/read.png";
            }

            let settingsImg = document.createElement("img");
            settingsImg.className = "settings-button";
            settingsImg.src = "assets/settings.png";

        settingsContainer.appendChild(readStatus);
        settingsContainer.appendChild(settingsImg);

        bookDiv.appendChild(infoDiv);
        bookDiv.appendChild(settingsContainer);

        bookList.appendChild(bookDiv);
    })
    pageWidth();
    buttonClicks();
}