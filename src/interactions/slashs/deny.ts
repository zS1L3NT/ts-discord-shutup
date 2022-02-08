import config from "../../config.json"
import Entry from "../../data/Entity"
import GuildCache from "../../data/GuildCache"
import { Emoji, iSlashFile, ResponseBuilder } from "nova-bot"

const file: iSlashFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	data: {
		name: "allow",
		description: {
			slash: "Make the bot deny messaging to a specific user",
			help: "Make the bot deny messaging to a specific user"
		},
		options: [
			{
				name: "user",
				description: {
					slash: "User to deny messaging to",
					help: "User to deny messaging to"
				},
				type: "user",
				requirements: "User in the server",
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

		if (helper.cache.getRestrictions().find(r => r.user_id === user.id)) {
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
