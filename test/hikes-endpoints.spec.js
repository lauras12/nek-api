const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-data-helpers');
const fixtures = require('./test-fixtures');
const bcrypt = require('bcryptjs');

describe('Hikes endpoints', function () {
    let db;
    const { testTracks, testUsers, testHikes, testSectionHikes, testHikesTracks, testNotes, testTrackAttributes } = helpers.makeTestFixtures();

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

    describe('GET /api/hikes', () => {
        context('Given no hikes in db', () => {
            beforeEach('insert users', () => {
                const users = testUsers.map(user => ({
                    ...user,
                    password: bcrypt.hashSync(user.password, 1)
                }));
                return db
                    .into('users')
                    .insert(users);
            });

            it('returns 200 and empty array', () => {
                return supertest(app)
                    .get('/api/hikes')
                    .set('Authorization', fixtures.makeAuthHeader(testUsers[0]))
                    .expect(200, []);
            });
        });

        context('given hikes in db', () => {
            beforeEach('insert hikes', () => {
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
                            .insert(testHikes);
                    });
            });

            it('returns 200 and all hikes', () => {
                const expectedHikes = testHikes;
                return supertest(app)
                    .get('/api/hikes')
                    .set('Authorization', fixtures.makeAuthHeader(testUsers[0]))
                    .expect(200, expectedHikes);
            });
        });
    });

    describe('POST /api/hikes', () => {
        beforeEach('insert users', () => {
            const users = testUsers.map(user => ({
                ...user,
                password: bcrypt.hashSync(user.password, 1)
            }));
            return db
                .into('users')
                .insert(users);
        });

        it('creates a new hike', () => {
            const title = 'new hike';
            const author = testUsers[1].id;
            const newHike = {
                title,
                author,
                assignedTracks: [],
            };

            return supertest(app)
                .post('/api/hikes')
                .set('Authorization', fixtures.makeAuthHeader(testUsers[1]))
                .send(newHike)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id');
                    expect(res.body.title).to.eql(newHike.title);
                    expect(res.body.author).to.eql(newHike.author);
                    expect(res.headers.location).to.eql(`/api/hikes/${res.body.id}`);
                })
                .expect(res => {
                    return db
                        .from('hikes')
                        .select('*')
                        .where({ id: `${res.body.id}` })
                        .first()
                        .then(row => {
                            expect(row.title).to.eql(newHike.title);
                            expect(row.author).to.eql(newHike.author);
                        });
                });
        });
    });

    describe('POST /api/hike-track', () => {
        beforeEach('insert users', () => {
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
                                .insert(testtracks)
                                .then(() => {
                                    return db
                                        .into('section_hikes')
                                        .insert(testSectionHikes);
                                });
                        });
                });
        });

        it('returns 201 and creates new hike-track', () => {
            const newHikeTrack = {
                main_hike_id: testHikes[2].id,
                author: testUsers[1].id,
                track_id: testTracks[3].id,
                section_hike_id: testSectionHikes[1].id,
            };

            return supertest(app)
                .post('/api/hike-track')
                .set('Authorization', fixtures.makeAuthHeader(testUsers[1]))
                .send(newHikeTrack)
                .expect(201)
                .expect(res => {
                    expect(res.body.main_hike_id).to.eql(newHikeTrack.main_hike_id);
                    expect(res.body.author).to.eql(newhHikeTrack.author);
                    expect(res.body.track_id).to.eql(newhHikeTrack.track_id);
                    expect(res.body.section_hike_id).to.eql(newHikeTrack.section_hike_id);
                    expect(res.headers.location).to.eql(`/api/hike-track/${res.body.main_hike_id}`);
                })
                .expect(res => {
                    return db
                        .from('hikes_tracks')
                        .select('*')
                        .then(rows => {
                            expect(rows[0].main_hike_id).to.eql(newHikeTrack.main_hike_id);
                            expect(rows[0].author).to.eql(newHikeTrack.author);
                            expect(rows[0].track_id).to.eql(newHikeTrack.track_id);
                            expect(rows[0].section_hike_id).to.eql(newHikeTrack.section_hike_id);
                        });
                });
        });
    });

    describe('/api/hikes/hike_id', () => {
        beforeEach('insert users to enable authentication', () => {
            const users = testUsers.map(user => ({
                ...user,
                password: bcrypt.hashSync(user.password, 1)
            }));
            return db
                .into('users')
                .insert(users);
        });

        context('given no hikes in db', () => {
            it('returns 400 ', () => {
                const hikeId = 1234;
                return supertest(app)
                    .get(`/api/hikes/${hikeId}`)
                    .set('Authorization', fixtures.makeAuthHeader(testUsers[0]))
                    .expect(400, { error: { message: `Hike with id ${hikeId} doesn't exist` } });
            });
        });

        context('Given no tracks in the hike', () => {
            beforeEach('insert data', () => {
                return db
                    .into('hikes')
                    .insert(testHikes);
            });
        });

        it('returns 200 and an empty hike', () => {
            it('returns 200 and an empty hike', () => {
                const hikeId = testHikes[2].id;
                const expectedHike = {
                    id: testHikes[2].id,
                    author: testUsers[0].id,
                    title: 'hike3'
                };

                return supertest(app)
                    .get(`/api/hikes/${hikeId}`)
                    .set('Authorization', fixtures.makeAuthHeader(testUsers[0]))
                    .expect(200, expectedHike);
            });
        });

        context('Given tracks in the hike', () => {
            beforeEach('insert data', () => {
                return db
                    .into('hikes')
                    .insert(testHikes)
                    .then(() => {
                        return db
                            .into('trail_tracks')
                            .insert(testTracks)
                            .then(() => {
                                return db
                                    .into('section_hikes')
                                    .insert(testSectionHikes)
                                    .then(() => {
                                        return db
                                            .into('hikes_tracks')
                                            .insert(testHikesTracks);
                                    });
                            });
                    });
            });

            it('returns hike with all its tracks', () => {
                const hikeId = testHikes[0].id;
                const author = testUsers[0].id;
                const expectedHike = {
                    id: testHikes[0].id,
                    title: testHikes[0].title,
                    author: author,
                    assignedTracks: [[1, 2], [1], [], [], []]
                };

                return supertest(app)
                    .get(`/api/hikes/${hikeId}`)
                    .set('Authorization', fixtures.makeAuthHeader(testUsers[1]))
                    .expect(200, expectedHike);
            });
        });
    });

    describe('DELETE /api/delete/hike_id/track_id', () => {
        beforeEach('insert users for authentication', () => {
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
                                .into('section_hikes')
                                .insert(testSectionHikes)
                                .then(() => {
                                    return db
                                        .into('trail_tracks')
                                        .insert(testTracks)
                                        .then(() => {
                                            return db
                                                .into('hikes_tracks')
                                                .insert(testHikesTracks);
                                        });
                                });
                        });
                });
        });

        it('deletes selected track from a hike', () => {
            const hikeId = testHikes[0].id;
            const trackToRemove = 2;
            const expectedHike = {
                id: hikeId,
                title: testHikes[0].title,
                author: testUsers[0].id,
                assignedTracks: [[1], [1], [], [], []]
            };
            
            return supertest(app)
                .delete(`/api/delete/${hikeId}/${trackToRemove}`)
                .set('Authorization', fixtures.makeAuthHeader(testUsers[0]))
                .expect(204)
                .then(res => {
                    return supertest(app)
                        .get(`/api/hikes/${hikeId}`)
                        .set('Authorization', fixtures.makeAuthHeader(testUsers[0]))
                        .expect(200, expectedHike );
                });
        });
    });
});
