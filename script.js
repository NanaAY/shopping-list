const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clrButton = document.getElementById("clear");
const filterInput = document.getElementById("filter");
const formBtn = itemForm.querySelector("button");
let isEditMode = false;

function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target);
  } else if (e.target.tagName === "LI") {
    itemToEdit(e.target);
  }
}

function itemToEdit(item) {
  isEditMode = true;
  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));
  item.classList.add("edit-mode");
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = "#228822";
  itemInput.value = item.textContent;
}

function removeItem(item) {
  item.parentElement.parentElement.remove();
  removeItemFromStorage(item.parentElement.parentElement.textContent);
  checkState();
}

function clearAll(e) {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  localStorage.clear();
  checkState();
}

function displayItems() {
  const itemsStored = getItemFromStorage();
  if (itemsStored != []) {
    itemsStored.forEach((item) => addItemToDOM(item));
  }
  checkState();
}

function addItemOnSubmit(e) {
  e.preventDefault();
  const newListInput = itemInput.value;
  //check input
  if (newListInput === "") {
    alert("Invalid Item");
    return;
  }

  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove(".edit-mode");
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkDuplicates(newListInput)) {
      alert("Item is a duplicate!");
      return;
    }
  }

  addItemToDOM(newListInput);
  addItemToStorage(newListInput);
  checkState();
}

function addItemToDOM(item) {
  const ListItem = document.createElement("li");
  ListItem.textContent = item;

  const newBtn = createRemoveBtn("remove-item btn-link text-red");
  ListItem.appendChild(newBtn);

  itemList.appendChild(ListItem);
  itemInput.value = "";
}

function addItemToStorage(item) {
  //gets items from storage, adds new items, converts back to string and puts into local storage under the key "items"
  const itemsInStorage = getItemFromStorage();

  itemsInStorage.push(item); //add new item to the array
  localStorage.setItem("items", JSON.stringify(itemsInStorage)); //converting array back to string and adding it to local storage
}

function removeItemFromStorage(item) {
  console.log(item);
  let itemsInStorage = getItemFromStorage();
  itemsInStorage = itemsInStorage.filter((i) => i !== item);
  localStorage.setItem("items", JSON.stringify(itemsInStorage));
}

function getItemFromStorage() {
  //returns array of items from storage
  let itemArray;
  // checking if any items are already stored
  if (localStorage.getItem("items") === null) {
    itemArray = []; //initialize empty array if theres nothing stored
  } else {
    itemArray = JSON.parse(localStorage.getItem("items")); //if there are items stored, retrieve, convert into array and assign to itemArray
  }
  return itemArray;
}

function checkDuplicates(item) {
  const itemsInStorage = getItemFromStorage();
  return itemsInStorage.includes(item);
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

function checkState() {
  itemInput.value = "";
  const listItems = itemList.querySelectorAll("li");

  //hiding the filter input and clear all button if theres not items
  if (listItems.length === 0) {
    clrButton.classList.add("hide");
    filterInput.classList.add("hide");
  } else {
    clrButton.classList.remove("hide");
    filterInput.classList.remove("hide");
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = "#333";
}

function filterItems(e) {
  const listItems = itemList.querySelectorAll("li");
  const filterTextInput = e.target.value.toLowerCase(); //retrieve whats typed in the filter input and convert to lowercase

  //loop through list of items and compare name of item with whats typed into the filter input
  listItems.forEach((item) => {
    const itemName = item.textContent.toLowerCase(); //get the name of item and convert to lowercase
    if (itemName.indexOf(filterTextInput) === -1) {
      //comparing name of item and filter input to see if any letters match. if they dont hide
      item.style.display = "none";
    } else {
      item.style.display = "flex";
    }
  });
}

function init() {
  //Event Listeners
  itemForm.addEventListener("submit", addItemOnSubmit);
  itemList.addEventListener("click", onClickItem);
  clrButton.addEventListener("click", clearAll);
  filterInput.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);

  checkState();
}

init();
