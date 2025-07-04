const pageType = window.location.pathname.includes("sat") ? "sat" : "act";

const sampleVideos = [
  { id: "dQw4w9WgXcQ", title: "Math Trick" },
  { id: "9bZkp7q19f0", title: "Reading Hack" }
];

const sampleQuizzes = [
  { id: "quiz1", question: "2 + 2 = ?", answer: "4" },
  { id: "quiz2", question: "Capital of France?", answer: "Paris" }
];

async function getUserId() {
  const { data: { user } } = await client.auth.getUser();
  return user?.id;
}

async function loadStatus(userId) {
  const { data } = await client.from("progress").select("*").eq("user_id", userId);
  return data;
}

async function toggleStatus(type, id, current) {
  const userId = await getUserId();
  if (!userId) return;

  const { data: existing } = await client.from("progress").select("*")
    .eq("user_id", userId).eq("type", type).eq("resource_id", id).single();

  if (existing) {
    await client.from("progress").update({ is_done: !current }).eq("id", existing.id);
  } else {
    await client.from("progress").insert({ user_id: userId, type, resource_id: id, is_done: true });
  }
  location.reload();
}

window.addEventListener("DOMContentLoaded", async () => {
  const userId = await getUserId();
  const status = userId ? await loadStatus(userId) : [];

  const vidDiv = document.getElementById("videos");
  sampleVideos.forEach(v => {
    const done = status.find(s => s.resource_id === v.id && s.type === "video")?.is_done || false;
    vidDiv.innerHTML += `
      <div>
        <h3>${v.title}</h3>
        <iframe width="300" height="200" src="https://www.youtube.com/embed/${v.id}" frameborder="0"></iframe>
        <button onclick="toggleStatus('video', '${v.id}', ${done})">${done ? "Unmark" : "Mark"} as done</button>
      </div>
    `;
  });

  const quizDiv = document.getElementById("quizzes");
  sampleQuizzes.forEach(q => {
    const done = status.find(s => s.resource_id === q.id && s.type === "quiz")?.is_done || false;
    quizDiv.innerHTML += `
      <div>
        <h3>${q.question}</h3>
        <p><i>(Answer: ${q.answer})</i></p>
        <button onclick="toggleStatus('quiz', '${q.id}', ${done})">${done ? "Unmark" : "Mark"} as done</button>
      </div>
    `;
  });
});
