const STORE = {
    hikes: [
        {
            id: 1,
            name: 'Laura',
            savedTracksIds: [2, 5, 7, 8, 3, 12, 14]
        },
        {
            id: 2,
            name: 'John',
            savedTracksIds: [2, 5, 7, 8, 3, 12, 14]
        }
    ],

    attributes: [
        {
            id: 1,
            trackId: 2,
            assignedHikeId: [1],
            attributesList: [],
            notes: 'testing'
        },
        {
            id: "2",
            trackId: 7,
            assignedHikeId: 1,
            attributesList: [],
            notes: "",
        }
    ],

    tracks: [
        {
            id: 1,
            name: 'Barr Hill Trail',
            level: 'beginner',
            trackType: 'loop'
        },
        {
            id: 2,
            name: 'State House Trail',level: 'beginner',
            trackType: 'loop'
        },
        {
            id: 3,
            name: 'Irish Hill via Darling Road Trail',level: 'moderate',
            trackType: 'out and back'
        }, 
        {
            id: 4,
            name: 'Chickering Bog Nature Trail',level: 'beginner',
            trackType: 'out and back'
        },
        {
            id: 5,
            name: 'Middlesex Trail to White Rock Trail',level: 'moderate',
            trackType: 'out and back'
        },
        {
            id: 6,
            name: 'Paine Mountain',level: 'beginner',
            trackType: 'out and back'
        },
        {
            id: 7,
            name: 'Cross Vermont Rail Trail',level: 'beginner',
            trackType: 'out and back'
        },
    ]
}

export default STORE;