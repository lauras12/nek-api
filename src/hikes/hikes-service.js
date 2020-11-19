const HikesService = {
    getAllUserHikes: (knex) => {
        return knex
            .from('hike AS hi')
            .select(
                'hi.id',
                'hi.title',
                'hi.author')
            .join(
                'users AS usr',
                'hi.author',
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
            .from('hikes AS hi')
            .select(
                'hi.title',
                'hi.id',
                'hi_tr.main_hike_id',
                'hi_tr.author',
                'hi_tr.track_id',
                'hi_tr.section_hike_id',
                'shi.section',
            )
            .leftJoin(
                'hikes_tracks AS hi_tr',
                'hi.id',
                'hi_tr.main_hike_id')
            .leftJoin(
                'section_hikes AS shi',
                'hi_tr.section_hike_id',
                'shi.id'
            )
            .where(
                'hi.id',
                hikeId
            );
    },

    deleteTrackFromHike: (knex, trackId,hikeId) => {
        return knex.from('hikes_tracks').select('*').where({track_id: trackId, main_hike_id: hikeId}).delete();
    }
};

module.exports = HikesService;