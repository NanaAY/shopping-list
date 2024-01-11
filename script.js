const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clrButton = document.getElementById("clear");

function removeItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    e.target.parentElement.parentElement.remove();
  }
}

function clearAll(e) {
  // for (let item of document.querySelectorAll("li")) {
  //   item.remove();
  // }
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
}

function addItem(e) {
  e.preventDefault();
  //check input
  if (itemInput.value === "") {
    alert("Invalid Item");
    return;
  }
  const newListItem = document.createElement("li");
  newListItem.textContent = itemInput.value;

  const newBtn = createRemoveBtn("remove-item btn-link text-red");
  newListItem.appendChild(newBtn);

  itemList.appendChild(newListItem);
  itemInput.value = "";
}

function createRemoveBtn(btnClass) {
  const newBtn = document.createElement("button");
  newBtn.className = btnClass;
  newBtn.appendChild(createIcon("fa-solid fa-xmark"));
  return newBtn;
}

function createIcon(iconClass) {
  const newIcon = document.createElement("i");
  newIcon.className = iconClass;
  return newIcon;
}
//Event Listeners
itemForm.addEventListener("submit", addItem);
itemList.addEventListener("click", removeItem);
clrButton.addEventListener("click", clearAll);
