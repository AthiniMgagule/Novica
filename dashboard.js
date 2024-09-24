document.addEventListener("DOMContentLoaded", async function() {
    // Retrieve email from sessionStorage
    const email = sessionStorage.getItem('email');
    console.log('email: ' + email);

    if (email) {
        try {
            // Fetch user information from API
            const response = await fetch(`https://novicaapi.azurewebsites.net/user/` + email);

            if (!response.ok) {
                throw new Error('User not found');
            }

            const data = await response.json();

            // Display user information in the profile section
            document.getElementById('profile-email').textContent = data.email;
            document.getElementById('profile-name').textContent = data.username || 'User';

            // Store user ID in sessionStorage
            sessionStorage.setItem('userID', data.id);

            // Fetch and display novels
            await fetchAndDisplayNovels(data.id);

        } catch (error) {
            console.error('Error fetching user data:', error);
            alert('Error fetching user data.');
        }
    } else {
        alert('User email not found in session storage.');
    }

    // Profile panel functionality
    const profileIcon = document.getElementById('profile');
    const userPanel = document.getElementById('user-panel');
    const closePanelButton = document.getElementById('close-user-panel');

    profileIcon.addEventListener('click', () => {
        userPanel.classList.toggle('open');
    });

    closePanelButton.addEventListener('click', () => {
        userPanel.classList.remove('open');
    });

    window.addEventListener('click', (event) => {
        if (event.target !== profileIcon && !userPanel.contains(event.target)) {
            userPanel.classList.remove('open');
        }
    });

    // Check if the elements for creating a new book exist before initializing
    const bookModal = document.getElementById('create-book-modal');
    const openBookModalButton = document.getElementById('create-book-button');
    const closeBookButton = document.querySelector('#close-create-book-modal');
    const bookForm = document.getElementById('create-book-form');

    if (openBookModalButton && bookModal && closeBookButton && bookForm) {
        openBookModalButton.addEventListener('click', () => {
            bookModal.style.display = 'block';
        });

        closeBookButton.addEventListener('click', () => {
            bookModal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === bookModal) {
                bookModal.style.display = 'none';
            }
        });

        bookForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const title = document.getElementById('book-title').value;
            const genre = document.getElementById('book-genre').value;
            const summary = document.getElementById('book-summary').value;

            const userID = sessionStorage.getItem('userID');
            try {
                const response = await fetch('https://novicaapi.azurewebsites.net/novels', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userID,
                        title,
                        genre,
                        summary
                    }),
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Novel created with ID:', result.novelID);
                    bookModal.style.display = 'none'; // Close modal on success
                    bookForm.reset(); // Reset form fields
                } else {
                    console.error('Error creating novel:', response.statusText);
                }
            } catch (error) {
                console.error('Network error:', error);
            }
        });
    }

    await handleCharacterOperations();
    handleNoteOperations();
});

// Function to fetch and display novels
async function fetchAndDisplayNovels(userID) {
    try {
        const response = await fetch(`https://novicaapi.azurewebsites.net/novels/${userID}`);

        if (!response.ok) {
            throw new Error('Failed to fetch novels');
        }

        const novels = await response.json();

        // Clear existing novels if any
        const novelsContainer = document.getElementById('novels-container');
        novelsContainer.innerHTML = '';

        novels.forEach(novel => {
            const novelCard = document.createElement('div');
            novelCard.classList.add('novel-card');

            // Create a card with a "Start Writing" button
            novelCard.innerHTML = `
                <h2>${novel.Title}</h2>
                <p>${novel.Summary}</p>
            `;

            // Create a button for starting writing
            const startWritingButton = document.createElement('button');
            startWritingButton.classList.add('start-writing-button');
            startWritingButton.textContent = 'Start Writing';

            // Add click event listener to the button
            startWritingButton.addEventListener('click', () => {
                // Save the title to sessionStorage
                sessionStorage.setItem('title', novel.Title);
                
                // Redirect to editor page
                window.location.href = `editor.html?novelID=${novel.NovelID}`;
                sessionStorage.setItem('NovelID', novel.NovelID);

                console.log(novel.Title);
                console.log(novel.NovelID);
                
            });

            novelCard.appendChild(startWritingButton);
            novelsContainer.appendChild(novelCard);
        });

    } catch (error) {
        console.error('Error fetching or displaying novels:', error);
    }
}


