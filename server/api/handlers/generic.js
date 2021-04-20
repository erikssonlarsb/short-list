const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const pluralize = require('pluralize');
const HttpStatus = require('http-status-codes');
const Error = require('../utils/error');

let Factory = null;

router.use(function(req, res, next) {
    let model = pluralize.singular(req.baseUrl);
    try {
        Factory = require('../../factories' + model + 'Factory');
    } catch (error) {
        return res.status(HttpStatus.StatusCodes.NOT_FOUND).json(new Error("No such model: " + model));
    }
    next();
});

router.use('/:id', function(req, res) {
    switch(req.method) {
        case 'GET':
            if(!Factory.findOne) {
                return res.status(HttpStatus.StatusCodes.NOT_IMPLEMENTED).json(new Error("Operation not supported"));
            } else {
                Factory.findOne({_id: req.params.id}, req.queryOptions, function(error, result) {
                    if(error) {
                        if(error instanceof mongoose.Error.CastError) {
                            // Query using invalid ObjectId causes exception
                            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json(new Error(error));
                        }
                        return res.status(HttpStatus.hasOwnProperty(error.code) ? error.code : 500).json(new Error(error));
                    } else {
                        return res.json(result);
                    }
                });
            }
            break;
        default:
            return res.status(HttpStatus.StatusCodes.NOT_IMPLEMENTED).json(new Error("Operation not supported"));
    }
});

router.use('/', function(req, res) {
    switch(req.method) {
        case 'GET':
            if(!Factory.query) {
                return res.status(HttpStatus.StatusCodes.NOT_IMPLEMENTED).json(new Error("Operation not supported"));
            } else {
                if(req.query.id !== undefined) {
                    // Rename query parameter 'id' to match the database model
                    req.query._id = req.query.id;
                    delete req.query.id;
                }
                Factory.query(req.query, req.queryOptions, function(error, result) {
                    if(error) {
                        if(error instanceof mongoose.Error.CastError) {
                            // Query using invalid ObjectId causes exception
                            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json(new Error(error));
                        }
                        return res.status(HttpStatus.hasOwnProperty(error.code) ? error.code : 500).json(new Error(error));
                    } else {
                        return res.json(result);
                    }
                });
            }
            break;
        default:
            return res.status(HttpStatus.StatusCodes.NOT_IMPLEMENTED).json(new Error("Operation not supported"));
    }
});

module.exports = router;