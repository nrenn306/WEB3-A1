const express = require('express');
const supa = require('@supabase/supabase-js');
const app = express();
const PORT = process.env.PORT || 8080; //connecting to port 8080 or the port provided by hosting service

// return in JSON format
const jsonMessage = (msg) => {
	return {Message: msg};
};

//supabase connection
const supaUrl = 'https://txjvaczjmbwtnoiwqysv.supabase.co';
const supaAnonKey = 'sb_publishable_nLmIszWZN079y3wq1Hzp7A_NB5F7PuB';
const supabase = supa.createClient(supaUrl, supaAnonKey);

//Default route to test connection
app.get('', (req, res) => {
  res.json(jsonMessage("WELCOME! Please enjoy testing my routes" ));
});

/**
 * This route handles GET requests to the '/music/artists' endpoint.
 * 
 * @returns A JSON response containing a list of all artists in the database,
 * ordered alphabetically by artist name. Returns an error message if there was an
 * issue with the database query.
 */
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

/**
 * This route handles GET requests to the '/music/artists/:artistID' endpoint.
 * 
 * @returns A JSON response containing the name of the artist with the specified
 * :artistID. Returns an error message if the artist ID is not a number, if the 
 * artist is not found, or if there was an issue with the database query.
 */
app.get('/music/artists/:artistID', async (req, res) => {

  const artistId = req.params.artistID;
  if (isNaN(artistId)) {
    return res.json(jsonMessage(`${artistId} is not a number. Please enter a valid number`));
  }

  const { data, error } = await supabase
    .from('artists')
    .select('artist_name')
    .eq('artist_id', artistId)
    .maybeSingle();
    if(error) {
      return res.json(jsonMessage('Error: ' + error.message));
    }
    if (!data || data.length === 0) {
      return res.json(jsonMessage(`Artist ${artistId} not found`));
    }
  res.json(data);
});

/**
 * This route handles GET requests to the '/music/artists/averages/:artistID' endpoint.
 * 
 * @returns A JSON response containing the average values of the audio features for all 
 * songs by the artist with the specified :artistID. Returns an error message if the artist 
 * ID is not a number, if the artist is not found, or if there was an issue with the 
 * database query.
 */
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

/**
 * This route handles GET requests to the '/music/genres' endpoint.
 * 
 * @returns A JSON response containing a list of all genres in the database, ordered
 * alphabetically by genre name. Returns an error message if there was an issue with the
 * database query.
 */
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

/**
 * This route handles GET requests to the '/music/songs' endpoint.
 * 
 * @returns A JSON response containing a list of all songs in the database, including
 * the associated artist and genre information, ordered alphabetically by song title.
 * Returns an error message if there was an issue with the database query.
 */
app.get('/music/songs', async (req, res) => {
    const { data, error } = await supabase
      .from('songs')
      .select('*, artists!inner(artist_id, artist_name), genres!inner(genre_id, genre_name)')
      .order('title');
    if(error) {
        res.json(jsonMessage('Error: ' + error.message));
        return;
    }
  res.json(data);
});

/**
 * This route handles GET requests to the '/music/songs/sort/:filter' endpoint.
 * 
 * @returns A JSON response containing a list of all songs in the database, sorted by the specified :filter.
 * Returns an error message if the filter is not valid or if there was an issue with the database query.
 * Valid filters include: id, title, artist, genre, year, and duration.
 */
app.get('/music/songs/sort/:filter', async (req, res) => {
  const filter = req.params.filter;

  const validFilters = ['id', 'title', 'artist', 'genre', 'year', 'duration'];
  if (!validFilters.includes(filter.toLowerCase())) {
    return res.json(jsonMessage(`Invalid input: ${req.params.filter} is not valid. Valid input: id, title, artist, genre, year, and duration`));
  }

  
  const { data, error } = await supabase
  .rpc('get_order', { filter });
  
  if (error) {
      res.json(jsonMessage('Error: ' + error.message));
      return;
  } 
  
  res.json(data);
  
});

/**
 * This route handles GET requests to the '/music/songs/:songID' endpoint.
 * 
 * @returns A JSON response containing the song with the specified :songID.
 * Returns an error message if the songID is not a number or if the song is not found.
 */
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
    if (error) {
      res.json(jsonMessage('Error: ' + error.message));
      return;
    }  else if (!data) {
      res.json(jsonMessage(`Song ${songId} not found`));
      return;
    }
  res.json(data);
});

