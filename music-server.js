const express = require('express');
const supa = require('@supabase/supabase-js');
const app = express();

const supaUrl = 'https://txjvaczjmbwtnoiwqysv.supabase.co';
const supaAnonKey = 'sb_publishable_nLmIszWZN079y3wq1Hzp7A_NB5F7PuB';

const supabase = supa.createClient(supaUrl, supaAnonKey);
 
app.get('/music/artists', async (req, res) => {
    const { data, error } = await supabase
    .from('artists')
    .select(`artist_id, artist_name, artist_image_url, spotify_url, spotify_desc, types!inner(type_name)`)
    .order('artist_name', { ascending: true });
    if(error) {
        console.log('1');
    }
    res.json(data);
});


app.get('/api/artists/:artistID', async (req, res) => {
    const { data, error } = await supabase
    if(error) {
        console.log('2');
    }
  res.send(data);
});
app.get('/api/artists/averages/ref ', async (req, res) => {
    const { data, error } = await supabase
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


app.listen(8080, () => {
console.log('listening on port 8080');
console.log('http://localhost:8080/music/artists');
});