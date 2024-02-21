//Inisialisasi Key Local Storage & Element input & Element button
const localStorageKey = "DATABUKU";

const Title = document.querySelector("#inputTitle");
const Writer = document.querySelector("#inputWriter");
const Year = document.querySelector("#inputYear");
const Readed = document.querySelector("#check_readed");
const btnAdd = document.querySelector("#bookSubmit");

const Search = document.querySelector("#inputSearch");
const btnSearch = document.querySelector("#searchSubmit");

//Event waktu loading page
window.addEventListener("load", function(){
    if (typeof (Storage) !== 'undefined'){
        if (localStorage.getItem(localStorageKey) === null) {
            localStorage.setItem(localStorageKey, '[]');
        }
    }
    if (localStorage.getItem(localStorageKey) !== "") {    
        const booksData = getBook();
        showBook(booksData);
    }
    window.scrollTo({
		top: 0,
		left: 0,
	});
});

//Event waktu tombol Add ditekan
btnAdd.addEventListener("click", function(){
    if (btnAdd.value == ""){
        if(Title.value == "" || Writer.value == "" || Year.value == ""){
            alert("Book's data is not complete, please check again")
        }
        else{
            const newBook = {
                id: +new Date(),
                title: Title.value.trim(),
                writer: Writer.value.trim(),
                year: Year.value,
                isCompleted: Readed.checked
            }
            addBook(newBook);

            Title.value = '';
            Writer.value = '';
            Year.value = '';
            Readed.checked = false;
        }
    }
});

//Fungsi menambah buku
function addBook(book) {
    let dataBuku = [];

    if (localStorage.getItem(localStorageKey) === "") {
        alert(`Failed to add book`);
        localStorage.setItem(localStorageKey, 0);
    }else{
        alert(`Successfully added books`);
        dataBuku = JSON.parse(localStorage.getItem(localStorageKey));
    }

    dataBuku.unshift(book);
    localStorage.setItem(localStorageKey,JSON.stringify(dataBuku));

    showBook(getBook());
}

//Fungsi menampilkan buku
function getBook() {
    return JSON.parse(localStorage.getItem(localStorageKey)) || [];
}
function showBook(books = []){
    const inCompleted = document.querySelector("#unread_book");
    const completed = document.querySelector("#readed_book");

    inCompleted.innerHTML = '';
    completed.innerHTML = '';

    books.forEach(book => {
        if (book.isCompleted == false) {
            let el = `
            <div class="unread_book">
                <p class="result_title">${book.title}</p>
                <p class="result_writer">${book.writer}</p>
                <p class="result_year">${book.year}</p>
                <div class="btn_sec">
                    <button class="blue_btn" onclick="editBook('${book.id}')">Edit</button>
                    <button class="green_btn" onclick="readedBook('${book.id}')">Readed</button>
                    <button class="red_btn" onclick="deleteBook('${book.id}')">Delete</button>
                </div>
            </div>
            `

            inCompleted.innerHTML += el;
        }
        else{
            let el = `
            <div class="readed_book">
                <p class="result_title">${book.title}</p>
                <p class="result_writer">${book.writer}</p>
                <p class="result_year">${book.year}</p>
                <div class="btn_sec">
                    <button class="blue_btn" onclick="editBook('${book.id}')">Edit</button>
                    <button class="yellow_btn" onclick="unreadBook('${book.id}')">Unread</button>
                    <button class="red_btn" onclick="deleteBook('${book.id}')">Delete</button>
                </div>
            </div>
            `
            completed.innerHTML += el;
        }
    });
}

//Fungsi menghapus buku
function deleteBook(id) {
    let fix_del = confirm("Are you sure to delete this book's data ?");

    if (fix_del == true) {
        const detailBook = getBook().filter(a => a.id == id);
        const bookData = getBook().filter(a => a.id != id);
        localStorage.setItem(localStorageKey,JSON.stringify(bookData));
        showBook(getBook());
        alert(`[${detailBook[0].title}] was removed`);
    }else{
        return 0;
    }
}

//Fungsi mengganti posisi buku
function readedBook(id) {
    let fix_ch = confirm("Want to move to Readed Book ?");

    if (fix_ch == true) {
        const detailBook = getBook().filter(a => a.id == id);
        const newBook = {
            id: detailBook[0].id,
            title: detailBook[0].title,
            writer: detailBook[0].writer,
            year: detailBook[0].year,
            isCompleted: true
        }

        const bookData = getBook().filter(a => a.id != id);
        localStorage.setItem(localStorageKey,JSON.stringify(bookData));

        addBook(newBook);
    }else{
        return 0;
    }
}

function unreadBook(id) {
    let fix_ch = confirm("Want to move to Unread Book ?")

    if (fix_ch == true) {
        const detailBook = getBook().filter(a => a.id == id);
        const newBook = {
            id: detailBook[0].id,
            title: detailBook[0].title,
            writer: detailBook[0].writer,
            year: detailBook[0].year,
            isCompleted: false
        }

        const bookData = getBook().filter(a => a.id != id);
        localStorage.setItem(localStorageKey,JSON.stringify(bookData));

        addBook(newBook);
    }else{
        return 0;
    }
}
function editBook(id){
    const detailBook = getBook().filter(a => a.id == id);

    let ed_title = prompt("Enter new title book", detailBook[0].title);
    let ed_writer = prompt("Enter new writer book", detailBook[0].writer);
    let ed_year = prompt("Enter new year book", detailBook[0].year);

    if(ed_title == '' || ed_title == null){
        ed_title = detailBook[0].title;
    }
    if(ed_writer == '' || ed_writer == null){
        ed_writer = detailBook[0].writer;
    }
    if(ed_year == '' || ed_year == null){
        ed_year = detailBook[0].year;
    }

    const newBook = {
        id: detailBook[0].id,
        title: ed_title,
        writer: ed_writer,
        year: ed_year,
        isCompleted: detailBook[0].isCompleted
    }

    const bookData = getBook().filter(a => a.id != id);
    localStorage.setItem(localStorageKey,JSON.stringify(bookData));

    addBook(newBook);
}

//Fungsi mencari buku (Harus title lengkap)
btnSearch.addEventListener("click",function(e) {
    e.preventDefault()
    if (localStorage.getItem(localStorageKey) == "") {    
        alert("No book available");
    }else{
        var getTitle = getBook().filter(a => a.title.toLowerCase() == Search.value.toLowerCase());
        if (getTitle != 0) {
            searchResult(getTitle);
        }else{
            alert(`No book data`);
        }
    }
})

function searchResult(books) {
    const searchResult = document.querySelector("#search_sec");

    searchResult.innerHTML = '';

    books.forEach(book => {
        let el = `
        <div class="result_search">
            <p class="result_title">${book.title}</p>
            <p class="result_writer">${book.writer}</p>
            <p class="result_year">${book.year}</p>
        </div>
        `
        searchResult.innerHTML += el;
    });
}

function tomain(){
    location.href = "#section1";
}