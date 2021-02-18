
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function cleanTables(db) {
    return db.raw(
        `TRUNCATE
            users,
            hikes,
            section_hikes,
            hikes_tracks,
            track_notes,
            track_attributes
            RESTART IDENTITY CASCADE`
    );
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }));
    return db
        .into('users')
        .insert(preppedUsers)
        .then(() => {
            console.log('users populated');
        });
}

function seedTracksForLoggedIn(db, users, tracks) {
    const protectedUsers = seedUsers(users);
    return db
        .into('users')
        .insert(protectedUsers)
        .then(() =>
            db
                .into('trail_tracks')
                .insert(tracks))
                .then(() => {
                    console.log('tracks for loggedin user populated');
                });
}

function seedTracksAttributes(db, users, tracks, attributes) {
    const protectedUsers = seedUsers(users);
    return db
        .into('users')
        .insert(protectedUsers)
        .then(() => {
            db
                .into('trail_tracks')
                .insert(tracks)
                .then(() => {
                    db
                        .into('track_attributes')
                        .insert(attributes)
                        .then(() => {
                            console.log('attributes populated');
                        });
                });
        });
}

function seedTracksNotes(db, users, tracks, notes) {
    const protectedUsers = seedUsers(users);
    return db
        .into('users')
        .insert(protectedUsers)
        .then(() => {
            db
                .into('trail_tracks')
                .insert(tracks)
                .then(() => {
                    db
                        .into('track_notes')
                        .insert(notes)
                        .then(() => {
                            console.log('notes populated');
                        });
                });
        });
}

function seedTracksAttNotes(db, users, tracks, attributes, notes) {
    const protectedUsers = seedUsers(users);
    return db
        .into('users')
        .insert(protectedUsers)
        .then(() => {
            db
                .into('trail_tracks')
                .insert(tracks)
                .then(() => {
                    db
                        .into('track_attributes')
                        .insert(attributes)
                        .then(() => {
                            db
                                .into('track_notes')
                                .insert(notes)
                                .then(() => {
                                    console.log('track attNotes populated');
                                });
                        });
                });
        });
}


function makeExpectedListTrack(track) {
    return ({
        id: track.id,
        name_eng: track.name_eng || '',
        alias: track.alias,
        name_san: track.name_san || '',
        benefits: track.benefits,
        track_type: track.track_type,
        track_level: track.track_level,
        img: track.img
    });
}

function makeExpectedFullTrack(track) {
    return ({
        id: track.id,
        name_eng: track.name_eng || '',
        alias: track.alias,
        name_san: track.name_san || '',
        benefits: track.benefits,
        track_type: track.track_type,
        track_level: track.track_level,
        img: track.img,
    });
}

function makeExpectedTrackAttributes(user, track, hikeId, attributes) {
    const attributesList = attributes.filter(att => att.track_id === track.id).map(att => att.attribute);

    return ({
        id: track.id,
        name_eng: track.name_eng || '',
        alias: track.alias,
        name_san: track.name_san || '',
        benefits: track.benefits,
        track_type: track.track_type,
        track_level: track.track_level,
        img: track.img,
        attributesList,
    });
}

function makeExpectedTrackNotes(user, track, hikeId, notes) {
    const trackNotes = notes.find(n => n.track_id == track.id);
    
    return ({
        id: track.id,
        name_eng: track.name_eng,
        alias: track.alias,
        name_san: track.name_san,
        benefits: track.benefits,
        track_type: track.track_type,
        track_level: track.track_level,
        img: track.img,
        notes: trackNotes.notes
    });
}

function makeExpectedTrackAttNotes(user, track, hikeId, attributes, notes) {
    const trackAtt = makeExpectedTrackAttributes(user, track, hikeId, attributes);
    const trackNote = makeExpectedTrackNotes(user, track, hikeId, notes);
    return ({
        ...trackAtt,
        notes: trackNote.notes,
    });
}


function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.username,
        algorithm: 'HS256'
    });
    return `Bearer ${token}`;
}

module.exports = {
    makeExpectedListTrack,
    makeExpectedFullTrack,
    makeExpectedTrackAttributes,
    makeExpectedTrackNotes,
    makeExpectedTrackAttNotes,
    cleanTables,
    makeAuthHeader,
};