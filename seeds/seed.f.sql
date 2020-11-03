BEGIN;



INSERT INTO hikes_tracks (main_hike_id, author, track_id, section_hike_id)
VALUES
(1, 1, 1, 1),
(1, 1, 4, 2),
(1, 1, 8, 2),
(1, 1, 13, 1),
(1, 1, 19, 4),
(2, 1, 1, 1),
(2, 1, 4, 2),
(2, 1, 8, 2),
(3, 1, 13, 1);


INSERT INTO track_notes (id, assigned_hike_id, track_id, author, notes)
VALUES
(1, 1, 9, 1, 'I love saturday mornings!'),
(2, 1, 3, 1, 'A hike a day keeps doctor at bay'),
(3, 1, 1, 1, 'You can never strech enough');





COMMIT;


