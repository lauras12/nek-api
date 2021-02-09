function makeTracksArray() {
    return [
        {
            id: 1,
            name_eng: 'test-track 1',
            benefits: 'track1 benefits',
            track_level: 'track1 level',
            track_type: 'track1 type'
        },
        {
            id: 2,
            name_eng: 'test-track 2',
            benefits: 'track2 benefits',
            track_level: 'track2 level',
            track_type: 'track2 type'
        },
        {
            id: 3,
            name_eng: 'test-track 3',
            benefits: 'track3 benefits',
            track_level: 'track3 level',
            track_type: 'track3 type'
        },
        {
            id: 4,
            name_eng: 'test-track 4',
            benefits: 'track4 benefits',
            track_level: 'track4 level',
            track_type: 'track4 type'
        }
    ];
}

function makeUsersArray() {
    return [
        {
            id: 1,
            fullname: 'user1 full name',
            username: 'userName1',
            password: '!112Aabcd',
        },
        {
            id: 2,
            fullname: 'user2 full name',
            username: 'userName2',
            password: '!122Aabcd',
        },
        {
            id: 3,
            fullname: 'user3 full name',
            username: 'userName3',
            password: '!1233Aabcd',
        },
    ];
}

function makeHikesArray() {
    return [
        {
            id: 1,
            title: 'hike1',
            author: 1,

        },
        {
            id: 2,
            title: 'hike2',
            author: 2,
        },
        {
            id: 3,
            title: 'hike3',
            author: 1,
        }
    ];
}

function makeSectionHikesArray() {
    return [
        {
            id: 1,
            section: 'warmUp',
        },

        {
            id: 2,
            section: 'midHike',
        },

        {
            id: 3,
            section: 'peakTrack',
        },

        {
            id: 4,
            section: 'breakTracks',
        },
        {
            id: 5,
            section: 'afterBreak',
        }
    ];
}

function makeHikesTracksArray(hikes, users, tracks, sectionHikes) {
    return [
        {
            main_hike_id: 1,
            author: 1,
            track_id: 1,
            section_hike_id: 1,
        },
        {
            main_hike_id: 1,
            author: 1,
            track_id: 2,
            section_hike_id: 1,
        },
        {
            main_hike_id: 3,
            author: 1,
            track_id: 1,
            section_hike_id: 2,
        },
        {
            main_hike_id: 1,
            author: 2,
            track_id: 1,
            section_hike_id: 2,
        }
    ];
}

function makeNotesArray(hikes, tracks, users) {
    return [
        {
            id: 1,
            assigned_hike_id: 1,
            track_id: 1,
            author: 1,
            notes: 'this is test note1'
        },
        {
            id: 2,
            assigned_hike_id: 1,
            track_id: 2,
            author: 1,
            notes: 'this is test note2'
        },
        {
            id: 3,
            assigned_hike_id: 1,
            track_id: 3,
            author: 1,
            notes: 'this is test note3'
        },
        {
            id: 4,
            assigned_hike_id: 1,
            track_id: 4,
            author: 1,
            notes: 'this is test note4'
        }
    ];
}

function makeTrackAttributesArray(users, hikes, tracks) {
    return [
        {
            author: 1,
            assigned_hike_id: 1,
            track_id: 1,
            attribute: 'some attribute for track1'
        },
        {
            author: 2,
            assigned_hike_id: 1,
            track_id: 1,
            attribute: 'some attribute for track1'
        },
        {
            author: 1,
            assigned_hike_id: 1,
            track_id: 2,
            attribute: 'some attribute1 for track2'
        },
        {
            author: 1,
            assigned_hike_id: 1,
            track_id: 2,
            attribute: 'some attribute2 for track2'
        }
    ];
}

function makeTestFixtures() {
    const testTracks = makeTracksArray();
    const testUsers = makeUsersArray();
    const testHikes = makeHikesArray();
    const testSectionHikes = makeSectionHikesArray();
    const testHikesTracks = makeHikesTracksArray(testHikes, testUsers, testTracks, testSectionHikes);
    const testNotes = makeNotesArray(testHikes, testTracks, testUsers);
    const testTrackAttributes = makeTrackAttributesArray();
    return { testTracks, testUsers, testHikes, testSectionHikes, testHikesTracks, testNotes, testTrackAttributes };
}

function makeMaliciousTrack() {
    const maliciousTrack = {
        id: 911,
        name_eng: '<script>alert("xss");</script>',
        benefits: '<img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">',
        track_level: '<img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">',
        track_type: '<img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">',
    };

    const expectedTrack = {
        name_eng: '&lt;script&gt;alert("xss");&lt;/script&gt;',
        benefits: '<img src="https://url.to.file.which/does-not.exist">',
        track_level: '<img src="https://url.to.file.which/does-not.exist">',
        track_type: '<img src="https://url.to.file.which/does-not.exist">',
    };

    return {
        maliciousTrack,
        expectedTrack,
    };
}

module.exports = {
    makeTracksArray,
    makeUsersArray,
    makeHikesArray,
    makeSectionHikesArray,
    makeHikesTracksArray,
    makeNotesArray,
    makeTrackAttributesArray,
    makeTestFixtures,
    makeMaliciousTrack,
    makeTestFixtures,
};