const Application = require('../models/Application');
const Pet = require('../models/Pet');

const showForm = async (req, res, next) => {
    try {
        const petName = req.query.pet || '';
        res.render('adoption-form', { petName, title: 'Adoption Application', extraCss: ['adoption.css'] });
    } catch (err) {
        next(err);
    }
};

const submitForm = async (req, res, next) => {
    try {
        const { fullName, email, homeType, otherPets, petName, message } = req.body;

        // make sure required fields are filled
        if (!fullName || !email || !petName || !homeType) {
            return res.status(400).json({ error: 'Please fill in all required fields' });
        }

        // atomically claim the pet — returns null if already taken
        const pet = await Pet.findOneAndUpdate(
            { name: petName, isAvailable: true },
            { isAvailable: false },
            { new: false }
        );
        if (!pet) {
            return res.status(400).json({ error: 'This pet is no longer available' });
        }

        await Application.create({ fullName, email, homeType, hasOtherPets: otherPets === 'on' ? 'yes' : 'no', petName, message });

        res.status(201).json({ success: true });
    } catch (err) {
        next(err);
    }
};

module.exports = { showForm, submitForm };