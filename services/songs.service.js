import { query } from '../db/pool.js';

// `history` has no `image` column (only `songs` does) — join back via
// trackID to recover cover art, same issue as shows.service.js episodes.
export async function getNowPlaying() {
  const rows = await query(`
    SELECT h.artist, h.title, sg.image, h.date_played
    FROM history h
    LEFT JOIN songs sg ON sg.ID = h.trackID
    ORDER BY h.date_played DESC
    LIMIT 1
  `);
  return rows[0] || null;
}

export async function getHistory(limit = 10) {
  return query(`
    SELECT h.artist, h.title, sg.image, h.date_played
    FROM history h
    LEFT JOIN songs sg ON sg.ID = h.trackID
    ORDER BY h.date_played DESC
    LIMIT ?
  `, [limit]);
}

export async function getTopTracks(limit = 10) {
  return query(`
    SELECT ID, artist, title, image, count_played
    FROM songs
    WHERE enabled = 1
    AND id_subcat IN (30, 35, 38, 39, 40)
    ORDER BY count_played DESC
    LIMIT ?
  `, [limit]);
}

export async function searchSongs(searchQuery) {
  const like = `%${searchQuery}%`;
  return query(`
    SELECT ID, artist, title, image
    FROM songs
    WHERE enabled   = 1
      AND id_subcat IN (30, 35, 38, 39, 40)
      AND (artist LIKE ? OR title LIKE ?)
    ORDER BY artist ASC, title ASC
    LIMIT 10
  `, [like, like]);
}
