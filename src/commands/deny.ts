import Entry from "../models/Entry"
import GuildCache from "../models/GuildCache"
import { Emoji, iInteractionFile, ResponseBuilder } from "discordjs-nova"

const config = require("../../config.json")

const file: iInteractionFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	data: {
		name: "deny",
		description: {
			slash: "Make the bot deny messaging to a specific user",
			help: [
				"**User must be permitted to use this command**",
				"Deny a user messaging or voice calls server-wide"
			].join("\n")
		},
		options: [
			{
				name: "user",
				description: {
					slash: "User to deny messaging to",
					help: "User to deny messaging to"
				},
				type: "user",
				requirements: [
					"User that:",
					"(1) Me",
					"(2) The developer",
					"(3) Already denied messaging"
				].join("\n"),
				required: true
			},
			{
				name: "message",
				description: {
					slash: "Message to say when the user is denied messaging",
					help: "Message to say when the user is denied messaging"
				},
				type: "string",
				requirements: "Text",
				required: true
			}
		]
	},
	execute: async helper => {
		if (!helper.cache.getPermitted().includes(helper.interaction.user.id)) {
			return helper.respond(
				new ResponseBuilder(Emoji.BAD, "You are not permitted to deny messaging")
			)
		}

		const user = helper.user("user")!
		const message = helper.string("message")!

		if (user.id === config.discord.dev_id || user.id === config.discord.bot_id) {
			return helper.respond(
				new ResponseBuilder(Emoji.BAD, "Cannot deny this user of messaging")
			)
		}

		if (helper.cache.getRestrictions().find(r => r.value.user_id === user.id)) {
			return helper.respond(
				new ResponseBuilder(Emoji.BAD, "This user is already denied messaging")
			)
		}

		const doc = helper.cache.getRestrictionDoc()
		await doc.set({
			id: doc.id,
			user_id: user.id,
			message,
			expires: null
		})
		helper.respond(new ResponseBuilder(Emoji.GOOD, "User denied messaging"))

		const member = await helper.cache.guild.members.fetch(user.id)
		await member.voice.disconnect()
	}
}

export default file
