// Import Firebase SDKs
// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBd07XAWywntLyuLdjD5zGuUv5lYqYu4_0",
    authDomain: "codequest-b0f7b.firebaseapp.com",
    projectId: "codequest-b0f7b",
    storageBucket: "codequest-b0f7b.appspot.com",
    messagingSenderId: "1003717861438",
    appId: "1:1003717861438:web:b7dd3f2252aff7a09c316f",
    measurementId: "G-HNNK6EQ19S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Google Apps Script Web App URL
const GOOGLE_SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxlS87y5JSlNg9t8eXwF9erq9RerlkaA3NEFkVrRGqmSXNxnLof8VbVN0-PcRasA2Be/exec";

// Function to store registration data
async function registerUser(event) {
    event.preventDefault(); // Prevent form from reloading

    // Get input values
    const name = document.getElementById("name").value;
    const regNo = document.getElementById("regno").value;
    const section = document.getElementById("section").value;
    const department = document.getElementById("department").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message");

    // Check if all fields are filled
    if (!name || !regNo || !section || !department || !phone || !email) {
        message.innerText = "⚠ Please fill all the fields!";
        message.style.color = "red";
        return;
    }

    // Check total registrations
    const querySnapshot = await getDocs(collection(db, "registrations"));
    if (querySnapshot.size >= 120) {
        message.innerText = "🚫 Max responses reached! Registration is closed.";
        message.style.color = "red";
        return;
    }

    // Save data to Firestore
    try {
        await addDoc(collection(db, "registrations"), {
            name,
            regNo,
            section,
            department,
            phone,
            email,
            timestamp: new Date()
        });

        // Also send data to Google Sheets
        await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                regNo,
                section,
                department,
                phone,
                email
            })
        });

        message.innerText = "✅ Successfully registered for the event!";
        message.style.color = "green";

        document.getElementById("registration-form").reset(); // Clear form
    } catch (error) {
        console.error("Error adding document: ", error);
        message.innerText = "❌ Registration failed! Please try again.";
        message.style.color = "red";
    }
}

// Attach event listener to form
document.getElementById("registration-form").addEventListener("submit", registerUser);
