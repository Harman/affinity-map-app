let body = document.querySelector("body");
let grid = document.querySelector(".grid");
let selectMain = document.querySelector(".tag-main");
let addBtn = document.querySelector(".addBtn");
let deleteBtn = document.querySelector(".deleteBtn");
let infoBtn = document.querySelector(".infoBtn");
let grpHighlightBtn = document.querySelector(".grp-highlights");

let addBtnState = false;
let deleteBtnState = false;
let modalVisible = false;
let uid = new ShortUniqueId();
let colors = {
  pink: "#F8485E",
  blue: "#78DEC7",
  green: "#71EFA3",
  orange: "#FDE49C",
  purple: "#B980F0",
};

let allTags = {};
let allBuckets = {};

if (!localStorage.getItem("tasks")) {
  localStorage.setItem("tasks", JSON.stringify([]));
  localStorage.setItem("buckets", JSON.stringify({}));
} else {
  loadTasks();
}

fillTags();

attachEventListners();

function attachEventListners() {
  grpTaskEvent();
  selectMainEvent();
  deleteBtnEvents();
  addBtnEvents();
  infoBtnEvent();
}

function grpTaskEvent() {
  grpHighlightBtn.addEventListener("click", function () {
    let grpModal = document.createElement("div");
    grpModal.classList.add("grp-modal");
  });
}

function selectMainEvent() {
  selectMain.addEventListener("change", function (e) {
    let tickets = document.querySelectorAll(".ticket");
    let currValue = e.currentTarget.value;
    for (let i = 0; i < tickets.length; i++) {
      let tktGrp = tickets[i].querySelector(".ticket-grp").innerText;
      if (currValue == "all" || currValue == tktGrp) {
        tickets[i].style.display = "block";
      } else {
        tickets[i].style.display = "none";
      }
    }
  });
}

function infoBtnEvent() {
  infoBtn.addEventListener("click", function () {
    let infoModal = document.createElement("div");
    infoModal.classList.add("info-modal");
    infoModal.innerHTML = `<div class="info-area">
    <b style="font-size: larger; ">Instrustions</b>
    <p>These the basic instructions on how to use this app</p>
    <div>
        <ul>
            <li>Clicking this icon <span class="material-icons"> description </span> opens a new modal which can be used to create new highlights.</li>
            <li>Clicking this icon <span class="material-icons"> delete </span> activates the delete option and clicking on any highlight will delete that highlight.</li>
            <li>Highlights can also be sorted according to their tags(can be seen on top of each highlight) using the dropdown menu</li>
            <li>New Tags are automatically added when creating the highlight, unique ids and tags are uneditable</li>
            <li>Highlights' textual content itself is editable and all changes made are saved automatically.</li>
            <li>The highlights are stored in local storage, therefore are availabe even after reloading the website</li>
        </ul>
    </div>
</div>
<div class="d2">
    <button type="button" class="btn btn-dark infoBtn">
        Close
      </button>
</div>`;
    let closeBtn = infoModal.querySelector(".d2 > button");
    closeBtn.addEventListener("click", function () {
      infoModal.remove();
    });

    body.appendChild(infoModal);
  });
}

function deleteBtnEvents() {
  deleteBtn.addEventListener("click", function (e) {
    if (modalVisible) return;
    if (deleteBtnState) {
      deleteBtnState = false;
      e.currentTarget.classList.remove("selected-state");
    } else {
      deleteBtnState = true;
      e.currentTarget.classList.add("selected-state");
    }
  });
}

