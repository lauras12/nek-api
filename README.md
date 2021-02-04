# Trail Track 

Check it out at [trail-track](https://nek-client.vercel.app/).

Trail Track is a Full-Stack mobile first responsive web application for all hikers and people who like to hike! The user can create an account where he/she can save hikes into trails as a way to keep track of the various hikes the users does.

## WHY MAKE THIS APP?
As someone who loves to journal and wanted a way ot keep track of all of her hike without writing each one down every time, Trail Track was created.  This app was also inspried by being able to be a sort of online journal keeping of hikes.

<a href="https://imgbb.com/"><img src="https://i.ibb.co/k0FZwFZ/Trail-Track1.png" alt="Trail-Track1" border="0" width='200'></a>
<a href="https://imgbb.com/"><img src="https://i.ibb.co/wWLTg3d/Trail-Track2.png" alt="Trail-Track2" border="0" width='200'></a><br /><a target='_blank' href='https://imgbb.com/'></a><br />


## ENDPOINTS AND EXPECTED DATA
### User Registration
#### /api/register

  description: registration endpoint

  method: POST

  input: 

    body: {

      fullname: string,
      username: string,
      password: string,
      id: number

    }

  output: 

    status: 201,

    body: {

      fullname: string,
      username: string,
      password: encrypted, 

    }

### Auth Login Endpoint
#### /api/login

  description: user login endpoint
  
  method: POST

  input:

    body: {

      userName: string, 
      password: string

    }


  output:

    body: {

      authToken: jwt (javascript web token)

    }

### TRACKS - Trail Tracks Endpoints
#### /api/tracks

  description: get all trail tracks in DB

  method: GET

  output: 
    
    status: 200,

    body: [

      {
        id: number,
        img: image url,
        name: track name,
        track_level: level of track,
        track_type: type of track,
        benefits: benefits this track can be for,
      }

    ]

#### /api/hike/:hike_id

  description: gets track object

  method: GET

  input: 
    
    params: track_id = number

  output: 

    status: 200,

    body: {
        id: number,
        img: image url,
        name: track name,
        track_level: level of track,
        track_type: type of track,
        benefits: benefits this track can be for,
      }

#### /api/hike/:hike_id/:trail_id

  description: gets track from user hike

  method: GET

  input: 

    params: /hike_id /track_id
  
  output:
    
    status: 200,

    body: {
        id: number,
        img: image url,
        name: track name,
        track_level: level of track,
        track_type: type of track,
        benefits: benefits this track can be for,
      }


#### /api/hikeatt/:track_id

  description: takes attributes chosen for trail tracks and saves to db

  method: POST

  input:

    body: [

      {
        
        track_id: number, 
        assigned_hike_id: number,
        attribute: [
          
          string - attribute

        ]
      }
    ]
  

  output: 

    status: 201,

    body: [

      {

        author: number,
        assigned_hike_id: number,
        track_id: number, 
        attribute: string of attribute name
      }

    ]


#### /api/hikenote/:track_id

  description: takes notes written about trail track and saves to db

  method: POST
  
  input: 

    body: {

      track_id: number of track,
      assigned_hike_id: number,
      notes: string - notes to save in db about track,
      
    }


  output: 

    status: 201,
    
    body: {

      assigned_hike_id: number
      author: number
      id: number
      notes: note saved to db
      track_id: number

    }


### HIKES - Trail Hikes Endpoints
#### /api/hikes

  description: gets all user hikes in database

  method: GET

  output: 

    body: [

      status: 200,

      {

        id: number,
        title: string,
        author: number

      }

    ]

  
#### /api/hikes

  description: returns hike object

  method: POST

  input:

    body: {

      assignedTracks: [],
      id: number,
      midHike: [],
      peakTrack: [],
      title: string,
      warmUp: []

    },

  output:
    
    status: 201,

    body: {
      assignedTracks: [],
      author: number,
      breakTrackss: [],
      id: number,
      midHike: [],
      peakTrack: [],
      title: string,
      warmUp: []

    }

#### /api/hike-track

  description: add track into hike

  method: POST

  input: 

    user: {

      id: number

    },

    body: {

      main_hike_id: number,
      track_id: number,
      section_hike_id: number

    }

  output: 

    status: 201,

    body: {

      author: number
      main_hike_id: number,
      track_id: number,
      section_hike_id: number

    }


#### /api/hikes/:hike_id

  description: get hike object

  method: GET

  input: 

    params: hike_id (id of hike to get from db)

  output: 

    status: 200,

    body: {

      hike: hike object

    }


#### /api/delete/:hike_id/:track_id

  description: delete hike from track

  method: DELETE

  input: 
    
    params: hike_id, track_id

  output: 

    status: 204,
    message: 'track deleted from hike'


## TECH STACK
#### FRONT-END
* HTML5
* CSS3
* JavaScript
* React.js front end framework
* font-awesome
* bcrypt

#### BACK-END
* Node.js backend run-time environment
* Express.js backend framework and architecture
* SQL for database
* Postgres - relational database management system
* JWTs for authentication

#### TESTING and DEPOLYMENT
* Mocha - back-end testing framework
* Chai - assertion library backend testing
* Enzyme - React.js testing utility
* Heroku - cloud application platform


