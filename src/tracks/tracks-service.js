const TracksService = {
    getAllTracks: (knex) => {
        return knex
            .from('trail_tracks AS ps').select(
                'ps.id',
                'ps.track_type',
                'ps.track_level',
            );
    },

    getTrackById: (knex, trackId) => {
        return knex
            .from('trail_tracks AS ps')
            .select(
                'ps.id',
                'ps.track_level',
                'ps.benefits',
            )
            .where(
                'ps.id',
                trackId
            )
            .first();
    },

    getTrackAttNotesById: (knex, trackId, hikeId) => {
        return knex
            .from('track_attributes AS ps_att')
            .select(
                'ps_att.attribute',
                'ps_att.track_id',
                'ps_att.assigned_hike_id',
                'ps_att.author',
                'pn.notes',
            )
            .join(
                'track_notes AS pn',
                'ps_att.track_id',
                'pn.track_id'
            )
            .where(
                {
                    'ps_att.assigned_hike_id': hikeId,
                    'ps_att.track_id': trackId,
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
