async function signUp(email, password) {
  const { error } = await client.auth.signUp({ email, password });
  if (error) alert(error.message);
  else alert('Check your email to confirm!');
}

async function logIn(email, password) {
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
  else location.reload();
}

async function logOut() {
  await client.auth.signOut();
  location.reload();
}

async function getUser() {
  const { data: { user } } = await client.auth.getUser();
  return user;
}

window.addEventListener("DOMContentLoaded", async () => {
  const user = await getUser();
  const authLinks = document.getElementById('auth-links');

  if (user) {
    authLinks.innerHTML = `<button onclick="logOut()">Log Out</button>`;
  } else {
    authLinks.innerHTML = `
      <input type="email" id="email" placeholder="Email">
      <input type="password" id="password" placeholder="Password">
      <button onclick="logIn(email.value, password.value)">Log In</button>
      <button onclick="signUp(email.value, password.value)">Sign Up</button>
    `;
  }
});
