let store = {
	user: { name: "Student" },
	apod: "",
	rovers: ["Curiosity", "Opportunity", "Spirit"],
	roverImage: "",
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
	let { rovers, apod } = state;

	return `
        <header></header>
        <main>
            ${Greeting(store.user.name)}
            <section>
                <h3>Put things on the page!</h3>
                <div class="btn-group">
                    ${store.rovers
											.map(
												(rover) =>
													`<button onclick='roverImageFunc("${rover}")'>${rover}</button>`
											)
											.join("")}
                </div>
                <p>Here is an example section.</p>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
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

// Example of a pure function that renders infomation requested from the backend
const roverImageFunc = (rover) => {
	// https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
	const o_date = new Intl.DateTimeFormat();
	const f_date = (m_ca, m_it) => Object({ ...m_ca, [m_it.type]: m_it.value });
	const m_date = o_date.formatToParts().reduce(f_date, {});
	const today = m_date.year + "-" + m_date.month + "-" + m_date.day;
	console.log(today);
	/*const photodate = new Date(roverImage.date);
	console.log(photodate.getDate(), today.getDate());
    
    console.log(photodate.getDate() === today.getDate());*/
	getRoverManifest(rover);

	// check if the photo of the day is actually type video!
	return console.log(store);
};
/*const ImageOfTheDay = (apod) => {
	// If image does not already exist, or it is not from today -- request it again
	const today = new Date();
	const photodate = new Date(apod.date);
	console.log(photodate.getDate(), today.getDate());

	console.log(photodate.getDate() === today.getDate());
	if (!apod || apod.date === today.getDate()) {
		getImageOfTheDay(store);
	}

	// check if the photo of the day is actually type video!
	if (apod.media_type === "video") {
		return `
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `;
	} else {
		return `
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `;
	}
};
*/
// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfRovers = (selectedRover, date) => {
	console.log(date);
	console.log(selectedRover);
	fetch(`http://localhost:3000/rover?sRover=${selectedRover}&date=${date}`)
		.then((res) => res.json())
		.then((res) => console.log(res));
	// .then((data) => updateStore(store, { data }));
};

const getRoverManifest = (selectedRover) => {
	fetch(`http://localhost:3000/manifest?sRover=${selectedRover}`)
		.then((res) => res.json())
		.then((res) => {
			console.log(res);
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
