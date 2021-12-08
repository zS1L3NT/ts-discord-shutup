import Entry from "../../models/Entry"
import GuildCache from "../../models/GuildCache"
import { iInteractionSubcommandFile } from "discordjs-nova"
import { MessageEmbed } from "discord.js"

const file: iInteractionSubcommandFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	data: {
		name: "show",
		description: {
			slash: "Shows the list of permitted users",
			help: "Show the list of permitted users"
		}
	},
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
}

export default file
