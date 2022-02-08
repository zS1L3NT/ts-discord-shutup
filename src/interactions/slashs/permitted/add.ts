import config from "../../../config.json"
import Entry from "../../../data/Entity"
import GuildCache from "../../../data/GuildCache"
import { Emoji, iSlashSubFile, ResponseBuilder } from "nova-bot"

const file: iSlashSubFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	data: {
		name: "add",
		description: {
			slash: "Adds a user to the list of permitted users",
			help: "Adds a user to the list of permitted users"
		},
		options: [
			{
				name: "user",
				description: {
					slash: "The user to add",
					help: "The user to add"
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
		if (helper.cache.getPermitted().includes(user.id)) {
			return helper.respond(new ResponseBuilder(Emoji.BAD, "This user is already permitted"))
		}

		await helper.cache.addPermitted(user.id)
		helper.respond(
			new ResponseBuilder(
				Emoji.GOOD,
				"Added permissions for user to allow and deny messaging"
			)
		)
	}
}

export default file
