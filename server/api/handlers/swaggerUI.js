const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const HttpStatus = require('http-status-codes');
const Error = require('../utils/error');


router.use(function(req, res, next) {
    if(req.path != "/" && !req.path.startsWith("/swagger-ui")) {
        res.redirect("/");
    } else {
        next();
    }
});

router.use(swaggerUi.serve);
router.get('/', swaggerUi.setup(require('../oas.json'), {customCss: '.swagger-ui .topbar { display: none }', customSiteTitle: "short-list UI"}));

module.exports = router;