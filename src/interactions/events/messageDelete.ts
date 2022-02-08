import BotCache from "../../data/BotCache"
import config from "../../config.json"
import Entry from "../../data/Entity"
import GuildCache from "../../data/GuildCache"
import MessageHelper from "nova-bot/dist/helpers/MessageHelper"
import { Emoji, iEventFile, ResponseBuilder } from "nova-bot"
import { Message } from "discord.js"

const file: iEventFile<Entry, GuildCache, BotCache, "messageDelete"> = {
	name: "messageDelete",
	execute: async (botCache, message) => {
		if (!message.guild) return
		const cache = await botCache.getGuildCache(message.guild)
		const helper = new MessageHelper(cache, message as Message)

		const userId = (await message.guild.fetchAuditLogs()).entries.first()!.executor!.id
		const alert = cache.alerts.find(a => a.message.id === message.id)
		if (!alert) return

		if (userId === config.discord.dev_id || userId === config.discord.bot_id) return

		helper.cache.alerts = helper.cache.alerts.filter(a => a.user_id !== alert.user_id)

		const restriction = helper.cache.getRestrictions().find(r => r.user_id === userId)
		if (restriction) {
			helper.respond(
				new ResponseBuilder(Emoji.BAD, "Your ban doesn't end if you delete this message"),
				5000
			)
		} else {
			const doc = helper.cache.getRestrictionDoc()
			await doc.set({
				id: doc.id,
				user_id: userId,
				message: "You were muted for deleting the bot's mute message",
				expires: Date.now() + 5 * 60 * 1000
			})

			helper.respond(
				new ResponseBuilder(
					Emoji.BAD,
					"You will be muted for 5 minutes for deleting this message"
				),
				5000
			)
		}
	}
}

export default file
