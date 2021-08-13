let body = document.querySelector("body");
let grid = document.querySelector(".grid");
let selectMain = document.querySelector(".tag-main");
let addBtn = document.querySelector(".addBtn");
let deleteBtn = document.querySelector(".deleteBtn");
let infoBtn = document.querySelector(".infoBtn");
let grpHighlightBtn = document.querySelector(".grp-highlights");
let zoominBtn = document.querySelector(".zoominBtn");
let zoomoutBtn = document.querySelector(".zoomoutBtn");

let minZoom = 0.2;
let maxZoom = 1.7;
let currZoom = 1;

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
} else {
  loadTasks();
}

fillTags();

attachEventListners();

function attachEventListners() {
  zoomEvents();
  grpTaskEvent();
  selectMainEvent();
  deleteBtnEvents();
  addBtnEvents();
  infoBtnEvent();
}

function zoomEvents() {
  zoominBtn.addEventListener("click", function () {
    if (currZoom < maxZoom) {
      currZoom = currZoom + 0.1;
    }
    grid.style.transform = `scale(${currZoom})`;
    grid.style.transformOrigin = "0 0";
    // console.log("in-> ", currZoom);
  });

  zoomoutBtn.addEventListener("click", function () {
    if (currZoom > minZoom) {
      currZoom = currZoom - 0.1;
    }
    grid.style.transform = `scale(${currZoom})`;
    grid.style.transformOrigin = "0 0";
    // console.log("out -> ", currZoom);
  });
}

