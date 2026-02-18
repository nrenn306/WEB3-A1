const express = require('express'); //
const supa = require('@supabase/supabase-js');
const app = express();

// return error messages in JSON format
const jsonMessage = (msg) => {
	return { message: msg };
};

const supaUrl = 'https://txjvaczjmbwtnoiwqysv.supabase.co';
const supaAnonKey = 'sb_publishable_nLmIszWZN079y3wq1Hzp7A_NB5F7PuB';

const supabase = supa.createClient(supaUrl, supaAnonKey);
 
//first route to test connection to supabase
//server will listen for requests at http://localhost:8080/blahblahblah

const domain = 'http://localhost:8080/';
//const domain = 'https:vercle or render';
const musicAPI = domain + 'music/artists';

//1
app.get('/music/artists', async (req, res) => {
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .order('artist_name');
    if (error) {
        res.json(jsonMessage('Error: ' + error.message));
        return;
    }
    res.json(data);
});

//2
app.get('/music/artists/:artistID', async (req, res) => {

  const artistId = req.params.artistID;
  if (isNaN(artistId)) {
    return res.json(jsonMessage(`${artistId} is not a number. Please enter a valid number`));
  }

  const { data, error } = await supabase
    .from('artists')
    .select('artist_name')
    .eq('artist_id', artistId);
    if(error) {
      return res.json(jsonMessage('Error: ' + error.message));
    }
    if (!data || data.length === 0) {
      return res.json(jsonMessage(`Artist ${artistId} not found`));
    }
  res.json(data);
});

//3
app.get('/music/artists/averages/:artistID', async (req, res) => {

  const artistId = req.params.artistID;
  if (isNaN(artistId)) {
    return res.json(jsonMessage(`${artistId} is not a number. Please enter a valid number`));
  }
  
  const { data, error } = await supabase
    .rpc('get_artist_averages', { a_id: artistId });
  if (error) {
    console.error(error);
    return res.json(jsonMessage('Error: ' + error.message));
  }

  if (!data || data.length === 0) {
    return res.json(jsonMessage(`Artist ${artistId} not found`));
  }

  res.json(data[0]);
});

//4
app.get('/music/genres', async (req, res) => {
    const { data, error } = await supabase
      .from('genres')
      .select('genre_name');
    if(error) {
        res.json(jsonMessage('Error: ' + error.message));
        return;
    }
  res.json(data);
});

//5
app.get('/music/songs', async (req, res) => {
    const { data, error } = await supabase
      .from('songs')
      .select(`*, artists!inner(artist_id, artist_name), genres!inner(genre_id, genre_name)`)
      .order('title');
    if(error) {
        res.json(jsonMessage('Error: ' + error.message));
        return;
    }
  res.json(data);
});