function addBtnEvents() {
  addBtn.addEventListener("click", function (e) {
    if (modalVisible) return;

    if (deleteBtn.classList.contains("selected-state")) {
      deleteBtnState = false;
      deleteBtn.classList.remove("selected-state");
    }

    e.currentTarget.classList.add("selected-state");

    let modal = document.createElement("div");
    modal.classList.add("modal-container");
    modal.setAttribute("click-first", true);
    modal.innerHTML = `<div class="text-area" contenteditable>Enter Your Task Here</div>
                <div class="side-area">
                    <div class="tag-area"><input type="text" id="modal-tag-input" placeholder="Enter Tag name" aria-label="Username" aria-describedby="basic-addon1">
                    </div>
                    <div class="color-area">
                        <div class="color-tag pink"></div>
                        <div class="color-tag green"></div>
                        <div class="color-tag blue"></div>
                        <div class="color-tag orange"></div>
                        <div class="color-tag purple"></div>
                        <div class="submit-tag" style="display: flex;">
                            <button type="button" class="btn btn-light btn-sm doneBtn" style="margin-right: 4px;">Submit</button>
                            <button type="button" class="btn btn-light btn-sm closeBtn" style="margin-right: 4px;">Close</button>
                        </div>
                    </div>`;

    let closeBtn = modal.querySelector(".closeBtn");
    closeBtn.addEventListener("click", function () {
      document.querySelector(".addBtn").classList.remove("selected-state");
      modal.remove();
      modalVisible = false;
    });

    let allColorTags = modal.querySelectorAll(".color-tag");
    for (let i = 0; i < allColorTags.length; i++) {
      allColorTags[i].addEventListener("click", function (e) {
        for (let j = 0; j < allColorTags.length; j++) {
          allColorTags[j].classList.remove("active-color");
        }
        e.currentTarget.classList.add("active-color");
      });
    }

    let t_area = modal.querySelector(".text-area");
    t_area.addEventListener("click", function (e) {
      if (modal.getAttribute("click-first") == "true") {
        t_area.innerHTML = "";
        modal.setAttribute("click-first", false);
      }
    });

    let doneBtn = modal.querySelector(".doneBtn");
    doneBtn.addEventListener("click", function () {
      let area = modal.querySelector(".text-area");
      let task = area.innerText;
      let taginp = modal.querySelector("#modal-tag-input");
      let group = taginp.value;
      let selectedColor = modal.querySelector(".active-color");
      let color = selectedColor.classList[1];
      let id = uid();

      let ticket = document.createElement("div");
      ticket.classList.add("ticket");
      ticket.innerHTML = `<div class="ticket ${color}">
              <div class="ticket-grp">${group}</div>
              <div class="ticket-id">#${id}</div>
              <div class="ticket-box" contenteditable>${task}</div>
          </div>`;

      //updating tags
      allTags[group] = group;
      fillTags();

      //Saving to local storage
      saveTicketInLocalStorage(id, color, group, task, "grid");

      let ticketWritingArea = ticket.querySelector(".ticket-box");
      ticketWritingArea.addEventListener("input", ticketWritingAreaEvent);

      ticket.addEventListener("click", ticketDeleteEvent);

      document.querySelector(".addBtn").classList.remove("selected-state");
      grid.appendChild(ticket);
      modal.remove();
      modalVisible = false;
    });

    body.appendChild(modal);
    modalVisible = true;
  });
}

function saveTicketInLocalStorage(id, color, group, task, bucket) {
  let reqObj = { id, color, group, task, bucket };
  let taskArr = JSON.parse(localStorage.getItem("tasks"));
  taskArr.push(reqObj);
  localStorage.setItem("tasks", JSON.stringify(taskArr));
}

function ticketWritingAreaEvent(e) {
  let currId = e.currentTarget.parentElement
    .querySelector(".ticket-id")
    .innerText.split("#")[1];
  let taskArr = JSON.parse(localStorage.getItem("tasks"));
  let reqIndex = -1;
  for (let i = 0; i < taskArr.length; i++) {
    if (taskArr[i].id == currId) {
      reqIndex = i;
      break;
    }
  }
  taskArr[reqIndex].task = e.currentTarget.innerText;
  localStorage.setItem("tasks", JSON.stringify(taskArr));
}

function ticketDeleteEvent(e) {
  if (deleteBtnState) {
    e.currentTarget.remove();
    let currId = e.currentTarget
      .querySelector(".ticket-id")
      .innerText.split("#")[1];
    let taskArr = JSON.parse(localStorage.getItem("tasks"));

    taskArr = taskArr.filter(function (el) {
      return el.id != currId;
    });

    localStorage.setItem("tasks", JSON.stringify(taskArr));
  }
}

function loadTasks() {
  let buckets = JSON.parse(localStorage.getItem("buckets"));
  allBuckets = buckets;
  renderBuckets();
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  let prevTags = {};
  for (let i = 0; i < tasks.length; i++) {
    let id = tasks[i].id;
    let color = tasks[i].color;
    let task = tasks[i].task;
    let group = tasks[i].group;
    let bucket = tasks[i].bucket;

    prevTags[group] = group;

    let ticket = document.createElement("div");
    ticket.classList.add("ticket");
    ticket.innerHTML = `<div class="ticket ${color}">
              <div class="ticket-grp">${group}</div>
              <div class="ticket-id">#${id}</div>
              <div class="ticket-box" contenteditable>${task}</div>
          </div>`;

    let ticketWritingArea = ticket.querySelector(".ticket-box");
    ticketWritingArea.addEventListener("input", ticketWritingAreaEvent);

    ticket.addEventListener("click", ticketDeleteEvent);

    if (bucket != "grid") {
      let mybuck = document.getElementsByClassName(bucket);
      mybuck.appendChild(ticket);
    } else {
      grid.appendChild(ticket);
    }
  }
  allTags = prevTags;
}

function fillTags() {
  let children = selectMain.children;
  for (let i = 1; i < children.length; i++) {
    children[i].remove();
  }

  let keys = Object.keys(allTags);

  keys.forEach((key, index) => {
    let op = document.createElement("option");
    op.innerText = key;
    op.value = key;
    selectMain.appendChild(op);
  });
}

function renderBuckets() {
  let keys = Object.keys(allBuckets);
  keys.forEach((key, index) => {
    let buck = document.createElement("div");
    buck.classList.add("bucket");
    buck.classList.add(key);
    buck.innerHTML = `<div class="buck-heading">${allBuckets[key]}</div>
          <div class="buck-cont"></div>`;

    grid.appendChild(buck);
  });
}
