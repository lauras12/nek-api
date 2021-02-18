const STORE = {
    /*hikes: [
        {
            id: 1,
            name: 'laura',
            savedTracksIds: [2, 5, 7, 8, 3, 12, 14],
            peakTrack: '',
            warmUp: [2, 5],
            midHike: [],
            breakTracks: [],
            afterPeak: [5, 6, 7, 2],
            notes: 'ewargxthfcjghvbkn.l'
        },
        {
            id: 2,
            name: 'john',
            savedTracksIds: [2, 5, 7, 8, 3, 12, 14],
            peakTrack: '',
            warmUp: [2, 5],
            midHike: [],
            breakTracks: [],
            afterPeak: [5, 6, 7, 2],
        }
    ],
    */

    sections: {
        1: 'warmUp',
        2: 'midHike',
        3: 'breakTracks',
        4: 'peakTrack',
        5: 'afterPeak'
      },

    attributes: [
        {
            id: 1,
            trackId: 2,
            assignedhikeId: [1],
            attributesList: [],
            notes: 'note example 1'
        },
        {
            id: "ck4brfoeh00003g5q82dd4719",
            trackId: 7,
            assignedHikeId: 1,
            attributesList: ["grounding-track", "energizing-track", "strengthening-track"],
            notes: "",
        }
    ],

    tracks: [
        {
            id: 1,
            nameEng: 'Barr Hill Trail',
            alias: 'Barr Hill Trail',
            benefits: 'Strengthens legs',
            img: "/static/images/hike1.jpg",
            utube: "",
            track_level: 'beginner',
            track_type: 'easy track',
        }, {
            id: 2,
            nameEng: 'Bend Trail',
            alias: 'Bend Trail',
            benefits: 'Strengthens legs',
            img: "/static/images/hike2.jpg",
            utube: "",
            track_level: 'beginner',
            track_type: 'easy track',
        }, {
            id: 3,
            nameEng: 'Hanover Hill',
            alias: 'Hanover Hill',
            benefits: 'Strengthens legs',
            img: "/static/images/hike3.jpg",
            utube: "",
            track_level: 'beginner',
            track_type: 'easy track',
        },{
            id: 4,
            nameEng: 'Lakefront Trail',
            alias: 'LakefrontTrail',
            benefits: 'Strengthens legs',
            img: "/static/images/hike4.jpg",
            utube: "",
            track_level: 'beginner',
            track_type: 'easy track',
        },{
            id: 5,
            nameEng: 'River Trail',
            alias: 'River Trail',
            benefits: 'Strengthens legs',
            img: "/static/images/hike5.jpg",
            utube: "",
            track_level: 'beginner',
            track_type: 'easy track',
        },
    ]
}

module.exports = STORE;