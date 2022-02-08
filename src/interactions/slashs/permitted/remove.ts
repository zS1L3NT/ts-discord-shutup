import config from "../../../config.json"
import Entry from "../../../data/Entity"
import GuildCache from "../../../data/GuildCache"
import { Emoji, iSlashSubFile, ResponseBuilder } from "nova-bot"

const file: iSlashSubFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	data: {
		name: "remove",
		description: {
			slash: "Removess a user from the list of permitted users",
			help: "Removess a user from the list of permitted users"
		},
		options: [
			{
				name: "user",
				description: {
					slash: "The user to remove",
					help: "The user to remove"
				},
				type: "user",
				requirements: "User in the server",
				required: true
			}
		]
	},
	execute: async helper => {
		if (helper.interaction.user.id !== config.discord.dev_id) {
			return helper.respond(
				new ResponseBuilder(Emoji.BAD, "Only the developer can change permitted users")
			)
		}

		const user = helper.user("user")!
		if (!helper.cache.getPermitted().includes(user.id)) {
			return helper.respond(new ResponseBuilder(Emoji.BAD, "This user is not permitted"))
		}

		if (user.id === config.discord.dev_id) {
			return helper.respond(
				new ResponseBuilder(Emoji.BAD, "Cannot remove developer permissions")
			)
		}

		await helper.cache.removePermitted(user.id)
		helper.respond(
			new ResponseBuilder(
				Emoji.GOOD,
				"Removed permissions for user to allow and deny messaging"
			)
		)
	}
}

export default file