// Function to handle all character-related operations
async function handleCharacterOperations() {
    // Modal elements for creating a new character
    const characterModal = document.getElementById('create-character-modal');
    const openCharacterModalButton = document.getElementById('create-character-button');
    const closeCharacterButton = document.querySelector('#close-create-character-modal');
    const characterForm = document.getElementById('create-character-form');

    // Event listener to open character modal
    openCharacterModalButton.addEventListener('click', () => {
        characterModal.style.display = 'block';
    });

    // Event listener to close character modal
    closeCharacterButton.addEventListener('click', () => {
        characterModal.style.display = 'none';
    });

    // Close modal on clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === characterModal) {
            characterModal.style.display = 'none';
        }
    });

    // Event listener for character form submission
    characterForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const role = document.getElementById('character-role').value;
        const description = document.getElementById('character-description').value;
         console.log("Creating character with Name: " + name + ", Role: " + role + ", Description: " + description);

        const NovelID = sessionStorage.getItem('NovelID');
        console.log("FinalNovelID: " + NovelID);

        await postCharacter(name, role, description, NovelID); // Call the createCharacter function
        characterModal.style.display = 'none'; // Close modal on success
        characterForm.reset(); // Reset form fields
    });
}

// Function to post a character
async function postCharacter(name, role, description, novelID) {
    console.log("Creating character with Name: " + name + ", Role: " + role + ", Description: " + description);

    try {
        const response = await fetch('https://novicaapi.azurewebsites.net/characters', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                novelID,
                name,
                description,
                role
            }),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('character created with ID:', result.CharacterID);
            characterModal.style.display = 'none'; // Close modal on success
            characterForm.reset(); // Reset form fields
        } else {
            console.error('Error creating character:', response.statusText);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}

function handleNoteOperations() {
    // Modal elements for creating a new note
    const noteModal = document.getElementById('create-note-modal');
    const openNoteModalButton = document.getElementById('create-note-button');
    const closeNoteButton = document.querySelector('#close-create-note-modal');
    const noteForm = document.getElementById('create-note-form');

    // Function to create a note
    async function createNote(title, content) {
        const userID = sessionStorage.getItem('userID');
        console.log("Creating note with Title: " + title + ", Content: " + content);

        try {
            const response = await fetch('https://novicaapi.azurewebsites.net/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userID,
                    title,
                    content
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Note created with ID:', result.noteID);
                return result.noteID; // Return the note ID if needed
            } else {
                console.error('Error creating note:', response.statusText);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    }

    // Event listener to open note modal
    openNoteModalButton.addEventListener('click', () => {
        noteModal.style.display = 'block';
    });

    // Event listener to close note modal
    closeNoteButton.addEventListener('click', () => {
        noteModal.style.display = 'none';
    });

    // Close modal on clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === noteModal) {
            noteModal.style.display = 'none';
        }
    });

    // Event listener for note form submission
    noteForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = document.getElementById('note-title').value;
        const content = document.getElementById('note-content').value;

        await createNote(title, content); // Call the createNote function
        noteModal.style.display = 'none'; // Close modal on success
        noteForm.reset(); // Reset form fields
    });
}

const novelID = sessionStorage.getItem('NovelID');
console.log(novelID);
let characters = {};

// Function to create a tab element
function createTab(name) {
    const tab = document.createElement('div');
    tab.classList.add('tab');
    tab.textContent = name;
    tab.onclick = () => {
        // Show the character details container when a tab is clicked
        document.getElementById('character-details-container').style.display = 'block';
        showCharacterDetails(name);
    };
    return tab;
}

