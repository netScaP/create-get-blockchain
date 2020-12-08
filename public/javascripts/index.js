function handleSubmit(event) {
  event.preventDefault()
  const data = {
    walletName: event.target.elements.walletName.value,
    address: event.target.elements.address.value,
  }
  const errorEl = document.getElementById("error")
  if (!data.walletName || data.walletName === "null") {
    errorEl.innerText = "Укажите номер кошелька"
    return false
  }
  if (!data.address || data.address === "null") {
    errorEl.innerText = "Укажите голосуещего"
    return false
  }
  axios
    .post("/", data)
    .then(() => location.reload())
    .catch((err) => {
      errorEl.innerText = err.message
    })
}
const form = document.getElementById("mainForm")
form.addEventListener("submit", handleSubmit)

function remove(index) {
  const errorEl = document.getElementById("error")
  axios
    .delete("/" + index)
    .then(() => location.reload())
    .catch((err) => {
      errorEl.innerText = err.message
    })
}
