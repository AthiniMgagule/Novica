// Event listener for "Create New Book" button
document.getElementById('create-book-button').addEventListener('click', function() {
    // Show the input field and submit button for new book name
    document.getElementById('new-book-input').style.display = 'block';
});

// Event listener for submitting new book name
document.getElementById('submit-book-name').addEventListener('click', function() {
    const bookNameInput = document.getElementById('new-book-name');
    const bookName = bookNameInput.value.trim();
    if (bookName) {
        createBook(bookName);
        // Hide the input field after creating the book
        document.getElementById('new-book-input').style.display = 'none';
        // Clear the input field for next use
        bookNameInput.value = '';
    } else {
        alert('Please enter a valid book name.');
    }
});

// Function to create a new book item
function createBook(bookName) {
    const bookId = 'book-' + Date.now();
    const bookElement = document.createElement('li');
    bookElement.classList.add('book-item');
    bookElement.innerHTML = `
        <div class="book-item-name">${bookName}</div>
        <button class="create-document-button">+</button>
        <ul class="document-list" data-book-id="${bookId}"></ul>
    `;
    document.getElementById('book-list').appendChild(bookElement);

    // Event listener for creating documents
    bookElement.querySelector('.create-document-button').addEventListener('click', function() {
        // Show the input field for document name
        document.getElementById('document-input').style.display = 'block';

        // Handle document name submission
        document.getElementById('submit-document-name').addEventListener('click', function() {
            const documentNameInput = document.getElementById('document-name');
            const documentName = documentNameInput.value.trim();
            if (documentName) {
                createDocument(bookId, documentName);
                // Hide the input field after creating the document
                document.getElementById('document-input').style.display = 'none';
                // Clear the input field for next use
                documentNameInput.value = '';
            } else {
                alert('Please enter a valid document name.');
            }
        });
    });
}

// Function to create a new document item
function createDocument(bookId, documentName) {
    const documentId = 'doc-' + Date.now();
    const documentElement = document.createElement('li');
    documentElement.classList.add('document-item');

    const documentLink = document.createElement('a');
    documentLink.href = `main.html?doc=${documentId}`; // Adjust editor.html with your actual editor page
    documentLink.textContent = documentName;
    documentElement.appendChild(documentLink);

    const documentList = document.querySelector(`[data-book-id="${bookId}"]`);
    documentList.appendChild(documentElement);
}