// Function to show character details
function showCharacterDetails(name) {
    const tabs = document.querySelectorAll('#character-tabs .tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    const tabIndex = Object.keys(characters).indexOf(name) + 1;
    const tab = document.querySelector(`#character-tabs .tab:nth-child(${tabIndex})`);
    tab.classList.add('active');

    const detailsContainer = document.getElementById('character-details-container');

    const character = characters[name];
    if (character) {
        detailsContainer.innerHTML = `
            <form id="character-details-form">

                <label for="description"><strong>Description:</strong></label>
                <textarea id="description" name="description" rows="7">${character.Description || ''}</textarea><br>
                
                <label for="name"><strong>Name:</strong></label>
                <input type="text" id="name" name="name" value="${character.Name || ''}" readonly><br>
    
                <label for="role"><strong>Role:</strong></label>
                <input type="text" id="role" name="role" value="${character.Role || ''}"><br>
    
                <label for="transportation"><strong>Main Mode of Transportation:</strong></label>
                <input type="text" id="transportation" name="Main_mode_of_transportation" value="${character.Main_mode_of_transportation || ''}"><br>
    
                <label for="siblings"><strong>Siblings:</strong></label>
                <input type="text" id="siblings" name="Siblings" value="${character.Siblings || ''}"><br>
    
                <label for="nickname"><strong>Nickname:</strong></label>
                <input type="text" id="nickname" name="nickname" value="${character.nickname || ''}"><br>
    
                <label for="appearance"><strong>Appearance:</strong></label>
                <input type="text" id="appearance" name="Appearance" value="${character.Appearance || ''}"><br>
    
                <label for="parents"><strong>Parents:</strong></label>
                <input type="text" id="parents" name="Parents" value="${character.Parents || ''}"><br>
    
                <label for="significant_other"><strong>Significant Other:</strong></label>
                <input type="text" id="significant_other" name="Significant_other" value="${character.Significant_other || ''}"><br>
    
                <label for="gender"><strong>Gender:</strong></label>
                <input type="text" id="gender" name="Gender" value="${character.Gender || ''}"><br>
    
                <label for="nationality"><strong>Nationality:</strong></label>
                <input type="text" id="nationality" name="Nationality" value="${character.Nationality || ''}"><br>
    
                <label for="birth_date"><strong>Birth Date:</strong></label>
                <input type="date" id="birth_date" name="Birth_Date" value="${character.Birth_Date || ''}"><br>
    
                <label for="where_live"><strong>Where They Live:</strong></label>
                <input type="text" id="where_live" name="Where_they_live" value="${character.Where_they_live || ''}"><br>
    
                <label for="job_status"><strong>Job Status:</strong></label>
                <input type="text" id="job_status" name="Job_status" value="${character.Job_status || ''}"><br>
    
                <label for="biggest_fear"><strong>Biggest Fear:</strong></label>
                <input type="text" id="biggest_fear" name="Biggest_fear" value="${character.Biggest_fear || ''}"><br>
    
                <label for="iq"><strong>IQ:</strong></label>
                <input type="number" id="iq" name="IQ" value="${character.IQ || ''}"><br>
    
                <label for="eating_habits"><strong>Eating Habits:</strong></label>
                <input type="text" id="eating_habits" name="Eating_Habits" value="${character.Eating_Habits || ''}"><br>
    
                <label for="food_preferences"><strong>Food Preferences:</strong></label>
                <input type="text" id="food_preferences" name="Food_preferences" value="${character.Food_preferences || ''}"><br>
    
                <label for="music_preferences"><strong>Music Preferences:</strong></label>
                <input type="text" id="music_preferences" name="Music_preferences" value="${character.Music_preferences || ''}"><br>
    
                <label for="journal"><strong>Do They Keep a Journal:</strong></label>
                <select id="journal" name="Do_they_keep_a_journal">
                    <option value="Yes" ${character.Do_they_keep_a_journal === 'Yes' ? 'selected' : ''}>Yes</option>
                    <option value="No" ${character.Do_they_keep_a_journal === 'No' ? 'selected' : ''}>No</option>
                </select><br>
    
                <label for="what_excites_them"><strong>What Excites Them:</strong></label>
                <input type="text" id="what_excites_them" name="What_excites_them" value="${character.What_excites_them || ''}"><br>
    
                <label for="pet_peeves"><strong>Pet Peeves:</strong></label>
                <input type="text" id="pet_peeves" name="Pet_peeves" value="${character.Pet_peeves || ''}"><br>
    
                <label for="planned_spontaneous"><strong>Planned/Spontaneous:</strong></label>
                <input type="text" id="planned_spontaneous" name="Planned_spontaneous" value="${character.Planned_spontaneous || ''}"><br>
    
                <label for="leader_follower"><strong>Leader/Follower:</strong></label>
                <input type="text" id="leader_follower" name="Leader_follower" value="${character.Leader_follower || ''}"><br>
    
                <label for="group_alone"><strong>Group/Alone:</strong></label>
                <input type="text" id="group_alone" name="Group_alone" value="${character.Group_alone || ''}"><br>
    
                <label for="sexual_activity"><strong>Sexual Activity:</strong></label>
                <input type="text" id="sexual_activity" name="Sexual_activity" value="${character.Sexual_activity || ''}"><br>
    
                <label for="general_health"><strong>General Health:</strong></label>
                <input type="text" id="general_health" name="General_health" value="${character.General_health || ''}"><br>
    
                <label for="handwriting"><strong>Handwriting:</strong></label>
                <input type="text" id="handwriting" name="handwriting" value="${character.handwriting || ''}"><br>
    
                <label for="glove_compartment"><strong>Things in Glove Compartment:</strong></label>
                <input type="text" id="glove_compartment" name="Things_in_glove_compartment" value="${character.Things_in_glove_compartment || ''}"><br>
    
                <label for="backpack"><strong>Things Kept in Backpack:</strong></label>
                <input type="text" id="backpack" name="Things_kept_in_backpack" value="${character.Things_kept_in_backpack || ''}"><br>
    
                <label for="talents"><strong>Talents:</strong></label>
                <input type="text" id="talents" name="talents" value="${character.talents || ''}"><br>
    
                <label for="flaws"><strong>Flaws:</strong></label>
                <input type="text" id="flaws" name="flaws" value="${character.flaws || ''}"><br>
    
                <label for="halloween"><strong>Old Halloween Costumes:</strong></label>
                <input type="text" id="halloween" name="Old_Halloween_costumes" value="${character.Old_Halloween_costumes || ''}"><br>
    
                <label for="drugs_alcohol"><strong>Drugs/Alcohol:</strong></label>
                <input type="text" id="drugs_alcohol" name="Drugs_alcohol" value="${character.Drugs_alcohol || ''}"><br>
    
                <label for="passwords"><strong>Passwords:</strong></label>
                <input type="text" id="passwords" name="passwords" value="${character.passwords || ''}"><br>
    
                <label for="usernames_social"><strong>Usernames/Social Media:</strong></label>
                <input type="text" id="usernames_social" name="Usernames_social_media" value="${character.Usernames_social_media || ''}"><br>
    
                <label for="prized_possession"><strong>Prized Possession:</strong></label>
                <input type="text" id="prized_possession" name="Prized_possession" value="${character.Prized_possession || ''}"><br>
    
                <label for="special_places"><strong>Special Places:</strong></label>
                <input type="text" id="special_places" name="Special_places" value="${character.Special_places || ''}"><br>
    
                <label for="special_memories"><strong>Special Memories:</strong></label>
                <input type="text" id="special_memories" name="Special_memories" value="${character.Special_memories || ''}"><br>
    
                <label for="obsessions"><strong>Obsessions:</strong></label>
                <input type="text" id="obsessions" name="obsessions" value="${character.obsessions || ''}"><br>
    
                <label for="as_seen_self"><strong>As Seen by Self:</strong></label>
                <input type="text" id="as_seen_self" name="As_seen_by_self" value="${character.As_seen_by_self || ''}"><br>
    
                <label for="as_seen_others"><strong>As Seen by Others:</strong></label>
                <input type="text" id="as_seen_others" name="As_seen_by_others" value="${character.As_seen_by_others || ''}"><br>
    
                <label for="ambitions"><strong>Ambitions:</strong></label>
                <input type="text" id="ambitions" name="ambitions" value="${character.ambitions || ''}"><br>
    
                <label for="hobbies"><strong>Hobbies:</strong></label>
                <input type="text" id="hobbies" name="hobbies" value="${character.hobbies || ''}"><br>

                <button type="submit" id="submitButton">Save</button>
    
                <button type="button" id="close-character-details" class="close-button">&times;</button>
            </form>
        `;

        // Add event listener to handle form submission
        document.getElementById('character-details-form').addEventListener('submit', async (e) => {
            e.preventDefault();
        
            // Collect form data
            const formData = new FormData(e.target);
            const updatedCharacter = {};
        
            formData.forEach((value, key) => {
                if (value.trim() !== '' && key !== 'name') { // Only include fields with non-empty values
                    updatedCharacter[key] = value;
                }
            });
        
            // If no fields are provided, display an error
            if (Object.keys(updatedCharacter).length === 0) {
                alert('No fields to update.');
                return;
            }
        
            // Construct URL
            const url = `https://novicaapi.azurewebsites.net/characters/${novelID}/${name}`;
        
            try {
                // Send PUT request
                const response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedCharacter),
                });
        
                if (!response.ok) {
                    const responseText = await response.text(); // Get the error message from the response
                    console.error('Error response:', responseText);
                    throw new Error('Network response was not ok.');
                }
        
                alert('Character updated successfully!');
                // Optionally refresh or update the UI
        
            } catch (error) {
                console.error('Error updating character:', error);
                alert('Failed to update character.');
            }
        });
               
    } else {
        detailsContainer.innerHTML = `<p>No details available for ${name}</p>`;
    }
    
    document.getElementById('close-character-details').onclick = () => {
        detailsContainer.style.display = 'none';
    };
    document.getElementById('submitButton').onclick = () => {
        detailsContainer.style.display = 'none';
    };

}


