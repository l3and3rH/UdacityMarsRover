// in the store immutable is used for all data that won´t change frequently during the usage
let store = {
	user: Immutable.Map({ name: "Visitor" }),
	rovers: Immutable.List(["Curiosity", "Opportunity", "Spirit"]),
	manifestCollection: undefined,
	loading: false,
	selectedRover: "",
	latest_photos: [],
	ready: false,
};

// add our markup to the page
const root = document.getElementById("root");

//all updates to the store are made through this function
const updateStore = (store, newState) => {
	store = Object.assign(store, newState);
	render(root, store);
};

const render = async () => {
	root.innerHTML = App(store);
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
	getRoverManifest();
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
	if (store.ready == true && store.loading == false) {
		//this checks if the manifest collection ist still not there from the API -> happens if user is really quick
		if (store.manifestCollection == undefined) {
			window.setTimeout(render, 2000);
			return `<p>Loading...</p>`;
		} else {
			const roverData = store.manifestCollection.toJS();
			const rover = roverData.filter(
				(rover) => rover.photo_manifest.name == store.selectedRover
			);
			return `
			<div>${roverDetails(rover[0].photo_manifest)}</div>
			<div>${roverGalarie(store.latest_photos)}</div>
			`;
		}
	} else if (store.loading == true) {
		return `<p>Loading...</p>`;
		//if not loading and rover date is here
	} else {
		return `<p>Choose a rover and see the latest updates on the mission</p>`;
		//while loading show this
	}
};

const roverDetails = (rover) => {
	return `
			<h1>${rover.name}</h1>
			<ul>
				<li>Launch date: ${rover.launch_date}</li>
				<li>Landing date: ${rover.landing_date}</li>
				<li>Mission Status: ${rover.status}</li>
				<li>Total fotos through mission: ${rover.total_photos}</li>
			</ul>
			
			`;
};
const roverGalarie = (photos) => {
	return `${photos
		.map((photo) => `<img src="${photo.img_src}"/><p>${photo.earth_date}</p>`)
		.join("")}`;
};
// This function handles the onclick event to set the correct variables in the store and initalize the api call
const handleRoverReq = (rover) => {
	updateStore(store, { selectedRover: rover, loading: true });
	getImageOfRovers(rover);
};
// ------------------------------------------------------  API CALLS

const getImageOfRovers = (selectedRover) => {
	fetch(`http://localhost:3000/rover?sRover=${selectedRover}`)
		.then((res) => res.json())
		.then((res) => {
			updateStore(store, res);
			return res;
		})
		.then(() => updateStore(store, { loading: false, ready: true }));
};

// gets the Mission Manifest of selected rover to know what the latest available date for new images is and other mission infos
const getRoverManifest = () => {
	const roverArray = store.rovers.map((selectedRover, i) =>
		fetch(
			`http://localhost:3000/manifest?sRover=${selectedRover}`
		).then((res) => res.json())
	);
	Promise.all(roverArray).then((responses) => {
		store.manifestCollection = Immutable.List(responses);
	});
};
