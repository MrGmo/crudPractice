const update = document.querySelector("#update-button");

const deleteButton = document.querySelector("#delete-button");

const messageDiv = document.querySelector("#message");

update.addEventListener("click", () => {
  fetch("/quotes", {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Darth Vadar",
      quote: "I find your lack of faith disturbing.",
    }),
  })
    .then(response => {
      if (response.ok) return response.json();
    })
    .then(data => {
      console.log(data);
    });
});

deleteButton.addEventListener("click", () => {
  fetch("/quotes", {
    method: "delete",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Darth Vadar",
    }),
  })
    .then(res => {
      if (res.ok) return res.json();
    })
    .then(response => {
      if (response === "No quote to delete") {
        messageDiv.textContent = "No Darth Vadar Quote to Delete";
      } else {
        window.location.reload(true);
      }
    })
    .catch(error => console.error(error));
});
