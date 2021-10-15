import { SlashCommandBuilder } from "@discordjs/builders"
import { iInteractionFile } from "../utilities/BotSetupHelper";
import EmbedResponse, { Emoji } from "../utilities/EmbedResponse";

const config = require("../../config.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("deny")
		.setDescription("Make the bot deny messaging to a specific user")
		.addUserOption(option =>
			option
				.setName("user")
				.setDescription("User to deny messaging to")
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("message")
				.setDescription("Message to say when the user is denied messaging")
				.setRequired(true)
		),
	execute: async helper => {
		if (helper.interaction.user.id !== config.discord.dev_id) {
			helper.respond(new EmbedResponse(
				Emoji.BAD,
				"Only the developer can deny messaging"
			))
		}

		const user = helper.user("user", true)!
		const message = helper.string("message", true)!

		if (helper.cache.restrictions.find(r => r.value.user_id === user.id)) {
			return helper.respond(new EmbedResponse(
				Emoji.BAD,
				"This user is already denied messaging"
			))
		}

		const doc = helper.cache.getRestrictionDoc()
		await doc.set({
				id: doc.id,
				user_id: user.id,
				message
			})
		helper.respond(new EmbedResponse(
			Emoji.GOOD,
			"User denied messaging"
		))
	}
} as iInteractionFile