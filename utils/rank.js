const RANKS = [
  { name: 'Bronze', min: 0 },
  { name: 'Silver', min: 100 },
  { name: 'Gold', min: 300 },
  { name: 'Diamond', min: 600 },
  { name: 'Master', min: 1000 },
];

const POINT_CORRECT = 10;
const POINT_WRONG = -5;

const getRank = (points) => {
  const idx = RANKS.reduce((acc, r, i) => (points >= r.min ? i : acc), 0);
  const current = RANKS[idx];
  const next = RANKS[idx + 1] || null;
  return {
    name: current.name,
    next: next ? next.name : null,
    pointsToNext: next ? next.min - points : 0,
  };
};

module.exports = { getRank, POINT_CORRECT, POINT_WRONG };