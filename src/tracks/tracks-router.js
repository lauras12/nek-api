const express = require('express');
const tracksRouter = express.Router();
const TracksService = require('./tracks-service');
const { requireAuth } = require('../middleware/jwt-auth');
const jsonParser = express.json();
const path = require('path');
const xss = require('xss');
const STORE = require('../../STORE.js');

const serializeTrack = (track) => {
    return ({
        id: track.id,
        name_eng: xss(track.name_eng),
        alias: xss(track.alias),
        name_san: xss(track.name_san),
        benefits: xss(track.benefits),
        track_level: xss(track.track_level),
        track_type: xss(track.track_type),
        img: xss(track.img),
        video: track.video,
    });
}

const serializeAttTrack = (track) => {
    return ({
        id: track.id,
        name_eng: xss(track.name_eng),
        alias: xss(track.alias),
        name_san: xss(track.name_san),
        benefits: xss(track.benefits),
        track_level: xss(track.track_level),
        track_type: xss(track.track_type),
        img: xss(track.img),
        video: track.video,
        attributesList: track.attributesList.map(att => xss(att)),
        notes: track.notes.map(note => xss(note)),
    });
}

tracksRouter
    .route('/api/tracks')
    .get((req, res, next) => {
        
        //const knexInstance = req.app.get('db')
      //  TracksService.getAllTracks(knexInstance)
        //    .then(tracks => {
                res.status(200).json(STORE.tracks.map(serializeTrack));
         //   });
    });

tracksRouter
    .route('/api/hike/:track_id')
    .all(requireAuth)
    .all((req, res, next) => {
        const knexInstance = req.app.get('db');
        const trackId = req.params.track_id;
        TracksService.getTrackById(knexInstance, trackId)
            .then(track => {
                if (!track) {
                    return res.status(404).send({ error: { message: `Track with id ${trackId} doesn't exist` } });
                }
                res.track = track;
                next();
            })
            .catch(next);
    })
    .get((req, res, next) => {
        res.status(200).json(serializeTrack(res.track));
    });

tracksRouter
    .route('/api/hike/:hike_id/:track_id')
    .all(requireAuth)
    .all((req, res, next) => {
        const knexInstance = req.app.get('db');
        const trackId = Number(req.params.track_id);
        const hikeId = Number(req.params.hike_id);
        const track = STORE.tracks.find(t => t.id == trackId);
       // TracksService.getTrackById(knexInstance, trackId)
         //   .then(track => {
                if (!track) {
                    return res.status(404).send({ error: { message: `Track with id ${trackId} doesn't exist` } });
                }
                res.track = track;
                console.log(track);
                TracksService.getTrackAttNotesById(knexInstance, trackId, hikeId)
                    .then(attributes => {
                        console.log(attributes);
                        if (!attributes[0]) {
                            return res.status(200).json(serializeTrack(res.track));
                        } else {
                            let attributesList = {};
                            let notes = attributes[0].notes;

                            attributes.forEach(att => attributesList[att.attribute] = true);
                          //  attributes.forEach(att => notes[att.notes] = true);
                            
                            res.track = {
                                ...res.track,
                                attributesList: Object.keys(attributesList),
                                notes
                            };
                            return res.status(200).json(serializeTrack(res.track));
                        }
                    })
                    .catch(next);
           // });
    })
    .get((req, res, next) => {
        res.status(200).json(serializeAttTrack(res.trackAttributes));
    });

tracksRouter
    .route('/api/hikeatt/:track_id')
    .all(requireAuth)
    .post(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const author = req.user.id;
        const { assigned_hike_id, track_id, attribute } = req.body;
        for (const [key, value] of Object.entries(req.body)) {
            if (value === null) {
                return res.status(400).send({ error: { message: `Missing ${key}` } });
            }
        }

        Promise.all(attribute.map((att, index) => {
            const newAtt = {
                assigned_hike_id,
                author: author,
                track_id,
                attribute: att
            };
            return TracksService.insertTrackAttribute(knexInstance, newAtt)
                .then(saved => {
                    if (!saved) {
                        return res.status(500).send({ error: { message: `Error saving ${att} at ${index} to DB` } });
                    }
                    return saved;  
                });
        }))
        .then(saved => {
            res
                .status(201)
                .json(saved);
        })
        .catch(next);
    });

tracksRouter
    .route(('/api/hikenote/:track_id'))
    .all(requireAuth)
    .post(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const { assigned_hike_id, track_id, notes } = req.body;
        const author = req.user.id;
        const newNote = { assigned_hike_id, track_id, author, notes };
       
        for (const [key, value] in Object.entries(newNote)) {
            if (value === null) {
                return res.status(400).send({ error: { message: `Missing ${key}` } });
            }
        }
        TracksService.insertNote(knexInstance, newNote)
            .then(note => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${note.id}`))
                    .json(note);
            }).catch(next);
    });

module.exports = tracksRouter;
