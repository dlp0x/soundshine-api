import { query } from '../db/pool.js';

export async function getEvents(catID) {
  return query(`
    SELECT
      e.ID   AS id,
      e.name,
      e.day,
      e.time,
      ei.image,
      ei.tags
    FROM events e
    INNER JOIN z__events_info ei ON ei.event_id = e.ID
    WHERE e.catID   = ?
      AND e.is_fake = 0
    ORDER BY e.date ASC, e.time ASC
  `, [catID]);
}

export async function getSchedule(day, catID) {
  // events.day stores one or more concatenated tokens like "&1&2&3" (see
  // Texter::test_replace / convertDate on the rewindRadio site, which
  // already parse this same "&1".."&6", "&0" = Mon..Sat, Sun format). A
  // single event can span multiple days, so this must be a substring
  // match, not equality.
  return query(`
    SELECT
      e.ID   AS id,
      e.name,
      e.time,
      ei.image,
      ei.tags
    FROM events e
    INNER JOIN z__events_info ei ON ei.event_id = e.ID
    WHERE e.day     LIKE CONCAT('%', ?, '%')
      AND e.catID   = ?
      AND e.is_fake = 0
    ORDER BY e.time ASC
  `, [day, catID]);
}
