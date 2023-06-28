// document.querySelector("#content").style.display = 'block';
// document.querySelector("#twiliDebugSelector").style.display = 'block'

window.addEventListener("message", function (event) {
	// console.log("test");
	const data = event.data;
	const callback = data.callback;

	if (callback != undefined) {
		const func = window[callback.type];
		if (func != undefined) {
			func(callback.data);
		}
	}
});

function post(type, data) {
	try {
		fetch(`https://${GetParentResourceName()}/${type}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=UTF-8",
			},
			body: JSON.stringify(data),
		});
	} catch { }
}

function toggle(value) {
	document.querySelector("#content").style.display = value ? "block" : "none";
}

function setFocus(value) {
	document.querySelector("#twiliDebugSelector").style.display = value
		? "block"
		: "none";
}

function updateText(data) {
	// console.log("test2");
	for (var x in data) {
		const val = data[x];
		const element = document.querySelector(`#${x}`);

		if (element != undefined) {
			element.innerHTML = val;
		}
	}
}