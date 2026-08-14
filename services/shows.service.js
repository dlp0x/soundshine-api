import { query } from '../db/pool.js';

export async function getShows(parentID) {
  return query(`
    SELECT
      s.ID          AS id,
      s.name,
      si.description,
      si.image,
      si.tags
    FROM subcategory s
    INNER JOIN z__subcategory_info si ON si.subcategory_id = s.ID
    WHERE s.parentid = ?
      AND si.is_fake = 0
    ORDER BY s.name ASC
  `, [parentID]);
}

export async function getShowById(id) {
  const [show] = await query(`
    SELECT
      s.ID          AS id,
      s.name,
      si.description,
      si.image,
      si.tags,
      si.curator,
      si.scheduleDay,
      si.scheduleTime
    FROM subcategory s
    INNER JOIN z__subcategory_info si ON si.subcategory_id = s.ID
    WHERE s.ID = ?
      AND si.is_fake = 0
    LIMIT 1
  `, [id]);

  if (!show) return null;

  // history has no `image` column (only songs does) — join back to songs via
  // trackID to recover cover art for each episode.
  const episodes = await query(`
    SELECT
      h.ID,
      h.artist,
      h.title,
      sg.image,
      h.date_played
    FROM history h
    LEFT JOIN songs sg ON sg.ID = h.trackID
    WHERE h.id_subcat = ?
    ORDER BY h.date_played DESC
    LIMIT 20
  `, [id]);

  return { show, episodes };
}
