DROP TABLE IF EXISTS hikes_tracks;
CREATE TABLE hikes_tracks (
    main_hike_id INTEGER REFERENCES hikes(id) ON DELETE CASCADE NOT NULL,
    author INTEGER REFERENCEs users(id) ON DELETE CASCADE NOT NULL,
    track_id INTEGER REFERENCES trail_tracks(id) ON DELETE SET NULL,
    section_hike_id INTEGER REFERENCES section_hikes(id) ON DELETE CASCADE NOT NULL
);
