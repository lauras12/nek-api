const STORE = {
    hikes: [
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
            img: "/static/images/hike1.png",
            utube: "",
            level: 'beginner',
            trackType: 'easy track',
        }, {
            id: 2,
            nameEng: 'Bend Trail',
            alias: 'Bend Trail',
            benefits: 'Strengthens legs',
            img: "/static/images/hike2.png",
            utube: "",
            level: 'beginner',
            trackType: 'easy track',
        },
    ]
}

module.exports = STORE;