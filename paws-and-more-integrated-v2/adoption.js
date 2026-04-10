document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const petName = params.get('name'); // For Details Page
    const petToAdopt = params.get('pet'); // For Form Page

    // --- FORM LOGIC (Moved outside fetch so it's faster) ---
    const adoptForm = document.getElementById('adoptForm');
    const pNameInput = document.getElementById('pName');

    if (pNameInput && petToAdopt) {
        pNameInput.value = petToAdopt;
        console.log("Found pet name in URL:", petToAdopt); // Check your console (F12)
    }

    if (adoptForm) {
        adoptForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const modal = document.getElementById('successModal');
            if (modal) {
                modal.style.display = 'flex';
            }
        });
    }

    // --- DATA FETCH (Only for the Details page) ---
    fetch('pets.json')
        .then(response => response.json())
        .then(pets => {
            const detailTitle = document.getElementById('petNameDisp');
            
            if (detailTitle && petName && pets[petName]) {
                const data = pets[petName];
                detailTitle.innerText = petName;
                document.getElementById('petBreed').innerText = data.breed;
                document.getElementById('petAge').innerText = data.age;
                document.getElementById('petDesc').innerText = data.desc;
                

                const adoptBtn = document.getElementById('adoptLink');
                if (adoptBtn) {
                    adoptBtn.href = `adoption-form.html?pet=${petName}`;
                    adoptBtn.style.display = 'inline-block';
                }
            }
        })
        .catch(err => console.error("JSON Load Error:", err));
});