// Fetch all characters
async function fetchAllCharacters() {
    const novelID = sessionStorage.getItem('NovelID');
    try {
        const response = await fetch(`https://novicaapi.azurewebsites.net/characters/` + novelID);
        if (!response.ok) {
            throw new Error('Characters not found');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching characters:', error);
        return [];
    }
}

// Populate tabs and character details
async function populateTabs() {
    const tabsContainer = document.getElementById('character-tabs');
    const charactersData = await fetchAllCharacters();

    characters = {}; // Initialize characters object

    charactersData.forEach(character => {
        characters[character.Name] = character;
        const tab = createTab(character.Name);
        tabsContainer.appendChild(tab);
    });

    // Show the first character's details by default
    if (Object.keys(characters).length > 0) {
        showCharacterDetails(Object.keys(characters)[0]);
    }
}


let quill;
document.addEventListener("DOMContentLoaded", () => {
    // Initialize Quill editor
    quill = new Quill('#editor', {
        modules: {
            toolbar: '#toolbar'
        },
        theme: 'snow'
    });

    // Save the editor content
    document.getElementById('save-button').addEventListener('click', async function() {
        const editorContent = quill.root.innerHTML;
        const novelID = sessionStorage.getItem('NovelID'); // Get selected chapter ID

        if (novelID) {
            await saveChapter(novelID, editorContent);
        }
    });

    populateTabs();
    // populateCharacterTable();
});

async function addChapter() {
    // Prompt the user for the chapter title
    const chapterTitle = prompt('Enter the chapter title:');
    if (!chapterTitle) {
        alert('Chapter title is required.');
        return;
    }

    const novelID = sessionStorage.getItem('NovelID'); 
    console.log("NovelID: " + novelID);

    const editorContent = quill.root.innerHTML;

    // Define the endpoint
    const endpoint = 'https://novicaapi.azurewebsites.net/chapters';

    try {
        // Post data to the endpoint
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                novelID: novelID,
                title: chapterTitle,
                content: editorContent,
            }),
        });

        // Check for errors
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the response
        const result = await response.json();
        console.log('Chapter added successfully:', result);

        // Optionally, you can notify the user or refresh the chapter list here
        alert('Chapter added successfully!');
    } catch (error) {
        console.error('Error adding chapter:', error);
        alert('Failed to add chapter. Please try again.');
    }
    document.getElementById('add-chapter-btn').addEventListener('click', addChapter);
}

