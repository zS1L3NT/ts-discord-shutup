import { Client, Intents } from "discord.js"
import GuildCache from "./models/GuildCache"
import BotSetupHelper from "./utilities/BotSetupHelper"

const config = require("../config.json")

// region Initialize bot
const bot = new Client({
	intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS]
})
const botSetupHelper = new BotSetupHelper(bot)
const { cache: botCache } = botSetupHelper
// endregion

void bot.login(config.discord.token)
bot.on("ready", async () => {
	console.log("Logged in as ShutUp Bot#2300")

	let i = 0
	let count = bot.guilds.cache.size
	for (const guild of bot.guilds.cache.toJSON()) {
		const tag = `${(++i).toString().padStart(count.toString().length, "0")}/${count}`
		let cache: GuildCache | undefined
		try {
			cache = await botCache.getGuildCache(guild)
		} catch (err) {
			console.error(`${tag} ❌ Couldn't find a Firebase Document for Guild(${guild.name})`)
			guild.leave()
			continue
		}

		try {
			await botSetupHelper.deploySlashCommands(guild)
		} catch (err) {
			console.error(`${tag} ❌ Couldn't get Slash Command permission for Guild(${guild.name})`)
			guild.leave()
			continue
		}

		console.log(`${tag} ✅ Restored cache for Guild(${guild.name})`)
	}
	console.log(`✅ All bot cache restored`)
})