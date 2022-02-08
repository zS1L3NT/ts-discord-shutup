import Entry from "../../../data/Entity"
import GuildCache from "../../../data/GuildCache"
import { iSlashSubFile } from "nova-bot"
import { MessageEmbed } from "discord.js"

const file: iSlashSubFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	data: {
		name: "show",
		description: {
			slash: "Shows the list of all permitted users",
			help: "Shows the list of all permitted users"
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