let chaptersCache = []; // Variable to store fetched chapters

// Function to fetch and display chapters
async function displayChapters() {
    const novelID = sessionStorage.getItem('NovelID');

    try {
        const response = await fetch(`https://novicaapi.azurewebsites.net/chapters/${novelID}`);
        if (!response.ok) {
            throw new Error('Chapters not found');
        }

        chaptersCache = await response.json(); // Store the fetched chapters
        console.log(chaptersCache);
        const chapterList = document.getElementById('chapter-list');

        // Clear existing options
        chapterList.innerHTML = '';

        // Populate the dropdown or list with chapters
        chaptersCache.forEach(chapter => {
            const option = document.createElement('option');
            option.value = chapter.Title; // Use chapter title as the value
            option.textContent = chapter.Title;
            chapterList.appendChild(option);
            sessionStorage.setItem('ChapterID', chapter.ChapterID);
        });

        // Load the first chapter by default if available
        if (chaptersCache.length > 0) {
            loadChapterContent(chaptersCache[0].title); // Pass the title to loadChapterContent
        }

        // Add event listener to load the selected chapter
        chapterList.addEventListener('change', function() {
            loadChapterContent(this.value); // Pass the selected title to loadChapterContent
        });

    } catch (error) {
        console.error('Error fetching chapters:', error);
        alert('Failed to load chapters.');
    }
}

// Function to load chapter content into the editor
function loadChapterContent(chapterTitle) {
    try {
        // Find the chapter from the cached chapters
        const chapter = chaptersCache.find(ch => ch.Title === chapterTitle);
        
        if (!chapter) {
            throw new Error('Chapter not found in cache');
        }

        console.log(chapter); // Debugging: Print the chapter to the console
        quill.root.innerHTML = chapter.Content; // Load content into Quill editor

    } catch (error) {
        console.error('Error loading chapter content:', error);
        alert('Failed to load chapter content.');
    }
}

document.addEventListener("DOMContentLoaded", function(){
    displayChapters();
});

// Function to save edited chapter content
async function saveChapter(novelID, content) {
    try {
        novelID = sessionStorage.getItem('NovelID');
        chapterID = sessionStorage.getItem('ChapterID');
        console.log(novelID);
        console.log(chapterID);
        const response = await fetch(`https://novicaapi.azurewebsites.net/chapters/` + novelID, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content })
        });

        if (!response.ok) {
            throw new Error('Error saving chapter content');
        }

        alert('Chapter content saved successfully!');
    } catch (error) {
        console.error('Error saving chapter content:', error);
        alert('Failed to save chapter content.');
    }
}

