import {db} from './firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

export const readEntries = async () => {
    const records = await getDocs(collection(db, "entries"));
    records.forEach((doc) => {
        console.log(doc.id)
        console.log(doc.data());
    });
} 
