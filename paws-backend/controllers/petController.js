const Pet = require('../models/Pet');

const getAllPets = async (req, res, next) => {
    try {
        const pets = await Pet.find({ isAvailable: true });
        res.render('adoption', { pets, title: 'Adopt a Pet' });
    } catch (err) {
        next(err);
    }
};

const getPetDetails = async (req, res, next) => {
    try {
        const pet = await Pet.findOne({ name: req.params.name });
        if (!pet) {
            return res.status(404).render('error', { message: 'Pet not found', status: 404 });
        }

        let breedInfo = null;

        if (pet.type === 'dog' || pet.type === 'cat') {
            try {
                const apiBase = pet.type === 'dog'
                    ? 'https://api.thedogapi.com/v1/breeds/search'
                    : 'https://api.thecatapi.com/v1/breeds/search';
                const url = `${apiBase}?q=${encodeURIComponent(pet.breed)}`;
                const response = await fetch(url);
                const data = await response.json();
                breedInfo = Array.isArray(data) && data.length > 0 ? data[0] : null;
            } catch (apiErr) {
                console.error('Breed API error:', apiErr.message);
                // breedInfo stays null — API outage must not break the page
            }
        }

        res.render('pet-details', { pet, breedInfo, title: pet.name });
    } catch (err) {
        next(err);
    }
};

module.exports = { getAllPets, getPetDetails };