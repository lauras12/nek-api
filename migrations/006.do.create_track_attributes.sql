DROP TABLE IF EXISTS track_attributes;

CREATE TABLE track_attributes (
    assigned_hike_id INTEGER REFERENCES hikes(id) ON DELETE CASCADE NOT NULL,
    track_id INTEGER REFERENCES trail_tracks(id) ON DELETE SET NULL,
    attribute TEXT NOT NULL  
);

