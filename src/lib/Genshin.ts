import genshin from "genshin-db";

const elementColors = {
	Pyro: "#b7242a",
	Hydro: "#248fbd",
	Anemo: "#2a9d90",
	Electro: "#7553c3",
	Dendro: "#6cae22",
	Cryo: "#7ba6db",
	Geo: "#e5a659",
};

const elementIcons = {
	Pyro: "<:pyro:1003213063199133759>",
	Hydro: "<:hydro:1003213061575954442>",
	Anemo: "<:anemo:1003213059394895922>",
	Electro: "<:electro:1003213057046102037>",
	Dendro: "<:dendro:1003213054634377216>",
	Cryo: "<:cryo:1003213052579164200>",
	Geo: "<:geo:1003213050561699897>",
};

export function stars(item: genshin.Character | genshin.Weapon) 
{
	return "⭐".repeat(parseInt(item.rarity, 10));
}

export function color(char: genshin.Character | string) 
{
	if (typeof char == "string") return elementColors[char];
	return elementColors[char.element];
}

export function icon(char: genshin.Character | string) 
{
	if (typeof char == "string") return elementIcons[char];
	return elementIcons[char.element];
}

export function rarityColor(
	item: genshin.Weapon | genshin.Material | string
): any 
{
	let itemRarity;
	typeof item === "string" ? (itemRarity = item) : (itemRarity = item.rarity);

	switch (itemRarity) 
	{
		case "1":
			return "Grey";
		case "2":
			return "#568666";
		case "3":
			return "#59869e";
		case "4":
			return "#a67dbc";
		case "5":
			return "Gold";
	}
}
