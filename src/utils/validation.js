export function validateWishForm(data) {
  const errors = {}

  if (!data.name?.trim()) {
    errors.name = 'Name is required'
  }

  if (!data.message?.trim()) {
    errors.message = 'Message is required'
  } else if (data.message.length > 1000) {
    errors.message = 'Message must be less than 1000 characters'
  }

  if (data.twitter?.trim() && !data.twitter.match(/^[A-Za-z0-9_]{1,15}$/)) {
    errors.twitter = 'Invalid Twitter handle'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
