import { initGame } from "./controller.js";

function bootstrap() {
	initGame("player-grid", "computer-grid");
}

if (typeof document !== "undefined") {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", bootstrap);
	} else {
		bootstrap();
	}
}
