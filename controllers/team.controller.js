import { getTeam, getMemberById } from '../services/team.service.js';

export async function team(req, res) {
  const data = await getTeam();
  res.json({ team: data });
}

export async function memberDetails(req, res) {
  const id = parseInt(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'id must be a valid integer' });
  }

  const data = await getMemberById(id);
  if (!data) return res.status(404).json({ error: 'Member not found' });
  res.json(data);
}
