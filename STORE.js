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
            nameEng: 'Barr Hill Trail',
            benefits: 'Barr Hill Trail is a 0.8 mile lightly trafficked loop trail located near Greensboro Bend, Vermont that features beautiful wild flowers and is good for all skill levels. The trail offers a number of activity options and is best used from March until November.',
            level: 'beginner',
            trackType: 'loop'
        },
        {
            id: 2,
            nameEng: 'State House Trail',
            benefits: 'State House Trail is a 1.4 mile moderately trafficked out and back trail located near Montpelier, Vermont that features a great forest setting and is good for all skill levels. The trail is primarily used for hiking, walking, running, and nature trips and is best used from May until November. Dogs are also able to use this trail but must be kept on leash.',
            level: 'beginner',
            trackType: 'loop'
        },
        {
            id: 3,
            nameEng: 'Irish Hill via Darling Road Trail',
            benefits: 'Irish Hill via Darling Road Trail is a 3.7 mile out and back trail located near Northfield Falls, Vermont that offers the chance to see wildlife and is rated as moderate. The trail is primarily used for hiking and mountain biking.',
            level: 'moderate',
            trackType: 'out and back'
        }, 
        {
            id: 4,
            nameEng: 'Chickering Bog Nature Trail',
            benefits: 'Chickering Bog Nature Trail is a 2.1 mile moderately trafficked out and back trail located near Calais, Vermont that features beautiful wild flowers and is good for all skill levels. The trail is primarily used for hiking, walking, nature trips, and bird watching and is best used from April until September.',
            level: 'beginner',
            trackType: 'out and back'
        },
        {
            id: 5,
            nameEng: 'Middlesex Trail to White Rock Trail',
            benefits: 'Middlesex Trail to White Rock Trail is a 5.7 mile moderately trafficked out and back trail located near Montpelier, Vermont that offers the chance to see wildlife. The trail is rated as moderate and primarily used for hiking. Dogs are also able to use this trail but must be kept on leash.',
            level: 'moderate',
            trackType: 'out and back'
        },
        {
            id: 6,
            nameEng: 'Paine Mountain',
            benefits: 'Paine Mountain is a 6.7 mile heavily trafficked out and back trail located near Northfield, Vermont that features a great forest setting and is rated as moderate. The trail is primarily used for hiking, horses, and snowshoeing and is best used from January until July. Dogs and horses are also able to use this trail.',
            level: 'beginner',
            trackType: 'out and back'
        },
        {
            id: 7,
            nameEng: 'Cross Vermont Rail Trail',
            benefits: 'Cross Vermont Rail Trail is a 30.1 mile out and back trail located near Marshfield, Vermont that features a great forest setting and is good for all skill levels. The trail offers a number of activity options. Dogs are also able to use this trail but must be kept on leash.',
            level: 'beginner',
            trackType: 'out and back'
        },
    ]
}

export default STORE;