const STORAGE_KEY = 'nirvana-wishes'

export function getLocalWishes() {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveLocalWish(wish) {
  const wishes = getLocalWishes()
  wishes.unshift(wish)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes))
}
