import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import { MessageEmbed } from "discord.js"
import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("show")
		.setDescription("Adds a user to the list of permitted users"),
	execute: async helper => {
		helper.respond({
			embeds: [
				new MessageEmbed().setTitle("Permitted users").setDescription(
					"List of users who can allow and deny other users from messaging:\n" +
						helper.cache
							.getPermitted()
							.map(id => `<@!${id}>`)
							.join("\n")
				)
			]
		})
	}
} as iInteractionSubcommandFile
