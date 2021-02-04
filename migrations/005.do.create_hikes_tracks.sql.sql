DROP TABLE IF EXISTS hikes_tracks;
CREATE TABLE hikes_tracks (
    main_hike_id INTEGER REFERENCES hikes(id) ON DELETE CASCADE NOT NULL,
    author INTEGER REFERENCEs users(id) ON DELETE CASCADE NOT NULL,
    track_id INTEGER,
    section_hike_id INTEGER
);
