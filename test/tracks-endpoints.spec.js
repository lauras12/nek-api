const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-data-helpers');
const fixtures = require('./test-fixtures');
const bcrypt = require('bcryptjs');

describe('Tracks endpoints', function () {
    let db;

    const { testTracks, testUsers, testHikes, testNotes, testTrackAttributes } = helpers.makeTestFixtures();

    before('make knex instatnce', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db', db);
    });
    after('disconnect from db', () => db.destroy());
    beforeEach('cleanup', () => fixtures.cleanTables(db));
    afterEach('cleanup', () => fixtures.cleanTables(db));

    describe(`GET /api/tracks`, () => {
        context('Given no tracks', () => {
            it('responds with 200 and empty list', () => {
                return supertest(app)
                    .get('/api/tracks')
                    .expect(200, []);
            });
        });

        context('Given tracks inside db', () => {
            beforeEach('insert tracks', () => {
                return db
                    .into('trail_tracks')
                    .insert(testTracks);
            });

            it('responds with 200 and all tracks', () => {
                const expectedTracks = testTracks.map(item =>
                    fixtures.makeExpectedListTrack(item)
                );
                return supertest(app)
                    .get('/api/tracks')
                    .expect(200, expectedTracks);
            });
        });

        context('Given an XSS attack', () => {
            const { maliciousTrack, expectedTrack } = helpers.makeMaliciousTrack();
            beforeEach('insert maliciousTrack', () => {
                return db
                    .into('trail_tracks')
                    .insert(maliciousTrack);
            });
            it('removes XSS attack', () => {
                return supertest(app)
                    .get('/api/tracks')
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].name_eng).to.eql(expectedTrack.name_eng);
                        expect(res.body[0].name_san).to.eql(expectedTrack.name_san);
                        expect(res.body[0].alias).to.eql(expectedTrack.alias);
                        expect(res.body[0].track_level).to.eql(expectedTrack.track_level);
                        expect(res.body[0].track_type).to.eql(expectedTrack.track_type);
                        expect(res.body[0].img).to.eql(expectedTrack.img);
                    });
            });
        });
    });

    describe('GET /api/hike/:track_id', () => {
        context('Given no tracks in db', () => {
            beforeEach('insert users', () => {
                const users = testUsers.map(user => ({
                    ...user,
                    password: bcrypt.hashSync(user.password, 1)
                }));
                return db
                    .into('users')
                    .insert(users);
            });
            it('returns 404', () => {
                const trackId = 1234;
                return supertest(app)
                    .get(`/api/hike/${trackId}`)
                    .set('Authorization', fixtures.makeAuthHeader(testUsers[0]))
                    .expect(404, { error: { message: `Track with id ${trackId} doesn't exist` } });
            });
        });

        context('Given tracks in DB', () => {
            beforeEach('insert users', () => {
                const users = testUsers.map(user => ({
                    ...user,
                    password: bcrypt.hashSync(user.password, 1)
                }));
                const tracks = testTracks;
                return db
                    .into('users')
                    .insert(users)
                    .then(() => {
                        return db
                            .into('trail_tracks')
                            .insert(tracks);
                    });
            });

            it('responds with 200 and specified track', () => {
                const trackId = 2;
                const expectedTrack = fixtures.makeExpectedFullTrack(testTracks[trackId - 1]);
                return supertest(app)
                    .get(`/api/hike/${trackId}`)
                    .set('Authorization', fixtures.makeAuthHeader(testUsers[0]))
                    .expect(200, expectedTrack);
            });
        });

        context('Given an XSS attack', () => {
            const { maliciousTrack, expectedTrack } = helpers.makeMaliciousTrack();
            beforeEach('insert users', () => {
                const users = testUsers.map(user => ({
                    ...user,
                    password: bcrypt.hashSync(user.password, 1)
                }));
                const track = maliciousTrack;
                return db
                    .into('users')
                    .insert(users)
                    .then(() => {
                        return db
                            .into('trail_tracks')
                            .insert(track);
                    });
            });

            it('removes XSS attack', () => {
                return supertest(app)
                    .get(`/api/hike/${maliciousTrack.id}`)
                    .set('Authorization', fixtures.makeAuthHeader(testUsers[0]))
                    .expect(200)
                    .expect(res => {
                        expect(res.body.name_eng).to.eql(expectedTrack.name_eng);
                        expect(res.body.name_san).to.eql(expectedTrack.name_san);
                        expect(res.body.alias).to.eql(expectedTrack.alias);
                        expect(res.body.track_level).to.eql(expectedTrack.track_level);
                        expect(res.body.track_type).to.eql(expectedTrack.track_type);
                        expect(res.body.img).to.eql(expectedTrack.img);
                    });
            });
        });
    });

    describe('GET /api/hike/hike_id/track_id', () => {
        context('Given no tracks in db', () => {
            beforeEach('insert data', () => {
                const users = testUsers.map(user => ({
                    ...user,
                    password: bcrypt.hashSync(user.password, 1)
                }));
                return db
                    .into('users')
                    .insert(users);
            });

            it('responds 404', () => {
                const trackId = 12345;
                const hikeId = 1;
                return supertest(app)
                    .get(`/api/hike/${hikeId}/${trackId}`)
                    .set('Authorization', fixtures.makeAuthHeader(testUsers[0]))
                    .expect(404, { error: { message: `Track with id ${trackId} doesn't exist` } });
            });
        });

        context('given tracks in db but no attributes or no notes', () => {
            beforeEach('insert users', () => {
                const users = testUsers.map(user => ({
                    ...user,
                    password: bcrypt.hashSync(user.password, 1)
                }));
                const tracks = testTracks;
                return db
                    .into('users')
                    .insert(users)
                    .then(() => {
                        return db
                            .into('trail_tracks')
                            .insert(tracks);
                    });
            });
            it('responds 200 and returns selected track without attributes or notes', () => {
                const trackId = 2;
                const hikeId = 2;
                const expectedTrack = fixtures.makeExpectedFullTrack(testTracks[TrackId - 1]);
                return supertest(app)
                    .get(`/api/hike/${hikeId}/${trackId}`)
                    .set('Authorization', fixtures.makeAuthHeader(testUsers[0]))
                    .expect(200, expectedTrack);
            });
        });

        context('given track has attributes and notes', () => {
            beforeEach('insert data to tables', () => {
                const users = testUsers.map(user => ({
                    ...user,
                    password: bcrypt.hashSync(user.password, 1)
                }));
                return db
                    .into('users')
                    .insert(users)
                    .then(() => {
                        return db
                            .into('trail_tracks')
                            .insert(testTracks)
                            .then(() => {
                                return db
                                    .into('hikes')
                                    .insert(testHikes)
                                    .then(() => {
                                        return db
                                            .into('track_attributes')
                                            .insert(testTrackAttributes)
                                            .then(() => {
                                                return db
                                                    .into('track_notes')
                                                    .insert(testNotes);
                                            });
                                    });
                            });
                    });
            });

            it('responds 200 returning track with attributes and notes', () => {
                const trackId = 2;
                const hikeId = 1;
                const expectedTrackAttNotes = fixtures.makeExpectedTrackAttNotes(testUsers[0], testTracks[trackId - 1], hikeId, testTrackAttributes, testNotes);
                return supertest(app)
                    .get(`/api/hike/${hikeId}/${trackId}`)
                    .set('Authorization', fixtures.makeAuthHeader(testUsers[0]))
                    .expect(200, expectedTrackAttNotes);
            });
        });
    });

    describe('POST /api/hikeatt/:track_id', () => {
        beforeEach('inserts users', () => {
            const users = testUsers.map(user => ({
                ...user,
                password: bcrypt.hashSync(user.password, 1)
            }));
            return db
                .into('users')
                .insert(users)
                .then(() => {
                    return db
                        .into('hikes')
                        .insert(testHikes)
                        .then(() => {
                            return db
                                .into('trail_tracks')
                                .insert(testTracks)
                                .then(() => {
                                    return db
                                        .into('track_attributes')
                                        .insert(testTrackAttributes);
                                });
                        });
                });
        });
    
        it('creates a new attribute object', () => {
            const testTrack = testTracks[1].id;
            const testUser = testUsers[0].id;
            const testHike = testHikes[1].id;
            const testAttributes = ['new attribute1 for track2', 'new attribute 2 for track 2'];
            const newAttributesReq = {
                assigned_hike_id: testHike,
                author: testUser,
                track_id: testTrack,
                attribute: testAttributes,
            };
        
            return supertest(app)
                .post(`/api/hikeatt/${testTrack}`)
                .set('Authorization', fixtures.makeAuthHeader(testUsers[0]))
                .send(newAttributesReq)
                .expect(201)
                .expect(res => {
                    expect(res.body[0].assigned_hike_id).to.eql(newAttributesReq.assigned_hike_id);
                    expect(res.body[0].author).to.eql(newAttributesReq.author);
                    expect(res.body[0].track_id).to.eql(newAttributesReq.track_id);
                    expect(res.body[0].attribute).to.eql(newAttributesReq.attribute[0]);
                })
                .expect(res => {
                    return db
                        .from('track_attributes')
                        .select('*')
                        .where({'track_id': res.body[0].track_id || 0, assigned_hike_id: res.body[0].assigned_hike_id} )
                        .then(rows => {
                            expect(rows[0].assigned_hike_id).to.eql(newAttributesReq.assigned_hike_id);
                            expect(rows[0].author).to.eql(newAttributesReq.author);
                            expect(rows[0].track_id).to.eql(newAttributesReq.track_id);
                            expect(rows[0].attribute).to.eql(newAttributesReq.attribute[0]);
                        });
                });
        });
    });

    describe('POST /api/hikenote/track_id', () => {
        beforeEach('inserts users', () => {
            const users = testUsers.map(user => ({
                ...user,
                password: bcrypt.hashSync(user.password, 1)
            }));
            return db
                .into('users')
                .insert(users)
                .then(() => {
                    return db
                        .into('hikes')
                        .insert(testHikes)
                        .then(() => {
                            return db
                                .into('trail_tracks')
                                .insert(testTracks);
                        });
                });
        });

        it('inserts new note to db', () => {
            const user = testUsers[0].id;
            const hike = testHikes[1].id;
            const trackId = testTracks[2].id;
            const note = 'some new note';

            const newNoteReq = {
                assigned_hike_id: hike,
                author: user,
                track_id: trackId,
                notes: note,
            };

            return supertest(app)
                .post(`/api/hikenote/${trackId}`)
                .set('Authorization', fixtures.makeAuthHeader(testUsers[0]))
                .send(newNoteReq)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id');
                    expect(res.body.assigned_hike_id).to.eql(newNoteReq.assigned_hike_id);
                    expect(res.body.author).to.eql(newNoteReq.author);
                    expect(res.body.track_id).to.eql(newNoteReq.track_id);
                    expect(res.body.notes).to.eql(newNoteReq.notes);
                    expect(res.headers.location).to.eql(`/api/hikenote/${res.body.track_id}/${res.body.id}`);
                })
                .expect(res => {
                    return db
                        .from('track_notes')
                        .select('*')
                        .where({ id: res.body.id })
                        .first()
                        .then(row => {
                            expect(row.assigned_hike_id).to.eql(newNoteReq.assigned_hike_id);
                            expect(row.author).to.eql(newNoteReq.author);
                            expect(row.track_id).to.eql(newNoteReq.track_id);
                            expect(row.notes).to.eql(newNoteReq.notes);
                        });
                });
        });
    });
});
