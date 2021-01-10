let store = {
	user: { name: "Visitor" },
	apod: "",
	rovers: ["Curiosity", "Opportunity", "Spirit"],
	activeRover: "",
};

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (store, newState) => {
	store = Object.assign(store, newState);

	render(root, store);
};

const render = async (root, state) => {
	root.innerHTML = App(state);
};

// create content
const App = (state) => {
	return `
        <header></header>
        <main>
            ${Greeting(store.user.name)}
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

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
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
	console.log(store[store.activeRover]);
	if (store.activeRover == "") {
		return `<p>Choose a rover and see the latest updates on the mission</p>`;
	} else if (store[store.activeRover] != undefined) {
		return `
    <h1>${store.activeRover}</h1>
    ${store[store.activeRover].photos
			.map((photo) => `<img src="${photo}"/>`)
			.join("")}
    `;
	}
};
// Example of a pure function that renders infomation requested from the backend
const handleRoverReq = (rover) => {
	updateStore(store, { activeRover: rover });
	getRoverManifest(rover);
};
/*`
    <h1>${store[Object.keys(res)[0]]}</h1>
    <h1>Hello</h1>
    
    `;*/
// ------------------------------------------------------ Manipluate Data from APIs
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
const getImageOfRovers = (selectedRover, date) => {
	console.log(date);
	console.log(selectedRover);
	fetch(`http://localhost:3000/rover?sRover=${selectedRover}&date=${date}`)
		.then((res) => res.json())
		.then((res) => {
			console.log(res);
			let newres = res.photos.reduce(photosArray, {});
			return newres;
		})
		.then((newres) => {
			updateStore(store, newres);
			console.log(newres);
			return newres;
		})
		.then((newres) => roverImageFunc(newres));
};

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
	// .then((data) => updateStore(store, { data }));
};
/*
const getImageOfTheDay = (state) => {
	let { apod } = state;

	fetch(`http://localhost:3000/apod`)
		.then((res) => res.json())
		.then((apod) => updateStore(store, { apod }));

	return data; */
