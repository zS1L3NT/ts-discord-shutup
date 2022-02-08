import Entry from "../../data/Entity"
import GuildCache from "../../data/GuildCache"
import { Emoji, iSlashFile, ResponseBuilder } from "nova-bot"

const file: iSlashFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	data: {
		name: "allow",
		description: {
			slash: "Make the bot allow messaging to a specific user",
			help: "Make the bot allow messaging to a specific user"
		},
		options: [
			{
				name: "user",
				description: {
					slash: "User to allow messaging to",
					help: "User to allow messaging to"
				},
				type: "user",
				requirements: "User in the server",
				required: true
			}
		]
	},
	execute: async helper => {
		if (!helper.cache.getPermitted().includes(helper.interaction.user.id)) {
			return helper.respond(
				new ResponseBuilder(Emoji.BAD, "You are not permitted to allow messaging")
			)
		}

		const user = helper.user("user")!
		const restriction = helper.cache.getRestrictions().find(r => r.user_id === user.id)

		if (!restriction) {
			return helper.respond(
				new ResponseBuilder(Emoji.BAD, "This user is not denied messaging")
			)
		}

		await helper.cache.getRestrictionDoc(restriction.id).delete()
		helper.respond(new ResponseBuilder(Emoji.GOOD, "User allowed messaging"))
	}
}

export default file
