import Entry from "../../models/Entry"
import GuildCache from "../../models/GuildCache"
import { Emoji, iInteractionSubcommandFile, ResponseBuilder } from "discordjs-nova"

const config = require("../../../config.json")

const file: iInteractionSubcommandFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	data: {
		name: "add",
		description: {
			slash: "Adds a user to the list of permitted users",
			help: [
				"**Only the developer can use this command**",
				"Adds a user to the list of permitted users"
			].join("\n")
		},
		options: [
			{
				name: "user",
				description: {
					slash: "User to add",
					help: "The user to add"
				},
				type: "user",
				requirements: "User that isn't yet permitted",
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