/**
 * This route handles GET requests to the '/music/songs/search/begin/:substring' endpoint.
 * 
 * @returns A JSON response containing a list of songs whose titles start with the specified :substring.
 * Returns an error message if there was an issue with the database query or if no songs are found.
 */
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

/**
 * This route handles GET requests to the '/music/songs/search/begin/:substring' endpoint.
 * 
 * @returns A JSON response containing a list of songs whose titles contain the specified :substring.
 * Returns an error message if there was an issue with the database query or if no songs are found.
 */
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

/**
 * This route handles GET requests to the '/music/songs/search/year/:year' endpoint.
 * 
 * @returns A JSON response containing a list of songs from the specified :year.
 * Returns an error message if the year is not a number, if there was an issue with 
 * the database query, or if no songs are found.
 */
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

/**
 * This route handles GET requests to the '/music/songs/artists/:artistID' endpoint.
 * 
 * @returns A JSON response containing a list of songs by the artist with the specified :artistID,
 * including the associated artist and genre information. Returns an error message if the artist ID is not a number,
 * if there was an issue with the database query, or if no songs are found for the specified artist ID.
 */
app.get('/music/songs/artists/:artistID', async (req, res) => {
  const artistId = req.params.artistID;
  if (isNaN(artistId)) {
    return res.json(jsonMessage(`Invalid input: ${artistId} is not a number`));
  }
  const { data, error } = await supabase
    .from('songs')
    .select('title, artists!inner(artist_id, artist_name)')
    .eq('artist_id', artistId);

   if(error) {
      return res.json(jsonMessage('Error: ' + error.message));
    } else if (!data || data.length === 0)  {
      return res.json(jsonMessage(`Artist ${artistId} not found`));
    }
  res.json(data);
});

/**
 * This route handles GET requests to the '/music/songs/genre/:genreID' endpoint.
 * 
 * @returns A JSON response containing a list of songs in the genre with the specified :genreID,
 * including the associated artist and genre information. Returns an error message if the genre ID is not a number,
 * if there was an issue with the database query, or if no songs are found for the specified genre ID.
 */
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

/**
 * This route handles GET requests to the '/music/playlists' endpoint.
 * 
 * @returns A JSON response containing a list of all playlists in the database.
 *  Returns an error message if there was an issue with the database query.
 */
app.get('/music/playlists', async (req, res) => {
  const { data, error } = await supabase
    .rpc('get_playlists');
  
    if (error) {
    return res.json(jsonMessage('Error: ' + error.message));
  }
  res.json(data);
});

/**
 * This route handles GET requests to the '/music/playlists/:playlistID' endpoint.
 * 
 * @returns A JSON response containing the playlist information for :playlistID, 
 * including the songs in the playlist and their associated artists and genres. 
 * Returns an error message if the playlist ID is invalid, if the
 * playlist is not found, or if there was an issue with the database query.
 */
app.get('/music/playlists/:playlistID', async (req, res) => {
  const playlistId = Number(req.params.playlistID);

  if (isNaN(playlistId)) {
    return res.json(jsonMessage(`Invalid input: ${req.params.playlistID} is not a number`));
  }

  const { data, error } = await supabase
    .from('playlists')
    .select('playlist_id, songs!inner(song_id, title, year, artists!inner(artist_name), genres!inner(genre_name)))')
    .eq('playlist_id', playlistId);

  if (error) {
    return res.json(jsonMessage('Error: ' + error.message));
  } else if (!data || data.length === 0)  {
    return res.json(jsonMessage(`Playlist ${playlistId} not found`));
  }

  res.json(data);
});

/**
 * This route handles GET requests to the '/music/mood/dancing' endpoint.
 * 
 * @returns A JSON response containing the top 20 songs with the highest 
 * danceability score, or an error message if there was an issue with the 
 * database query.
 */
app.get('/music/mood/dancing', async (req, res) => {

  const { data, error } = await supabase
    .from('songs')
    .select('title')
    .order('danceability', { ascending: false})
    .limit(20);

  if (error) {
    return res.json(jsonMessage('Error: ' + error.message));
  }
  res.json(data);
});

/**
 * This route handles GET requests to the '/music/mood/dancing/:ref' endpoint.
 * 
 * @returns A JSON response containing the top 20 or provided :ref songs with the
 * highest danceability score. Default is 20 if :ref is not provided or of range (1-20). 
 * Returns an error message if there was an issue with the database query.
 */
