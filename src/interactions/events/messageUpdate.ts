import BotCache from "../../data/BotCache"
import Entry from "../../data/Entity"
import GuildCache from "../../data/GuildCache"
import { iEventFile } from "nova-bot"
import { MessageEmbed } from "discord.js"

const file: iEventFile<Entry, GuildCache, BotCache, "messageUpdate"> = {
	name: "messageUpdate",
	execute: async (botCache, _, message) => {
		if (!message.guild) return
		const cache = await botCache.getGuildCache(message.guild)

		const alert = cache.alerts.find(a => a.message.id === message.id)
		if (!alert) return

		if (message.embeds.length === 0) {
			const restriction = cache.getRestrictions().find(r => r.user_id === alert.user_id)!
			const member = await cache.guild.members.fetch(alert.user_id)

			await message.edit({
				embeds: [
					new MessageEmbed()
						.setTitle(`Shut Up, ${member.displayName}`)
						.setColor("#FF0000")
						.setDescription(
							`${restriction.message}\nAuto-deletes if ${member.displayName} shuts up for 10 seconds`
						)
				]
			})
		}
	}
}

export default file