function grpTaskEvent() {
  grpHighlightBtn.addEventListener("click", function () {
    let grpModal = document.createElement("div");
    grpModal.classList.add("grp-modal");
    grpModal.innerHTML = `<div class="grp-modal-inner">
    <div class="input-group mb-3">
      <button
        class="btn btn-primary sub-grp"
        type="button"
        id="button-addon1"
      >
        Submit
      </button>
      <input
        type="text"
        class="form-control grp-inp"
        placeholder="enter the bucket name"
        aria-label="Example text with button addon"
        aria-describedby="button-addon1"
      />
    </div>
    <button class="btn btn-primary grp-close">Close</button>
  </div>`;

    let grpCloseBtn = grpModal.querySelector(".grp-close");
    grpCloseBtn.addEventListener("click", function () {
      grpModal.remove();
    });

    let subgrpBtn = grpModal.querySelector(".sub-grp");
    subgrpBtn.addEventListener("click", function () {
      let inp = grpModal.querySelector(".grp-inp");
      // console.log(inp.value);
      let buckName = inp.value;
      let buckKey = buckName.split(" ").join("-");
      if (buckName != "") {
        allBuckets[buckKey] = buckName;
        localStorage.setItem("buckets", JSON.stringify(allBuckets));
        inp.value = "";

        let allB = document.querySelectorAll(".bucket");
        if (allB != undefined) {
          for (let i = 0; i < allB.length; i++) allB[i].remove();
        }
        renderBuckets();
        grpModal.remove();
      }
    });

    body.appendChild(grpModal);
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
            <li>Buckets can be created using "Group Highlights" button, Buckets can be resized and required highlights can be dragged and place over them.</li>
            <li><span class="material-icons"> zoom_in </span><span class="material-icons"> zoom_out </span> can be used to zoom in and out of our map.</li>
            <li>To resize the map or buckets use the "Bottom right corner".</li>
            <li>The highlights and buckets are stored in local storage, therefore are availabe even after reloading the website.</li>
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
      ticket.setAttribute("id", id);
      ticket.innerHTML = `<div class="ticket ${color}">
      <div class="ticket-grp">${group}</div>
      <button class="btn btn-secondary ticketMoveBtn"><span class="material-icons">
touch_app
</span></button>
      <div class="ticket-id">#${id}</div>
      <div class="ticket-box" contenteditable>${task}</div>
  </div>`;

      //updating tags
      allTags[group] = group;
      fillTags();

      let tktMovBtn = ticket.querySelector(".ticketMoveBtn");
      //dragging
      dragElement1(ticket, tktMovBtn);

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
  if (!localStorage.getItem("buckets")) {
    localStorage.setItem("buckets", JSON.stringify({}));
  }

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
    ticket.setAttribute("id", id);
    ticket.innerHTML = `<div class="ticket ${color}">
              <div class="ticket-grp">${group}</div>
            
              <button class="btn btn-secondary ticketMoveBtn"><span class="material-icons">
    touch_app
    </span></button>
              <div class="ticket-id">#${id}</div>
              <div class="ticket-box" contenteditable>${task}</div>
          </div>`;

    let ticketWritingArea = ticket.querySelector(".ticket-box");
    ticketWritingArea.addEventListener("input", ticketWritingAreaEvent);

    ticket.addEventListener("click", ticketDeleteEvent);

    let tktMovBtn = ticket.querySelector(".ticketMoveBtn");
    //dragging
    dragElement1(ticket, tktMovBtn);

    // let mybuck = document.querySelector("." + bucket);
    // if (mybuck != undefined && bucket != "grid") {
    //   let buckCont = mybuck.querySelector(".buck-cont");
    //   buckCont.append(ticket);
    // } else {
    grid.appendChild(ticket);
    // }
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
  if (allBuckets == undefined) return;
  let keys = Object.keys(allBuckets);
  keys.forEach((key, index) => {
    let buck = document.createElement("div");
    buck.classList.add("bucket");
    buck.classList.add(key);
    buck.innerHTML = `<div><div class="buck-heading">${allBuckets[key]}</div><button class="btn btn-secondary buckDelBtn"><span class="material-icons">delete</span></button><button class="btn btn-secondary buckMoveBtn"><span class="material-icons">
    touch_app
    </span>
    </button></div>`;
    let del = buck.querySelector(".buckDelBtn");

    del.addEventListener("click", function (e) {
      let v = e.currentTarget.parentElement.parentElement.classList[1];
      removeFromAllB(v);
      buck.remove();
    });

    let movBtn = buck.querySelector(".buckMoveBtn");

    dragElement2(buck, movBtn);

    grid.appendChild(buck);
  });
}

function removeFromAllB(val) {
  allBuckets = Object.keys(allBuckets)
    .filter((key) => key != val)
    .reduce((obj, key) => {
      obj[key] = allBuckets[key];
      return obj;
    }, {});
  localStorage.setItem("buckets", JSON.stringify(allBuckets));
}

function dragElement1(ticket, tktMovBtn) {
  //This part of code was reffered from here :https://javascript.info/mouse-drag-and-drop
  tktMovBtn.onmousedown = function (event) {
    let shiftX = event.clientX - ticket.getBoundingClientRect().left;
    let shiftY = event.clientY - ticket.getBoundingClientRect().top;

    ticket.style.position = "absolute";
    ticket.style.zIndex = 10;
    grid.append(ticket);

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
      ticket.style.left = pageX - shiftX + "px";
      ticket.style.top = pageY - shiftY + "px";
    }

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    grid.addEventListener("mousemove", onMouseMove);

    ticket.onmouseup = function () {
      grid.removeEventListener("mousemove", onMouseMove);
      ticket.onmouseup = null;
    };

    grid.onmouseup = function () {
      grid.removeEventListener("mousemove", onMouseMove);
      ticket.onmouseup = null;
    };
  };

  ticket.ondragstart = function () {
    return false;
  };
}

function dragElement2(buck, moveBtn) {
  //This part of code was reffered from here :https://javascript.info/mouse-drag-and-drop
  moveBtn.onmousedown = function (event) {
    let shiftX = event.clientX - buck.getBoundingClientRect().left;
    let shiftY = event.clientY - buck.getBoundingClientRect().top;

    buck.style.position = "absolute";
    buck.style.zIndex = 7;
    grid.append(buck);

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
      buck.style.left = pageX - shiftX + "px";
      buck.style.top = pageY - shiftY + "px";
    }

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    grid.addEventListener("mousemove", onMouseMove);

    buck.onmouseup = function () {
      grid.removeEventListener("mousemove", onMouseMove);
      buck.onmouseup = null;
    };

    grid.onmouseup = function () {
      grid.removeEventListener("mousemove", onMouseMove);
      buck.onmouseup = null;
    };
  };

  buck.ondragstart = function () {
    return false;
  };
}
