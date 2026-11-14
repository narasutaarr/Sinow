export const ranks = [
  { id: 'bronze', label: 'Bronze', min: 0, color: '#c47a4a' },
  { id: 'silver', label: 'Silver', min: 500, color: '#9aa3b2' },
  { id: 'gold', label: 'Gold', min: 1500, color: '#e8a928' },
  { id: 'diamond', label: 'Diamond', min: 3000, color: '#3aa8e8' },
  { id: 'master', label: 'Master', min: 5000, color: '#3aa8e8' },
]

export const getRank = points => ranks.reduce((acc, r) => (points >= r.min ? r : acc), ranks[0])