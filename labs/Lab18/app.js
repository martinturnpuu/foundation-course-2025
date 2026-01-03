import {logout} from './auth.js';
import { readEntries } from './firestore.js';

const logoutBtn = document.querySelector("#logout");
const messageDiv = document.getElementById("message");

logoutBtn.addEventListener('click', async ()=> {
    try {
        await logout();
        window.location.href = "index.html";
    }
    catch (error) {
        console.error("Logout failed", error);
        messageDiv.textContent = "Logout failed: " + error.message;
    }
})

const results = await readEntries();

/*
function updateEntriesList(entries) {
    console.log("Updating entries list with entries:", entries);
    const entriesList = document.getElementById("entriesList");
    const noEntriesMsg = document.getElementById("noEntriesMsg");

    entriesList.innerHTML = ""; // Clear existing

    if (!entries || entries.length === 0) {
        noEntriesMsg.style.display = "block";
        return;
    }

    noEntriesMsg.style.display = "none";

    entries.forEach(entry => {
        const li = document.createElement("li");
        li.dataset.id = entry.id;

        li.innerHTML = `
            <div class="entry-title">${entry.title || '(Untitled)'}</div>
            <div class="entry-date">${entry.createdAt ? new Date(entry.createdAt.seconds * 1000).toLocaleDateString() : '-'}</div>
            <div class="entry-actions">
                <button class="editEntryBtn">Edit</button>
                <button class="deleteEntryBtn">Delete</button>
            </div>
        `;

        entriesList.appendChild(li);
    });
}
*/