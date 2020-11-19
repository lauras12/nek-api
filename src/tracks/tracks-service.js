const TracksService = {
    getAllTracks: (knex) => {
        return knex
            .from('trail_tracks AS tr').select(
                'tr.id',
                'tr.track_level',
            );
    },

    getTrackById: (knex, trackId) => {
        return knex
            .from('trail_tracks AS tr')
            .select(
                'tr.id',
                'tr.track_level',
            )
            .where(
                'tr.id',
                trackId
            )
            .first();
    },

    getTrackAttNotesById: (knex, trackId, hikeId) => {
        return knex
            .from('track_attributes AS tr_att')
            .select(
                'tr_att.attribute',
                'tr_att.track_id',
                'tr_att.assigned_hike_id',
                'tr_att.author',
                'pn.notes',
            )
            .join(
                'track_notes AS pn',
                'tr_att.track_id',
                'pn.track_id'
            )
            .where(
                {
                    'tr_att.assigned_hike_id': hikeId,
                    'tr_att.track_id': trackId,
                }
            );
    },

    insertTrackAttribute: (knex, newAttribute) => {
        return knex
            .insert(newAttribute)
            .into('track_attributes')
            .returning('*')
            .then(rows => {
                return rows[0];
            });
    },

    insertNote: (knex, newNote) => {
        return knex
            .insert(newNote)
            .into('track_notes')
            .returning('*')
            .then(rows => {
                return rows[0];
            });
    },
};

module.exports = TracksService;
