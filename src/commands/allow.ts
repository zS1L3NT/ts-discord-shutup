import Entry from "../models/Entry"
import GuildCache from "../models/GuildCache"
import { Emoji, iInteractionFile, ResponseBuilder } from "discordjs-nova"

const file: iInteractionFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	data: {
		name: "allow",
		description: {
			slash: "Make the bot allow messaging to a specific user",
			help: [
				"**User must be permitted to use this command**",
				"Allow a user messaging and voice calls again"
			].join("\n")
		},
		options: [
			{
				name: "user",
				description: {
					slash: "User to allow messaging to",
					help: "User to allow messaging to"
				},
				type: "user",
				requirements: "User that is denied messaging",
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
		const restriction = helper.cache.getRestrictions().find(r => r.value.user_id === user.id)

		if (!restriction) {
			return helper.respond(
				new ResponseBuilder(Emoji.BAD, "This user is not denied messaging")
			)
		}

		await helper.cache.getRestrictionDoc(restriction.value.id).delete()
		helper.respond(new ResponseBuilder(Emoji.GOOD, "User allowed messaging"))
	}
}

export default file
