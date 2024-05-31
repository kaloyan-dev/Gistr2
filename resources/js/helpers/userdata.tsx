const name = document.querySelector('[name = "name"]')?.getAttribute('content')
const username = document
  .querySelector('[name = "username"]')
  ?.getAttribute('content')
const avatar = document
  .querySelector('[name = "avatar"]')
  ?.getAttribute('content')
const anonymous = document
  .querySelector('[name = "anonymous"]')
  ?.getAttribute('content')

export { name, username, avatar, anonymous }
