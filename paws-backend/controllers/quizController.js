const Pet = require('../models/Pet');

// Score a single pet (0–5) against the user's quiz answers.
// Each question contributes at most 1 point.
function scorePet(pet, answers) {
    const type = (pet.type || '').toLowerCase();
    let score = 0;

    // Q1 — homeType: apartment / small / large
    // Dogs need space (large house w/ yard); other pets suit any home.
    if (type === 'dog') {
        if (answers.homeType === 'large') score++;
    } else {
        score++;
    }

    // Q2 — hoursHome: under4 / 4to8 / over8
    // Dogs need a lot of company; other pets are more independent.
    if (type === 'dog') {
        if (answers.hoursHome === 'over8') score++;
    } else {
        if (answers.hoursHome === 'under4' || answers.hoursHome === '4to8') score++;
    }

    // Q3 — energy: calm / balanced / active
    // Dogs match active preference; cats match calm or balanced;
    // rabbits and birds match calm only.
    if (type === 'dog') {
        if (answers.energy === 'active') score++;
    } else if (type === 'cat') {
        if (answers.energy === 'calm' || answers.energy === 'balanced') score++;
    } else {
        if (answers.energy === 'calm') score++;
    }

    // Q4 — hasKids: yes / no
    // Dogs and cats are reliably child-friendly.
    // Rabbits and birds require supervision around young children.
    if (answers.hasKids === 'yes') {
        if (type === 'dog' || type === 'cat') score++;
    } else {
        score++;
    }

    // Q5 — experience: first / some / experienced
    // Cats suit all experience levels (most forgiving).
    // Rabbits and birds need some handling know-how.
    // Dogs ideally need an experienced owner for training.
    if (type === 'dog') {
        if (answers.experience === 'experienced') score++;
    } else if (type === 'cat') {
        score++;
    } else {
        if (answers.experience === 'some' || answers.experience === 'experienced') score++;
    }

    return score;
}

// GET /adoption/quiz
const showQuiz = (req, res) => {
    res.render('quiz', { title: 'Pet Matching Quiz' });
};

// POST /adoption/quiz/results
const showResults = async (req, res, next) => {
    try {
        const { homeType, hoursHome, energy, hasKids, experience } = req.body;
        const answers = { homeType, hoursHome, energy, hasKids, experience };

        const pets = await Pet.find({ isAvailable: true });

        const matches = pets
            .map(pet => ({ pet, score: scorePet(pet, answers) }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(item => ({
                pet: item.pet,
                score: item.score,
                percentage: Math.round((item.score / 5) * 100)
            }));

        res.render('quiz-results', {
            title: 'Your Pet Matches',
            matches
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { showQuiz, showResults };
