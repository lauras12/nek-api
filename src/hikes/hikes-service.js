const HikesService = {
    getAllUserHikes: (knex) => {
        return knex
            .from('hikes AS fl')
            .select(
                'fl.id',
                'fl.title',
                'fl.author')
            .join(
                'users AS usr',
                'fl.author',
                'usr.id'
            );
    },

    postNewHike : (db, newHike) => {
        return db
            .insert(newHike).into('hikes').returning('*')
            .then(rows => rows[0]);
    },

    insertTrackIntoHikes: (knex, hikesTrack) => {
        return knex
            .insert(hikesTrack).into('hikes_tracks').returning('*')
            .then(rows => {
                return rows[0];
            });
    },

    getAllTracksInHike: (knex, hikeId) => {
        return knex
            .from('hikes AS fl')
            .select(
                'fl.title',
                'fl.id',
                'fl_ps.main_hike_id',
                'fl_ps.author',
                'fl_ps.track_id',
                'fl_ps.section_hike_id',
                'sfl.section',
            )
            .leftJoin(
                'hikes_tracks AS fl_ps',
                'fl.id',
                'fl_ps.main_hike_id')
            .leftJoin(
                'section_hikes AS sfl',
                'fl_ps.section_hike_id',
                'sfl.id'
            )
            .where(
                'fl.id',
                hikeId
            );
    },

    deleteTrackFromHike: (knex, trackId,hikeId) => {
        return knex.from('hikes_tracks').select('*').where({track_id: trackId, main_hike_id: hikeId}).delete();
    }
};

module.exports = HikesService;