app.get('/music/mood/dancing/:ref', async (req, res) => {
  const ref = Number(req.params.ref);
  let num;
  if (ref >= 1 && ref <= 20) {
    num = ref;
  } else {
    num = 20;
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

/**
 * This route handles GET requests to the '/music/mood/happy' endpoint.
 * 
 * @returns A JSON response containing the top 20 songs with the highest 
 * valence score, or an error message if there was an issue with the 
 * database query.
 */
app.get('/music/mood/happy', async (req, res) => {

  const { data, error } = await supabase
    .from('songs')
    .select('title')
    .order('valence', { ascending: false})
    .limit(20);

  if (error) {
    return res.json(jsonMessage('Error: ' + error.message));
  }
  res.json(data);
});

/**
 * This route handles GET requests to the '/music/mood/happy/:ref' endpoint.
 * 
 * @returns A JSON response containing the top 20 or provided :ref songs 
 * with the highest valence. Default is 20 if :ref is not provided or of 
 * range (1-20). Returns an error message if there was an issue with the
 * database query.
 */
app.get('/music/mood/happy/:ref', async (req, res) => {
  const ref = Number(req.params.ref);
  let num;
  if (ref >= 1 && ref <= 20) {
    num = ref;
  } else {
    num = 20;
  }

  const { data, error } = await supabase
    .from('songs')
    .select('title')
    .order('valence', { ascending: false})
    .limit(num);
  
  if (error) {
    return res.json(jsonMessage('Error: ' + error.message));
  }
  res.json(data);
});

/**
 * This route handles GET requests to the '/music/mood/coffee' endpoint.
 * 
 * @returns A JSON response containing the top 20 songs with the highest 
 * liveness to acousticness ratio, or an error message if there was an issue 
 * with the database query.
 */
app.get('/music/mood/coffee', async (req, res) => {

  const { data, error } = await supabase
    .rpc('get_liveness_acousticness_ratio', { top: 20});

  if (error) {
    return res.json(jsonMessage('Error: ' + error.message));
  }
  res.json(data);
});

/**
 * This route handles GET requests to the '/music/mood/coffee/:ref' endpoint.
 * 
 * @returns A JSON response containing the top 20 or provided :ref songs with
 * the highest liveness to acousticness ratio. Default is 20 if :ref is not
 * provided or of range (1-20). Returns an error message if there was an issue 
 * with the database query.
 */
app.get('/music/mood/coffee/:ref', async (req, res) => {
  const ref = Number(req.params.ref);
  let num;
  if (ref >= 1 && ref <= 20) {
    num = ref;
  } else {
    num = 20;
  }

  const { data, error } = await supabase
    .rpc('get_liveness_acousticness_ratio', { top: num});
  
  if (error) {
    console.error(error);
    return res.json(jsonMessage('Error: ' + error.message));
  }

  res.json(data);
});

/**
 * This route handles GET requests to the '/music/mood/studying' endpoint.
 * 
 * @returns A JSON response containing the top 20 songs with the highest
 * energy to speechiness product, or an error message if there was an issue with
 * the database query.
 */
app.get('/music/mood/studying', async (req, res) => {

  const { data, error } = await supabase
    .rpc('get_energy_speechiness_product', { top: 20});

  if (error) {
    return res.json(jsonMessage('Error: ' + error.message));
  }
  res.json(data);
});

/**
 * This route handles GET requests to the '/music/mood/studying/:ref' endpoint.
 *
 * @returns A JSON response containing the top 20 or provided :ref songs with the
 * highest energy to speechiness product. Default is 20 if :ref is not provided or
 * of range (1-20). Returns an error message if there was an issue with the
 * database query.
 */
app.get('/music/mood/studying/:ref', async (req, res) => {
  const ref = Number(req.params.ref);
  let num;
  if (ref >= 1 && ref <= 20) {
    num = ref;
  } else {
    num = 20;
  }

  const { data, error } = await supabase
    .rpc('get_energy_speechiness_product', { top: num});
  
  if (error) {
    console.error(error);
    return res.json(jsonMessage('Error: ' + error.message));
  }

  res.json(data);
});

/*
 * This starts the server and listens on the specified port. 
 * When the server is running, it will log a message to the 
 * console indicating that it is listening and on which port.
 */
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

/*
references
- https://www.geeksforgeeks.org/web-tech/express-js-req-params-property/
- https://supabase.com/docs/reference/javascript/rpc
- https://www.w3tutorials.net/blog/nodejs-how-to-check-route-parameters/
*/
