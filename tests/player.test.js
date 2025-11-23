import { Player } from "../src/models/player.js";

describe('Player', () => {
	test('default player is human and has a board', () => {
		const player = new Player();
		expect(player.type).toBe('human');
		expect(player.board).toBeDefined();
	});
});
