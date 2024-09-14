import { collection, query, where, doc, getDocs, getDoc, orderBy, limit } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";
import { db, storage } from "./firebaseUtils.js"

export async function fetchProjects(docsLimit) {
    let q;
    if (docsLimit == 0)
    {
        q = query(collection(db, "projects"), where("featured", ">", 0), orderBy("featured", "asc"));
    }
    else
    {
        q = query(collection(db, "projects"), where("featured", ">", 0), orderBy("featured", "asc"), limit(docsLimit));
    }
    const querySnapshot = await getDocs(q);
    const projectsContainer = document.getElementById("projects-container");
    projectsContainer.innerHTML = '';
    querySnapshot.forEach((doc) => {
        displayProject(doc, docsLimit);
    });
}

export async function fetchProjectDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    const loadingSpinner = document.getElementById('loading-spinner');
    const projectContent = document.getElementById('project-details');
    const projectHero = document.getElementById('project-hero');
    if (projectId) {
        const projectDoc = doc(db, "projects", projectId);
        const projectSnapshot = await getDoc(projectDoc);

        if (projectSnapshot.exists()) {
            const projectData = projectSnapshot.data();
            document.getElementById('project-name').textContent = projectData.name;
            document.getElementById('project-description').textContent = projectData.description;
            document.getElementById('project-department').textContent = projectData.department;
            document.getElementById('project-value').textContent = projectData.value;
            document.getElementById('project-supervisor').textContent = projectData.supervisor;
            document.getElementById('project-percentage').textContent = `${projectData.percentage}%`;
            document.getElementById('project-location').textContent = `${projectData.location}`;
            document.getElementById('project-duration').textContent = `${projectData.startDate} - ${projectData.endDate}`;
            document.getElementById('project-banner').src = projectData.imageURL;
            await displayProjectImages(projectId);
            loadingSpinner.style.display = 'none';
            projectContent.style.display = 'block';
            projectHero.style.display = 'block';

        } else {
            window.location.href = '../';
        }
    } else {
        window.location.href = '../';
    }
}


function displayProject(doc, docsLimit) {
    const project = doc.data();
    const projectsContainer = document.getElementById("projects-container");

    const projectElement = document.createElement("div");

    const imageElement = document.createElement("img");
    imageElement.src = project.imageURL;
    imageElement.classList.add("img-fluid");
    imageElement.alt = project.name;

    const bodyElement = document.createElement("div");
    bodyElement.classList.add("custom-block-body");

    const titleElement = document.createElement("h5");
    titleElement.textContent = project.name;
    titleElement.classList.add("mb-3");

    const descriptionElement = document.createElement("p");
    descriptionElement.textContent = project.description;

    const buttonElement = document.createElement("a");
    if (window.location.pathname.includes("/projects/"))
    {
        buttonElement.href = `./details/?id=${doc.id}`;
    }
    else
    {
        buttonElement.href = `./projects/details/?id=${doc.id}`;
    }
    buttonElement.classList.add("custom-btn", "btn");
    buttonElement.textContent = "عرض المشروع";

    bodyElement.appendChild(titleElement);
    bodyElement.appendChild(descriptionElement);

    const blockElement = document.createElement("div");
    blockElement.classList.add("custom-block");
    blockElement.appendChild(bodyElement);
    blockElement.appendChild(buttonElement);

    const blockWrapElement = document.createElement("div");
    blockWrapElement.classList.add("custom-block-wrap");
    blockWrapElement.appendChild(imageElement);
    blockWrapElement.appendChild(blockElement);

    projectElement.appendChild(blockWrapElement);
    projectsContainer.appendChild(projectElement);
}

async function displayProjectImages(projectId) {
    const imagesContainer = document.getElementById('project-images');
    imagesContainer.innerHTML = '';

    const storageRef = ref(storage, `projects/${projectId}/`);
    try {
        const result = await listAll(storageRef);
        if (result.items.length > 0) {
            result.items.forEach(async (imageRef) => {
                const imageURL = await getDownloadURL(imageRef);
                const imgElement = document.createElement('img');
                imgElement.src = imageURL;
                imgElement.style.marginBottom = '20px';
                imgElement.alt = `Project ${projectId}`;
                imagesContainer.appendChild(imgElement);

            });
        } else {
            imagesContainer.textContent = "لا توجد صور متاحة.";
        }
    } catch (error) {
        imagesContainer.textContent = "حدث خطأ أثناء تحميل الصور.";
    }
}
