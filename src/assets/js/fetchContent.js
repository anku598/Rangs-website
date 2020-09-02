let automotiveLink = document.querySelector('#automotive');
let realestateLink = document.querySelector('#realestate');
let agroLink = document.querySelector('#agro');
let powerLink = document.querySelector('#power');

let linkArray = [automotiveLink, realestateLink, agroLink, powerLink];

linkArray.forEach((eachLink) => {
	eachLink.addEventListener('click', (e) => {
		switch (eachLink) {
			case automotiveLink:
				fetchPage(eachLink, 'automotive.html');
				break;

			case realestateLink:
				fetchPage(eachLink, 'realestate.html');
				break;

			case agroLink:
				fetchPage(eachLink, 'agro.html');
				break;

			case powerLink:
				fetchPage(eachLink, 'power.html');
				break;
		}
	})
})

function fetchPage(link, page) {
	let baseURL = `${window.location.protocol}//${window.location.hostname}`;

	if (window.location.port) {
		baseURL += `:${window.location.port}`;
	}

	fetch(`${baseURL}/${page}`)
		.then(function(response) {
			return response.text()
		})
		.then(function(html) {
			let doc = new DOMParser().parseFromString(html, "text/html");

			anime({
				targets: '.ind-content h1, .ind-content p,',
				translateX: 700,
				opacity: 0,
				easing: 'easeInExpo',
				duration: 700,
				complete: (anim) => {
					//document.querySelector('.column-wrapper').remove();
				}
			})

			setTimeout(function () {
        var textCol = document.getElementById('text-column');
        console.log(textCol);
        textCol.insertBefore(doc.querySelector('.new-content'), textCol.childNodes[0]);
				anime({
					targets: '.new-content .ind-content h1, .new-content .ind-content p',
					translateX: [-600, 0],
					delay: (el, i) => 100 * i,
					opacity: [0, 1],
					easing: 'easeOutExpo',
				})
			}, 700);
		})
}