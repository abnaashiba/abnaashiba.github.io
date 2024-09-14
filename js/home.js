import { addDoc, collection, doc, getDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { db } from "./firebaseUtils.js"


export async function initHome() {
    try {
        const docRef = doc(db, 'home', 'pSaDDznAMwdIzZ4KYxzX');
        const docSnap = await getDoc(docRef);
        const docData = docSnap.data();
        document.getElementById("header1_title").textContent = docData.header1_title;
        document.getElementById("header1_details").textContent = docData.header1_details;
        document.getElementById("header2_title").textContent = docData.header2_title;
        document.getElementById("header2_details").textContent = docData.header2_details;
        document.getElementById("header3_title").textContent = docData.header3_title;
        document.getElementById("header3_details").textContent = docData.header3_details;
        document.getElementById("header1_image").src = docData.header1_image;
        document.getElementById("header2_image").src = docData.header2_image;
        document.getElementById("header3_image").src = docData.header3_image;
        document.getElementById("about_image").src = docData.about_image;
        document.getElementById("icon1_details").textContent = docData.icon1_details;
        document.getElementById("icon2_details").textContent = docData.icon2_details;
        document.getElementById("icon3_details").textContent = docData.icon3_details;
        document.getElementById("icon4_details").textContent = docData.icon4_details;
        document.getElementById("about_details").textContent = docData.about_details;
        document.getElementById("projects_count").setAttribute('data-to', docData.projects_count);
        document.getElementById("engineers_count").setAttribute('data-to', docData.engineers_count);
        await loadContacts();
        document.getElementById('submit-message').addEventListener('click', submitMessage);
        document.getElementById('message-form').addEventListener('submit', function (event) {
            event.preventDefault();
        });
    } catch (error) {
        console.error("Error getting documents:", error);
    }
}

async function loadContacts() {
    const docRef = doc(db, 'contact', '7jh5bsI8A7Qa1nFzOnmz');
    const docSnap = await getDoc(docRef);
    const docData = docSnap.data();
    const contactsContainer = document.getElementById('contacts-container');
    const emailElement = document.createElement('p');
    emailElement.classList.add('d-flex', 'mb-2');
    emailElement.innerHTML = `
                        <i class="bi-envelope me-2" style="padding-left: 10px;"></i>
                        <a href="mailto:${docData.email}">${docData.email}</a>
                    `;
    contactsContainer.appendChild(emailElement);
    docData.address.forEach((address, index) => {
        const addressElement = document.createElement('p');
        addressElement.classList.add('d-flex', 'mb-2');
        addressElement.innerHTML = `
                        <i class="bi-geo-alt me-2" style="padding-left: 10px;"></i>
                        <a ${address.url ? "href='" + address.url + "'" : ""}>${address.text}</a>
                    `;
        contactsContainer.appendChild(addressElement);
    });
    docData.phone.forEach((phoneNumber) => {
        const phoneElement = document.createElement('p');
        phoneElement.classList.add('d-flex', 'mb-2');
        phoneElement.innerHTML = `
            <i class="bi-telephone me-2" style="padding-left: 10px;"></i>
            <a href="tel:${phoneNumber}" style="direction: ltr; display: inline-block;">${phoneNumber}</a>
        `;
        contactsContainer.appendChild(phoneElement);
    });
    if (docData.facebook) {
        const facebookElement = document.createElement('p');
        facebookElement.classList.add('d-flex', 'mb-2');
        facebookElement.innerHTML = `
                        <i class="bi-facebook me-2" style="padding-left: 10px;"></i>
                        <a href="${docData.facebook}" target="_blank">Facebook</a>
                    `;
        contactsContainer.appendChild(facebookElement);
    }
    if (docData.linkedin) {
        const linkedinElement = document.createElement('p');
        linkedinElement.classList.add('d-flex', 'mb-2');
        linkedinElement.innerHTML = `
                        <i class="bi-linkedin me-2" style="padding-left: 10px;"></i>
                        <a href="${docData.linkedin}" target="_blank">LinkedIn</a>
                    `;
        contactsContainer.appendChild(linkedinElement);
    }
}

async function submitMessage() {
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    if (!firstName || !lastName || !email || !message) {
        Swal.fire({
            icon: 'error',
            title: 'جميع الحقول مطلوبة',
            text: 'يرجى ملء جميع الحقول لإرسال رسالتك.'
        });
        return;
    }
    Swal.fire({
        title: 'جارٍ إرسال رسالتك...',
        text: 'يرجى الانتظار قليلاً',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    try {
        await addDoc(collection(db, 'messages'), {
            firstName: firstName,
            lastName: lastName,
            email: email,
            message: message,
            seen: false,
            timestamp: serverTimestamp()
        });
        Swal.fire({
            icon: 'success',
            title: 'تم إرسال رسالتك',
            text: 'شكراً لك، تم إرسال رسالتك بنجاح.'
        });
    } catch (error) {
        console.error('Error submitting message: ', error);
        Swal.fire({
            icon: 'error',
            title: 'حدث خطأ',
            text: 'حدث خطأ أثناء إرسال رسالتك، يرجى المحاولة مرة أخرى.'
        });
    }
}
