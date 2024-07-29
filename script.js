// Initialize Quill editor
var quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      ['image', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['clean'] 
    ]
  },
  placeholder: 'Start writing your novel...'
});