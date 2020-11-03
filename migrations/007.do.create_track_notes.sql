DROP TABLE IF EXISTS track_notes;

CREATE TABLE track_notes (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    assigned_hike_id INTEGER REFERENCES hikes(id) ON DELETE CASCADE NOT NULL,
    track_id INTEGER REFERENCES trail_tracks(id) ON DELETE SET NULL
    notes TEXT
);