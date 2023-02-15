const express = require('express');

const app = express();
const port = 3000;

app.use(express.json({ type: 'application/csp-report' }));

app.use('/report', (req, res, next) => {
    console.log(req.body);
    next();
});

app.listen(port, () => {
    console.log(`Express app listening on port ${port}`);
});
