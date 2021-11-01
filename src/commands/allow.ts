import { SlashCommandBuilder } from "@discordjs/builders"
import { iInteractionFile } from "../utilities/BotSetupHelper"
import EmbedResponse, { Emoji } from "../utilities/EmbedResponse"

const config = require("../../config.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("allow")
		.setDescription("Make the bot allow messaging to a specific user")
		.addUserOption(option =>
			option.setName("user").setDescription("User to allow messaging to").setRequired(true)
		),
	execute: async helper => {
		if (!helper.cache.getPermitted().includes(helper.interaction.user.id)) {
			return helper.respond(
				new EmbedResponse(Emoji.BAD, "You are not permitted to allow messaging")
			)
		}

		const user = helper.user("user")!
		const restriction = helper.cache.getRestrictions().find(r => r.value.user_id === user.id)

		if (!restriction) {
			return helper.respond(new EmbedResponse(Emoji.BAD, "This user is not denied messaging"))
		}

		await helper.cache.getRestrictionDoc(restriction.value.id).delete()
		helper.respond(new EmbedResponse(Emoji.GOOD, "User allowed messaging"))
	}
} as iInteractionFile
