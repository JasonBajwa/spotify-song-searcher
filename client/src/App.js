import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';

//BIG NOTE: SPOTFIY IS VERY PICKY AND WANTS REQUESTS AND STUFF TO BE VERY SPECIFIC FORMAT

const CLIENT_ID = "";
const CLIENT_SECRET = "";


function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);
  const [song, setSong] = useState("");


  //The intializing of the API
  useEffect(() => {
    //API ACCESS TOKEN
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
      .then(data => console.log(data))
  }, [])

  //SEARCH
  async function search() {
    console.log("search for " + searchInput) //Search input should be the song

    //STEP 1: GET REQUEST USING SEARACH TO GET THE ARTIST ID

    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    //WILL BE THE ARTIST ID. WE HAVE TO GET IT (WE DIGGING FOR THIS)
    var songID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=track', searchParameters)
      .then(response => response.json())
      // .then(data => console.log(data))
      .then(data => { return data.tracks.items[0].id })
    // .then(data => console.log(data))
    //THIS IS THE PATH THAT SPOTIFY MAKES US TAKE TO GET THE SPECIFC ARTIST WE WANT.
    //WE CAN SEE THIS PATH IN THE CONSLE.LOG
    console.log("The songID for " + searchInput + " is " + songID);

    // STEP 2: GET REQUEST W ARTIST ID TO GRAB ALL THE ALBUMS FROM THE ARTIST
    //searchParameters were used here bc it also calls the api and we need the same headers
    var returnedSong = await fetch('https://api.spotify.com/v1/tracks/' + songID + '?&market=US', searchParameters)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setSong(data);
      });
  }

  console.log(song);

  return (
    <div className="App">
      <Container>
        <InputGroup className='mb-3' size="lg">
          <FormControl
            placeholder='Search for Song'
            type="input"
            onKeyPress={event => {
              if (event.key == "Enter") {
                search();
                console.log("Pressed enter");
              }
            }}
            onChange={event => setSearchInput(event.target.value)}
          />

          <Button onClick={search}>
            Search
          </Button>
        </InputGroup>
      </Container>
      <Container>

        <Row className='mx-2 row row-cols-4'>
          {song && (
            <Card>
              <Card.Img src={song.album.images[0].url} />
              <Card.Body>
                <Card.Title>{song.name}</Card.Title>
              </Card.Body>
            </Card>
          )}
        </Row>


      </Container>
    </div>
  );
}

export default App;
