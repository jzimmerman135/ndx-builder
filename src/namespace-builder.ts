export default function setupNamespace() {
  const form = document.getElementById('ndx-namespace-builder')!;
  const addAuthor = document.getElementById('add-author-btn')!;
  addAuthor.addEventListener('click', () => {
    const fields = createAuthorFields();
    form.appendChild(fields);
  });
}

function createAuthorFields() {
  const div = document.createElement('div');
  const name = document.createElement('input');
  const contact = document.createElement('input');
  name.placeholder = "Name";
  contact.placeholder = "Email";
  name.name = "author-name";
  contact.name = "author-contact";
  div.appendChild(name);
  div.appendChild(contact);
  return div;
}
