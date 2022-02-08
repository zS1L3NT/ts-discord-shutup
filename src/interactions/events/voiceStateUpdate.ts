import BotCache from "../../data/BotCache"
import Entry from "../../data/Entity"
import GuildCache from "../../data/GuildCache"
import { iEventFile } from "nova-bot"

const file: iEventFile<Entry, GuildCache, BotCache, "voiceStateUpdate"> = {
	name: "voiceStateUpdate",
	execute: async (botCache, _, after) => {
		if (after.channel) {
			const cache = await botCache.getGuildCache(after.guild)
			const restriction = cache.getRestrictions().find(r => r.user_id === after.member?.id)

			if (restriction) {
				after.member?.voice.disconnect()
			}
		}
	}
}

export default file
