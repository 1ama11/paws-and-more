const notFound = (req, res, next) => {
    res.status(404).render('error', { message: `Page not found: ${req.originalUrl}`, status: 404, title: 'Not Found' });
};

const errorHandler = (err, req, res, next) => {
    console.error(err.message);
    res.status(500).render('error', { message: 'Something went wrong', status: 500, title: 'Error' });
};

module.exports = { notFound, errorHandler };