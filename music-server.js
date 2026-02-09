const express = require('express'); //
const supa = require('@supabase/supabase-js');
const app = express();

const supaUrl = 'https://txjvaczjmbwtnoiwqysv.supabase.co';
const supaAnonKey = 'sb_publishable_nLmIszWZN079y3wq1Hzp7A_NB5F7PuB';

const supabase = supa.createClient(supaUrl, supaAnonKey);
 
//first route to test connection to supabase
//server will listen for requests at http://localhost:8080/blahblahblah

const domain = 'http://localhost:8080/';
//const domain = 'https:vercke or render';
const musicAPI = domain + 'music/artists';

app.get('/music/artists', async (req, res) => {
    const { data, error } = await supabase
    .from('artists')
    .select('*')
    .order('artist_name');
    if (error) {
        console.error('Error fetching data:', error);
        return;
    }
    res.json(data);
});

app.get('/api/artists/:artistID', async (req, res) => {
    const { data, error } = await supabase
    .from('artists')
    .select('artist_name')
    .eq('artist_id', req.params.artistID);
    //still produced a [] when artistID did not exist
    //only did an error when :artistID
    if(error) {
        console.log('2');
    }
  res.send(data);
});
app.get('/api/artists/averages/:artistID', async (req, res) => {
    const { data, error } = await supabase
      .from('songs')
      .select('AVERGAE(bpm), AVERAGE(energy), AVERAGE(danceability), AVERAGE(loudness), AVERAGE(liveness), AVERAGE(valence), AVERAGE(duration), AVERAGE(acousticness), AVERAGE(speechineess), AVERAGE(popularity)')
      .eq('artist_id', req.params.artistID);
    if(error) {
        console.log('3');
    }
  res.send(data);
});
app.get('/api/genres ', async (req, res) => {
    const { data, error } = await supabase
    if(error) {
        console.log('1');
    }
  res.send(data);
});
app.get('/api/songs', async (req, res) => {
    const { data, error } = await supabase
  res.send(data);
});
app.get('/api/songs/ref ', async (req, res) => {
    const { data, error } = await supabase
  res.send(data);
});
app.get('/api/songs/search/begin/substring', async (req, res) => {
    const { data, error } = await supabase
  res.send(data);
});
app.get('/api/songs/search/any/substring', async (req, res) => {
    const { data, error } = await supabase
  res.send(data);
});
app.get('/api/songs/search/year/substring', async (req, res) => {
    const { data, error } = await supabase
  res.send(data);
});
app.get('/api/songs/artist/ref', async (req, res) => {
    const { data, error } = await supabase
  res.send(data);
});
app.get('/api/songs/genre/ref', async (req, res) => {
    const { data, error } = await supabase
  res.send(data);
});
app.get('/api/playlists/ref ', async (req, res) => {
    const { data, error } = await supabase
  res.send(data);
});
app.get('/api/mood/dancing/ref', async (req, res) => {
    const { data, error } = await supabase
  res.send(data);
});
app.get('/api/mood/happy/ref', async (req, res) => {
    const { data, error } = await supabase
  res.send(data);
});
app.get('/api/mood/coffee/ref ', async (req, res) => {
    const { data, error } = await supabase
  res.send(data);
});

app.get('/api/mood/studying/ref', async (req, res) => {
    const { data, error } = await supabase
  res.send(data);
});

// this is where the server listens for requests
app.listen(8080, () => { 
console.log('listening on port 8080');
console.log(musicAPI); //https:localhost:8080/music/artists
});

//refer to https://www.geeksforgeeks.org/web-tech/express-js-req-params-property/