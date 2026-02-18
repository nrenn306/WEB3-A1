# Node API with Supabase Database 
Web 3 Assignment 1

## Overview
This project is an API built with Node.js that allows users to query Spotify music data. The API retrieves and returns data in JSON format from a cloud-hosted Supabase database.

The dataset contains Spotify hit song data (approximately 2016-2019), including:
- Songs
- Artists
- Genres
- Artist Types
- Playlists

## Built with

**Node Js** - Js runtime
**Express** - Routing
**Render** - For deployment - https://web3-a1-517r.onrender.com/

## API Endpoints

| Route | Description |
|--------|------------|
| /music/artists | Returns all artists sorted by `artist_name`. |
| /music/artists/:artistID | Returns the specified artist by `artist_id`. |
| /music/artists/averages/:artistID | Returns average values (bpm, energy, danceability, loudness, liveness, valence, duration, acousticness, speechiness, popularity) for the specified artist. |
| /music/genres | Returns all genres. |
| /music/songs | Returns all songs sorted by `title`, including nested artist and genre information. |
| /music/songs/sort/:filter | Returns songs sorted by: `id`, `title`, `artist`, `genre`, `year`, or `duration`. |
| /music/songs/:songID | Returns a specific song by `song_id`. |
| /music/songs/search/begin/:substring | Returns songs whose title begins with the provided substring (case-insensitive). |
| /music/songs/search/any/:substring | Returns songs whose title contains the provided substring (case-insensitive). |
| /music/songs/search/year/:year | Returns songs from the specified year. |
| /music/songs/artists/:artistID | Returns all songs for the specified artist. |
| /music/songs/genre/:genreID | Returns all songs for the specified genre. |
| /music/playlists/:playlistID | Returns all songs for the specified playlist. |
| /music/mood/dancing/:ref | Returns top specified songs (max 20) sorted by `danceability` descending. Defaults to 20 if invalid. |
| /music/mood/happy/:ref | Returns top specified songs (max 20) sorted by `valence` descending. |
| /music/mood/coffee/:ref |  Returns top specified songs (max 20)  sorted by `liveness / acousticness` descending. |
| /music/mood/studying/:ref | Returns top specified songs (max 20)  sorted by `energy × speechiness` ascending. |
| /music/mood/dancing| Returns top 20 songs sorted by `danceability` descending. |
| /music/mood/happy| Returns top 20 songs sorted by `valence` descending. |
| /music/mood/studying| Returns top 20 songs sorted by `energy × speechiness` ascending. |
| /music/mood/coffee| Returns top 20 songs sorted by `liveness / acousticness` descending. |

## Test Links

https://web3-a1-517r.onrender.com/music/artists

https://web3-a1-517r.onrender.com/music/artists/129

https://web3-a1-517r.onrender.com/music/artists/sdfjkhsdf

https://web3-a1-517r.onrender.com/music/artists/averages/129

https://web3-a1-517r.onrender.com/music/genres

https://web3-a1-517r.onrender.com/music/songs

https://web3-a1-517r.onrender.com/music/songs/sort/artist

https://web3-a1-517r.onrender.com/music/songs/sort/year

https://web3-a1-517r.onrender.com/music/songs/sort/duration

https://web3-a1-517r.onrender.com/music/songs/1010

https://web3-a1-517r.onrender.com/music/songs/search/begin/love

https://web3-a1-517r.onrender.com/music/songs/search/begin/sdjfhs

https://web3-a1-517r.onrender.com/music/songs/search/any/love

https://web3-a1-517r.onrender.com/music/songs/search/year/2017

https://web3-a1-517r.onrender.com/music/songs/search/year/2027

https://web3-a1-517r.onrender.com/music/songs/artists/149

https://web3-a1-517r.onrender.com/music/songs/artists/7834562

https://web3-a1-517r.onrender.com/music/songs/genre/115

https://web3-a1-517r.onrender.com/music/playlists

https://web3-a1-517r.onrender.com/music/playlists/3

https://web3-a1-517r.onrender.com/music/playlists/35362

https://web3-a1-517r.onrender.com/music/mood/dancing/5

https://web3-a1-517r.onrender.com/music/mood/dancing/500

https://web3-a1-517r.onrender.com/music/mood/dancing/ksdjf

https://web3-a1-517r.onrender.com/music/mood/happy/8

https://web3-a1-517r.onrender.com/music/mood/happy

https://web3-a1-517r.onrender.com/music/mood/coffee/10

https://web3-a1-517r.onrender.com/music/mood/studying/15
