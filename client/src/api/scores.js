const API_BASE = '/api';

export async function postScore(data) {
  const res = await fetch(`${API_BASE}/scores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('スコアの登録に失敗しました');
  return res.json();
}

export async function getRanking({ difficulty, mode, limit = 10 }) {
  const params = new URLSearchParams({ difficulty, mode, limit });
  const res = await fetch(`${API_BASE}/scores/ranking?${params}`);
  if (!res.ok) throw new Error('ランキングの取得に失敗しました');
  return res.json();
}
