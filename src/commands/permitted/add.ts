import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import EmbedResponse, { Emoji } from "../../utilities/EmbedResponse"

const config = require("../../../config.json")

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("add")
		.setDescription("Adds a user to the list of permitted users")
		.addUserOption(option =>
			option.setName("user").setDescription("User to add").setRequired(true)
		),
	execute: async helper => {
		if (helper.interaction.user.id !== config.discord.dev_id) {
			return helper.respond(
				new EmbedResponse(Emoji.BAD, "Only the developer can change permitted users")
			)
		}

		const user = helper.user("user")!
		if (helper.cache.getPermitted().includes(user.id)) {
			return helper.respond(
				new EmbedResponse(Emoji.BAD, "This user is already permitted")
			)
		}

		await helper.cache.addPermitted(user.id)
		helper.respond(new EmbedResponse(Emoji.GOOD, "Added permissions for user to allow and deny messaging"))
	}
} as iInteractionSubcommandFile
