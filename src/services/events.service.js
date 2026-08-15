import { query } from '../db/pool.js';

export async function getEvents(catID) {
  return query(`
    SELECT
      e.ID AS id,
      e.name,
      ei.image,
      ei.tags,
      e.day,
      e.time
    FROM events e
    LEFT JOIN z__events_info ei ON ei.event_id = e.ID
    WHERE e.catID = ?
      AND e.enabled = 1
    ORDER BY e.day ASC, e.time ASC
  `, [catID]);
}

export async function getSchedule(day, catID) {
  return query(`
    SELECT
      e.ID AS id,
      e.name,
      ei.image,
      ei.tags,
      e.time
    FROM events e
    LEFT JOIN z__events_info ei ON ei.event_id = e.ID
    WHERE e.day = ?
      AND e.catID = ?
      AND e.enabled = 1
    ORDER BY e.time ASC
  `, [day, catID]);
}
