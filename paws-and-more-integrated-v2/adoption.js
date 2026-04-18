document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const petToAdopt = params.get('pet'); 

    const adoptForm = document.getElementById('adoptForm');
    const fNameInput = document.getElementById('fName');
    const emailInput = document.getElementById('Email');
    const pNameInput = document.getElementById('pName');
    const modal = document.getElementById('successModal');

    if (pNameInput && petToAdopt) {
        pNameInput.value = petToAdopt;
    }

    if (adoptForm) {
        adoptForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameError = document.getElementById('nameError');
            const emailError = document.getElementById('emailError');

           
            [nameError, emailError].forEach(el => el.style.display = 'none');
            [fNameInput, emailInput].forEach(el => el.classList.remove('input-error'));

            let isValid = true;

            
            if (/\d/.test(fNameInput.value)) {
                nameError.innerText = "Name cannot contain numbers.";
                nameError.style.display = 'block';
                fNameInput.classList.add('input-error');
                isValid = false;
            }

            
            const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
          if (!emailRegex.test(emailInput.value)) {
                emailError.innerText = "Please enter a valid email address.";
                emailError.style.display = 'block';
                emailInput.classList.add('input-error');
                isValid = false;
            }

            if (isValid) {
                if (modal) modal.style.display = 'flex';
            }
        });
    }

    
    const petName = params.get('name');
    const detailTitle = document.getElementById('petNameDisp');
    if (detailTitle) {
        fetch('pets.json')
            .then(response => response.json())
            .then(pets => {
                if (petName && pets[petName]) {
                    const data = pets[petName];
                    detailTitle.innerText = petName;
                    document.getElementById('petBreed').innerText = data.breed;
                    document.getElementById('petAge').innerText = data.age;
                    document.getElementById('petDesc').innerText = data.desc;

                    const breedRow = document.getElementById('breedRow');
                    const ageRow = document.getElementById('ageRow');
                    if (breedRow) breedRow.style.display = 'block';
                    if (ageRow) ageRow.style.display = 'block';

                    const adoptBtn = document.getElementById('adoptLink');
                    if (adoptBtn) {
                        adoptBtn.href = `adoption-form.html?pet=${petName}`;
                        adoptBtn.style.display = 'inline-block';
                    }
                }
            })
            .catch(err => console.error("Error loading pets.json:", err));
    }
});