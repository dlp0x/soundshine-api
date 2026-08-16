import { query } from '../db/pool.js';

export async function getPosts(limit = 10) {
  // mysql2's server-side prepared statements (pool.execute()) throw
  // "Incorrect arguments to mysqld_stmt_execute" (errno 1210) when LIMIT
  // is passed as a bound `?` parameter against this MySQL 8.4 server.
  // The value is already validated/clamped by the caller (blog.controller.js),
  // but clamp again defensively here since this is inlined directly into
  // the SQL string rather than bound.
  const safeLimit = Math.max(0, Math.min(Number.parseInt(limit, 10) || 10, 50));

  return query(`
    SELECT
      p.id,
      p.title,
      p.slug,
      p.content,
      p.featured_image,
      p.date_posted,
      p.post_type,
      p.is_featured,
      u.nice_nickname,
      u.avatar
    FROM z__posts p
    LEFT JOIN z__users u ON p.posted_by = u.id
    WHERE p.is_fake = 0
    ORDER BY p.date_posted DESC
    LIMIT ${safeLimit}
  `);
}

export async function getPostBySlug(slug) {
  const rows = await query(`
    SELECT
      p.id,
      p.title,
      p.slug,
      p.content,
      p.featured_image,
      p.date_posted,
      p.post_type,
      p.category_id,
      p.tag_id,
      u.nice_nickname,
      u.avatar,
      u.bio,
      u.job_title
    FROM z__posts p
    LEFT JOIN z__users u ON p.posted_by = u.id
    WHERE p.slug   = ?
      AND p.is_fake = 0
    LIMIT 1
  `, [slug]);

  return rows[0] || null;
}