//6
app.get('/music/songs/sort/:filter', async (req, res) => {
  const filter = req.params.filter;

  // Validate filter to avoid SQL errors
  const validFilters = ['id', 'title', 'artist', 'genre', 'year', 'duration'];
  if (!validFilters.includes(filter.toLowerCase())) {
    return res.status(400).json({
      error: `Invalid filter: ${filter}. Valid options: ${validFilters.join(', ')}`
    });
  }

  try {
    const { data, error } = await supabase.rpc('get_order', { filter }); // call your PostgreSQL function
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//7
app.get('/music/songs/:songID', async (req, res) => {
  const songId = Number(req.params.songID);

  if (isNaN(songId)) {
    return res.json(jsonMessage(`Invalid input: ${req.params.songID} is not a number`));
  }

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('song_id', songId)
    .maybeSingle();
    if(error) {
      res.json(jsonMessage('Error: ' + error.message));
      return;
    }  else if (!data) {
      res.json(jsonMessage(`Song ${songId} not found`));
      return;
    }
  res.json(data);
});

//8
app.get('/music/songs/search/begin/:substring', async (req, res) => {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .ilike('title', req.params.substring + '%');
    if(error) {
      res.json(jsonMessage('Error: ' + error.message));
      return;
    }
    if (!data || data.length === 0) {
      res.json(jsonMessage(`No songs found starting with "${req.params.substring}"`));
      return;
    }
  res.json(data);
});

//9
app.get('/music/songs/search/any/:substring', async (req, res) => {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .ilike('title', '%' + req.params.substring + '%');
    if(error) {
      res.json(jsonMessage('Error: ' + error.message));
      return;
    }
    if (!data || data.length === 0) {
      res.json(jsonMessage(`No songs found containing "${req.params.substring}"`));
      return;
    }
  res.json(data);
});

//10
app.get('/music/songs/search/year/:year', async (req, res) => {
  const year = Number(req.params.year);

  if (isNaN(year)) {
    return res.json(jsonMessage(`Invalid input: ${req.params.year} is not a number`));
  }

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('year', year);
    if(error) {
      res.json(jsonMessage('Error: ' + error.message));
      return;
    }
    if (!data || data.length === 0) {
      res.json(jsonMessage(`No songs found from year ${year}`));
      return;
    }
  res.json(data);
});

//11
app.get('/music/songs/artists/:artistID', async (req, res) => {
  const artistId = req.params.artistID;
  if (isNaN(artistId)) {
    return res.json(jsonMessage(`Invalid input: ${artistId} is not a number`));
  }
  const { data, error } = await supabase
    .from('songs')
    .select(`title, artists!inner(artist_id, artist_name)`)
    .eq('artist_id', artistId);

   if(error) {
      return res.json(jsonMessage('Error: ' + error.message));
    } else if (!data || data.length === 0)  {
      return res.json(jsonMessage(`Artist ${artistId} not found`));
    }
  res.json(data);
});

//12
app.get('/music/songs/genre/:genreID', async (req, res) => {
  const genreId = Number(req.params.genreID);

  if (isNaN(genreId)) {
    return res.json(jsonMessage(`Invalid input: ${req.params.genreID} is not a number`));
  }

  const { data, error } = await supabase
    .from('songs')
    .select('title, genres!inner(genre_id, genre_name)')
    .eq('genre_id', genreId);
  
  if(error) {
    return res.json(jsonMessage('Error: ' + error.message));
  } else if (!data || data.length === 0)  {
    return res.json(jsonMessage(`Genre ${genreId} not found`));
  }

  res.json(data);
});

//13
app.get('/music/playlists/:playlistID', async (req, res) => {
  const playlistId = Number(req.params.playlistID);

  if (isNaN(playlistId)) {
    return res.json(jsonMessage(`Invalid input: ${req.params.playlistID} is not a number`));
  }

  const { data, error } = await supabase
    .from('playlists')
    .select('songs!inner(title)')
    .eq('playlist_id', playlistId);

  if (error) {
    return res.json(jsonMessage('Error: ' + error.message));
  } else if (!data || data.length === 0)  {
    return res.json(jsonMessage(`Playlist ${playlistId} not found`));
  }

  res.json(data);
});

//14
app.get('/music/mood/dancing/:ref', async (req, res) => {
  const ref = Number(req.params.ref);
  let num = 20;

  if (!isNaN(ref) && ref >= 1 && ref <= 20) {
    num = ref;
  }

  const { data, error } = await supabase
    .from('songs')
    .select('title')
    .order('danceability', { ascending: false})
    .limit(num);
  
  if (error) {
    return res.json(jsonMessage('Error: ' + error.message));
  }
  res.json(data);
});

//15
app.get('/music/mood/happy/:ref', async (req, res) => {
  const topId = Number(req.params.ref);

  if (isNaN(topId)) {
    return res.json(jsonMessage(`Invalid input: ${req.params.ref} is not a number`));
  }

  const { data, error } = await supabase
    .from('songs')
    .select('title')
    .order('valence', { ascending: false})
    .limit(topId);
  
  if (error) {
    return res.json(jsonMessage('Error: ' + error.message));
  }
  res.json(data);
});

//16
app.get('/music/mood/coffee/:ref', async (req, res) => {
  const topId = Number(req.params.ref);

  if (isNaN(topId)) {
    return res.json(jsonMessage(`Invalid input: ${req.params.ref} is not a number`));
  }

  const { data, error } = await supabase
    .rpc('get_liveness_acousticness_ratio', { top: topId});
  
  if (error) {
    console.error(error);
    return res.json(jsonMessage('Error: ' + error.message));
  }

  res.json(data);
});

//17
app.get('/music/mood/studying/:ref', async (req, res) => {
  const topId = Number(req.params.ref);

  if (isNaN(topId)) {
    return res.json(jsonMessage(`Invalid input: ${req.params.ref} is not a number`));
  }

  const { data, error } = await supabase
    .rpc('get_energy_speechiness_product', { top: topId});
  
  if (error) {
    console.error(error);
    return res.json(jsonMessage('Error: ' + error.message));
  }

  res.json(data);
});

// this is where the server listens for requests
app.listen(8080, () => { 
console.log('listening on port 8080');
console.log(musicAPI); // http://localhost:8080/music/artists
});

//https://www.geeksforgeeks.org/web-tech/express-js-req-params-property/
//https://supabase.com/docs/reference/javascript/rpc
//https://www.w3tutorials.net/blog/nodejs-how-to-check-route-parameters/