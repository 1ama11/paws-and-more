document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const petName = params.get('name'); // Used for details page
    const petToAdopt = params.get('pet'); // Used for form page

    // --- 1. ADOPTION FORM LOGIC ---
    const adoptForm = document.getElementById('adoptForm');
    const pNameInput = document.getElementById('pName');

    // If we are on the form page and have a pet name in the URL, fill the box
    if (pNameInput && petToAdopt) {
        pNameInput.value = petToAdopt;
    }

    // Handle the success modal on submit
    if (adoptForm) {
        adoptForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const modal = document.getElementById('successModal');
            if (modal) {
                modal.style.display = 'flex';
            }
        });
    }

    // --- 2. PET DETAILS LOGIC ---
    const detailTitle = document.getElementById('petNameDisp');

    // Only run this if we are actually on the details page
    if (detailTitle) {
        fetch('pets.json')
            .then(response => response.json())
            .then(pets => {
                if (petName && pets[petName]) {
                    const data = pets[petName];

                    // Fill the text content
                    detailTitle.innerText = petName;
                    document.getElementById('petBreed').innerText = data.breed;
                    document.getElementById('petAge').innerText = data.age;
                    document.getElementById('petDesc').innerText = data.desc;

                    // FIX: Make the hidden rows visible
                    const breedRow = document.getElementById('breedRow');
                    const ageRow = document.getElementById('ageRow');
                    if (breedRow) breedRow.style.display = 'block';
                    if (ageRow) ageRow.style.display = 'block';

                    // Setup the Adopt button
                    const adoptBtn = document.getElementById('adoptLink');
                    if (adoptBtn) {
                        adoptBtn.href = `adoption-form.html?pet=${petName}`;
                        adoptBtn.style.display = 'inline-block';
                    }
                } else {
                    console.error("Pet not found in JSON or URL parameter missing.");
                }
            })
            .catch(err => console.error("Error loading pets.json:", err));
    }
});
