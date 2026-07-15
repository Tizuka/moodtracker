
const container = document.getElementById("entries-container");

async function loadEntries() {
    try {
        const res = await fetch("/entries");
        const entries = await res.json();

        if (entries.length === 0) {
            container.innerHTML = `<p class ="teste" style="text-align:center; color:gray;">Nenhum entry</p>`;
            return;
        }

        container.innerHTML = "";

        entries.forEach(entry => {
            const dateObj = new Date(entry.createdAt);
            const day = dateObj.getDate();
            const month = dateObj.toLocaleDateString("pt-BR", { month: "long" });
            const year = dateObj.getFullYear();
            const time = dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

            const cardHTML = `
         <div class="entry-card">
                <div class="entry-date">
                    <h1>${day}</h1>
                    <p>${month}</p>
                    <span class="light">${year}</span>
                    <small class="light">${time}</small>
                </div>
                <div class="entry-mood">
                    <img class="image-size" src="images/${entry.mood}.png" alt="${entry.mood}">
                    <h3>${entry.mood}</h3>
                </div>
                <div class="entry-delete">
                    <button onclick="deleteEntry('${entry._id}', this)" > <img class="image-size" src="images/close.png" alt="entry-delete"></button>
                </div>

            </div>
      `;
            container.insertAdjacentHTML("beforeend", cardHTML);
        });

    } catch (error) {
        console.error("Erro ao carregar", error);
        container.innerHTML = `<p style="text-align:center; color:red;">Erro dosregistros.</p>`;
    }
}

async function deleteEntry(id, botaoClicado) {
    if (confirm("Deseja realmente apagar este registro?")) {
        try {
            // Remove o card visualmente 
            const cardHTML = botaoClicado.closest(".entry-card");
            if (cardHTML) cardHTML.remove();

            // Avisa o MongoDB para deletar em segundo plano
            await fetch(`/entries/${id}`, {
                method: "DELETE"
            });

        } catch (error) {
            console.error("Erro ao deletar:", error);
            alert("Erro ao deletar no servidor. Recarregando...");
            loadEntries();
        }
    }
}

loadEntries();