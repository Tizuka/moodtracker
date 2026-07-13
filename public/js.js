let selectedMood = null;
const parent = document.getElementById("parent-id");
// 1. Eu vou adicionar um addevent no pai container,


parent.addEventListener("click", function (e) {
  const button = e.target.closest("button");
  console.log(e);
  //Get the name of the element where the event occurred: target is the image, closest the button
  if (!button) return;
  const allButtons = parent.querySelectorAll("button");
  allButtons.forEach(b => b.classList.remove("active"));
  button.classList.add("active");
});



// 2. dataset da pra salvar data em grupos tipo data-mood data-date, data-color, value eh so value
document.querySelectorAll(".button-mood").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedMood = btn.dataset.mood;
    console.log("Selected mood:", selectedMood);
  });
});

document.querySelector(".btn-submit").addEventListener("click", async (e) => {
  e.preventDefault() //compartamento normal de quando se clica no botao, ai instead vc coloca pra ele fazer a requisicao quando clica 
  if (!selectedMood) {
    alert("Please, select a mood first! ⚠️");
    return;
  }


  try {
    const res = await fetch("/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        //ele manda um objeto de javascript ai vc precisa treaduzir pro mondodb em json
        mood: selectedMood
      })
    });

    const data = await res.json();
    //converte pra objeto js
    console.log(data);

    if (data.status === "success") {
      alert(`Mood "${selectedMood}" saved successfully`);
    }

  } catch (error) {
    console.error("Error saving mood:", error);
    alert("Server error. Could not save mood. ❌");
  }
});

//3.2 se sim, ele manda chamada pro express com o selected mood que foi dado submit