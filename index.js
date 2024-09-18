const SANDBOX = "2408-Bertha-Wang";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${SANDBOX}/events/`;

// #region State
let events = [];

/** Updates state with events from API */
async function getEvents() {
  try {
    // GET the data from the internet at API_URL
    const response = await fetch(API_URL);

    // Wait for the response to be transformed into JSON
    const responseObj = await response.json();

    debugger;
    // always debug here to inspect the shape of the response object
    // received from the API, because every API returns a different thing
    events = responseObj.data;
  } catch (error) {
    console.error(error);
  }
}

/** Requests API to create a new event based on the given `event` */
async function addEvent(event) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      // This is just boilerplate to indicate that
      // I am sending JSON over in my request
      headers: { "Content-Type": "application/json" },

      // The body = data I'm sending turned into a JSON string
      body: JSON.stringify(event),
    });

    // The network request might succeed, but there might be an error
    // with the request that we sent. In that case, `fetch` won't throw
    // an error, but the `response` will be not OK, and we still want
    // to throw an error.
    if (!response.ok) {
      const responseObj = await response.json();
      throw new Error(responseObj.error.message);
    }
  } catch (error) {
    console.error(error);
  }
}

/** Requests the API to update the event */
async function updateEvent(event) {
  try {
    const response = await fetch(API_URL + event.id, {
      method: "PUT",
      // This is just boilerplate to indicate that
      // I am sending JSON over in my request
      headers: { "Content-Type": "application/json" },

      // The body = data I'm sending turned into a JSON string
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const responseObj = await response.json();
      throw new Error(responseObj.error.message);
    }
  } catch (error) {
    console.error(error);
  }
}

/** Requests the API to delete the event with the given `id` */
async function deleteEvent(id) {
  try {
    const response = await fetch(API_URL + id, {
      method: "DELETE",
    });
    if (!response.ok) {
      const responseObj = await response.json();
      throw new Error(responseObj.error.message);
    }
  } catch (error) {
    console.error(error);
  }
}

// #region Render

/** Renders events in state */
function renderEvents() {
  const $recipes = events.map((event) => {
    const $li = document.createElement("li");
    $li.innerHTML = `
      <h2>${event.name}</h2>
      <img src="${event.imageUrl}"/>
      <p>${event.description}</p>
      <button>Delete</button>
    `;

    // Select the button _within_ the $li
    // This allows each button to know which event to delete
    const $button = $li.querySelector("button");
    $button.addEventListener("click", async () => {
      await deleteEvent(event.id);
      await getEvents();
      renderEvents();
    });

    return $li;
  });

  const $ul = document.querySelector("ul");
  $ul.replaceChildren(...$recipes);
}

// #region Script
async function init() {
  await getEvents();
  renderEvents();
}

init();

// Add event with form data when form is submitted
const $form = document.querySelector("form");
$form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // We can use `form.inputName` to reference input elements within the form
  const event = {
    name: $form.title.value,
    description: $form.instructions.value,
    date: $form.date.value,
    location: $form.location.value,
  };

  // Wait for the API to add the event, then fetch the updated data & rerender
  await addEvent(event);
  await getEvents();
  renderEvents();
});