"use strict";

const Router = require('express').Router();
const createContract = require('./createContract');

Router.route('/')
    /**
     * @swagger
     * /contract:
     *   post:
     *     tags:
     *       - Contract
     *     description: create contract.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: user
     *         in: body
     *         required: true
     *         schema:
     *           type: array
     *           items:
     *              schema: 
     *                  type: object
     *                  properties:
     *                      name: 
     *                          type: string
     *     responses:
     *       200:
     *         description: contract in json
     *         schema:
     *           type: object
     */
    .post((req, res, next) => {
        console.log(req.params);
        console.log(req.body);
        console.log(typeof req.body);
        if (!req.body || typeof req.body.length > 0)
            return res.sendStatus(400);
        createContract(req.body, (err, result) => {
            if (err) return res.sendStatus(400);
            return res.json(result);
        });
    });

module.exports = Router;








