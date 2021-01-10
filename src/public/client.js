// in the store immutable is used for all data that won´t change frequently during the usage
let store = {
	user: Immutable.Map({ name: "Visitor" }),
	rovers: Immutable.List(["Curiosity", "Opportunity", "Spirit"]),
	landing_date: "",
	launch_date: "",
	max_date: "",
	max_sol: 0,
	name: "",
	photos: [],
	status: "",
	total_photos: 0,
	loading: false,
};

// add our markup to the page
const root = document.getElementById("root");

//all updates to the store are made through this function
const updateStore = (store, newState) => {
	store = Object.assign(store, newState);
	render(root, store);
};

const render = async (root, state) => {
	root.innerHTML = App(state);
};

// creates content of the page
const App = () => {
	return `
        <header></header>
        <main>
            ${Greeting(store.user.get("name"))}
            <section>
                <h3>It is time to explore the universe</h3>
				<div class="btn-group">
                    ${store.rovers
											.map(
												(rover) =>
													`<button onclick='handleRoverReq("${rover}")'>${rover}</button>`
											)
											.join("")}
                </div>
                <div>${roverImageFunc()}</div>
            </section>
        </main>
        <footer></footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
	render(root, store);
});

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information
const Greeting = (name) => {
	if (name) {
		return `
            <h1>Welcome, ${name}!</h1>
        `;
	}
	return `
        <h1>Hello!</h1>
    `;
};

const roverImageFunc = () => {
	//checks if any rover data is already available and if date is loading
	if (store.name == "" && store.loading == false) {
		return `<p>Choose a rover and see the latest updates on the mission</p>`;
		//while loading show this
	} else if (store.loading == true) {
		return `<p>Loading...</p>`;
		//if not loading and rover date is here
	} else {
		return `
	<h1>${store.name}</h1>
	<ul>
		<li>Launch date: ${store.launch_date}</li>
		<li>Landing date: ${store.landing_date}</li>
		<li>Mission Status: ${store.status}</li>
		<li>Total fotos through mission: ${store.total_photos}</li>
	</ul>
    ${store[store.name].photos.map((photo) => `<img src="${photo}"/>`).join("")}
    `;
	}
};
// This function handles the onclick event to set the correct variables in the store and initalize the api call
const handleRoverReq = (rover) => {
	updateStore(store, { name: rover, loading: true });
	getRoverManifest(rover);
};

// ------------------------------------------------------ Manipluate Data from APIs
// takes the response and creates an object called after the selected rover and reduces the rest to an array of links
let photosArray = (acc, curr, i) => {
	if (i == 0) {
		acc[curr.rover.name] = {};
		acc[curr.rover.name].photos = [curr.img_src];
	} else {
		acc[curr.rover.name].photos.push(curr.img_src);
	}
	return acc;
};

// ------------------------------------------------------  API CALLS

// Example API call

//this call gets the photos after getRoverManifest() was called succesfully
const getImageOfRovers = (selectedRover, date) => {
	fetch(`http://localhost:3000/rover?sRover=${selectedRover}&date=${date}`)
		.then((res) => res.json())
		.then((res) => {
			let newres = res.photos.reduce(photosArray, {});
			return newres;
		})
		.then((newres) => {
			updateStore(store, newres);
			return newres;
		})
		.then(() => updateStore(store, { loading: false }));
};

// gets the Mission Manifest of selected rover to know what the latest available date for new images is and other mission infos
const getRoverManifest = (selectedRover) => {
	fetch(`http://localhost:3000/manifest?sRover=${selectedRover}`)
		.then((res) => res.json())
		.then((res) => {
			updateStore(store, res.photo_manifest);
			return res;
		})
		.then((res) =>
			getImageOfRovers(res.photo_manifest.name, res.photo_manifest.max_date)
		);
};
