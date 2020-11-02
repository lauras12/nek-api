
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function cleanTables(db) {
    return db.raw(
        `TRUNCATE
            trail_tracks,
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
        track_level: track.track_level,
    });
}

function makeExpectedFullTrack(track) {
    return ({
        id: track.id,
        track_level: track.track_level,
    });
}

function makeExpectedTrackAttributes(user, track, hikeId, attributes) {
    const trackAttributes = attributes.filter(att => att.author === user.id);
    const newerTrackAttributes = trackAttributes.filter(att => att.assigned_hike_id === hikeId);
    const newestTrackAttributes = newerTrackAttributes.filter(att => att.track_id === track.id);
    let attributesList = {};
    newestTrackAttributes.forEach(att => attributesList[att.attribute] = true);
    return ({
            id: track.id,
            track_level: track.track_level,
            attributesList: Object.keys(attributesList),
    });
}

function makeExpectedTrackNotes(user, track, hikeId, notes) {
    const trackNotes = notes.filter(n => n.author === user.id);
    const newerTrackNotes = trackNotes.filter(n => n.assigned_hike_id === hikeId);
    const newestTrackNotes = newerTrackNotes.filter(n => n.track_id === track.id);
    let notesList = {};
    newestTrackNotes.forEach(n => notesList[n.notes] = true);

    return ({
            id: track.id,
            track_level: track.track_level,
            notes: Object.keys(notesList)
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