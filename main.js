// Initialize Quill editor
var quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline'],
            [{ 'align': [] }],
            ['link'],
            [{ 'color': [] }, { 'background': [] }]  // Add color and background options
        ]
    }
});

// Handle save button click
document.getElementById('save-btn').addEventListener('click', function() {
    // Get editor content as HTML
    var content = quill.root.innerHTML;

    // For demonstration, save content to localStorage
    localStorage.setItem('savedDocument', content);

    // Alternatively, send the content to a server
    /*
    fetch('/save-document', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: content })
    })
    .then(response => response.json())
    .then(data => {
        alert('Document saved successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
    });
    */

    alert('Document saved successfully!');
});


