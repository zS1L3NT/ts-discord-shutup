import { SlashCommandBuilder } from "@discordjs/builders"
import { iInteractionFile } from "../utilities/BotSetupHelper"
import EmbedResponse, { Emoji } from "../utilities/EmbedResponse"

const config = require("../../config.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("deny")
		.setDescription("Make the bot deny messaging to a specific user")
		.addUserOption(option =>
			option.setName("user").setDescription("User to deny messaging to").setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("message")
				.setDescription("Message to say when the user is denied messaging")
				.setRequired(true)
		),
	execute: async helper => {
		if (!helper.cache.getPermitted().includes(helper.interaction.user.id)) {
			return helper.respond(
				new EmbedResponse(Emoji.BAD, "You are not permitted to deny messaging")
			)
		}

		const user = helper.user("user")!
		const message = helper.string("message")!

		if (user.id === config.discord.dev_id || user.id === config.discord.bot_id) {
			return helper.respond(
				new EmbedResponse(Emoji.BAD, "Cannot deny this user of messaging")
			)
		}

		if (helper.cache.getRestrictions().find(r => r.value.user_id === user.id)) {
			return helper.respond(
				new EmbedResponse(Emoji.BAD, "This user is already denied messaging")
			)
		}

		const doc = helper.cache.getRestrictionDoc()
		await doc.set({
			id: doc.id,
			user_id: user.id,
			message,
			expires: null
		})
		helper.respond(new EmbedResponse(Emoji.GOOD, "User denied messaging"))

		const member = await helper.cache.guild.members.fetch(user.id)
		await member.voice.disconnect()
	}
} as iInteractionFile
