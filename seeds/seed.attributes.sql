BEGIN;

INSERT INTO track_attributes (author, assigned_hike_id, track_id, attribute)
VALUES
(1, 1, 14, 'ground track'),
(1, 1, 14, 'uphill track'),
(1, 1, 14, 'downhill track'),
(1, 1, 14, 'strengthening track'), 
(1, 1, 4, 'flat track'),
(1, 1, 1, 'uphill track'),
(1, 1, 1, 'energizing track'),
(1, 1, 8, 'flat track');
COMMIT;

