import BotCache from "../models/BotCache"
import Entry from "../models/Entry"
import GuildCache from "../models/GuildCache"
import { iEventFile } from "discordjs-nova"

const file: iEventFile<Entry, GuildCache, BotCache, "voiceStateUpdate"> = {
	name: "voiceStateUpdate",
	execute: async (botCache, oldState, newState) => {
		if (newState.channel) {
			const cache = await botCache.getGuildCache(newState.guild)
			const restriction = cache
				.getRestrictions()
				.find(r => r.value.user_id === newState.member?.id)

			if (restriction) {
				newState.member?.voice.disconnect()
			}
		}
	}
}

export default file
