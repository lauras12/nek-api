const express = require('express');
const hikesRouter = express.Router();
const HikesService = require('./hikes-service');
const { requireAuth } = require('../middleware/jwt-auth');
const jsonParser = express.json();
const path = require('path');

hikesRouter
    .route('/api/hikes')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        HikesService.getAllUserHikess(knexInstance)
            .then(hikes => {
                res.json(hikes);
            })
            .catch(next);
    });

hikesRouter
    .route('/api/hikes/')
    .all(requireAuth)
    .post(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const newHike = {
            title: req.body.title,
            author: req.user.id,
        };
        
        for (const [key, value] of Object.entries(newHike)) {
            if (value === '') {
                return res.status(400).json({ error: { message: `Missing ${key}` } });
            }
        }

        HikesService.postNewFlow(knexInstance, newHike)
            .then(hike => {
                const currentHike = {
                    id: hike.id,
                    title: hike.title,
                    author: hike.author,
                    assignedTracks: [],
                };

                hike = currentHike;
               
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${hike.id}`))
                    .json(hike);
            }).catch(next);
    });

hikesRouter
    .route('/api/hike-track')
    .all(requireAuth)
    .post(jsonParser, (req, res, next) => {
        
        const knexInstance = req.app.get('db');
        const { main_hike_id, track_id, section_hike_id } = req.body;
        
        const newHikesTrack = {
            main_hike_id,
            author: req.user.id,
            track_id,
            section_hike_id
        };
        
        for (const [key, value] of Object.entries(newHikesTrack)) {
            if (value === null) {
                return res.status(400).send({ error: { message: `Missing ${key}` } });
            }
        }

        HikesService.insertTrackIntoHikes(knexInstance, newHikesTrack)
            .then(hikesTrack => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${hikesTrack.main_hike_id}`))
                    .json(hikesTrack);
            }).catch(next);
    });

hikesRouter
    .route('/api/hikes/:hike_id')
    .all(requireAuth)
    .all((req, res, next) => {
        const knexInstance = req.app.get('db');
        const hikeId = Number(req.params.hike_id);
        HikesService.getAllPosesInHike(knexInstance, hikeId)
            .then(hike => {
                if (!hike[0]) {
                    return res.status(400).send({ error: { message: `Hike with id ${hikeId} doesn't exist` } });
                }
               
                const currentHike = {
                    id: hike[0].id,
                    title: hike[0].title,
                    author: hike[0].author,
                    assignedTracks: [],
                };

                hike.map(hike => {
                    
                    if (hike.track_id === null) {
                        return currentHike;
                    }
                    currentHike[hike.section].push(hike.track_id);
                });
                
                res.hike = {
                    id: currentHike.id,
                    title: currentHike.title,
                    author: currentHike.author,
                    assignedTracks: [currentHike.warmUp, currentHike.midHike, currentHike.peakTrack, currentHike.breakTracks, currentHike.afterPeak],
                };

                next();
            })
            .catch(next);
    })
    .get((req, res, next) => {
        res.status(200).json(res.hike);
    });

    hikesRouter
.route('/api/delete/:hike_id/:track_id')
.all(requireAuth)
.delete((req,res,next) => {
    const knexInstance = req.app.get('db');
    const trackToRemove = req.params.track_id;
    const hikeToTarget = req.params.hike_id;
    HikesService.deleteTrackFromHike(knexInstance, trackToRemove, hikeToTarget)
        .then(() => {
            res.status(204).send('track deleted from hike');
        })
        .catch(next);
});

module.exports = hikesRouter;