import Entry from "../../models/Entry"
import GuildCache from "../../models/GuildCache"
import { Emoji, iInteractionSubcommandFile, ResponseBuilder } from "discordjs-nova"

const config = require("../../../config.json")

const file: iInteractionSubcommandFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	data: {
		name: "remove",
		description: {
			slash: "Removes a user from the list of permitted users",
			help: [
				"**Only the developer can use this command**",
				"Removes a user from the list of permitted users"
			].join("\n")
		},
		options: [
			{
				name: "user",
				description: {
					slash: "User to remove",
					help: "The user to remove"
				},
				type: "user",
				requirements: "User that already permitted",
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
