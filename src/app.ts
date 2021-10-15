import { Client, Intents, Message, MessageEmbed } from "discord.js"
import GuildCache from "./models/GuildCache"
import BotSetupHelper from "./utilities/BotSetupHelper"
import EmbedResponse, { Emoji } from "./utilities/EmbedResponse"
import MessageHelper from "./utilities/MessageHelper"

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

bot.on("messageDelete", async message => {
	if (!message.guild) return
	const cache = await botCache.getGuildCache(message.guild)
	const helper = new MessageHelper(cache, message as Message)
	const user_id = (await message.guild.fetchAuditLogs()).entries.first()!.executor!.id
	const alert = cache.alerts.find(a => a.message.id === message.id)
	if (!alert) return
	if (user_id === config.discord.dev_id || user_id === config.discord.bot_id) return

	helper.cache.alerts = helper.cache.alerts.filter(alert_ => alert_.user_id !== alert.user_id)

	const doc = helper.cache.getRestrictionDoc()
	await doc.set({
		id: doc.id,
		user_id: user_id,
		message: "You were muted for deleting the bot's mute message",
		expires: Date.now() + 5 * 60 * 1000
	})

	helper.respond(new EmbedResponse(
		Emoji.BAD,
		"You will be muted for 5 minutes for deleting this message"
	), 5000)
})

bot.on("messageUpdate", async (_, message) => {
	if (!message.guild) return
	const cache = await botCache.getGuildCache(message.guild)
	const alert = cache.alerts.find(a => a.message.id === message.id)
	if (!alert) return

	if (message.embeds.length === 0) {
		const restriction = cache.getRestrictions().find(r => r.value.user_id === alert.user_id)!
		const member = await cache.guild.members.fetch(alert.user_id)

		await message.edit({
			embeds: [
				new MessageEmbed()
					.setTitle(`Shut Up, ${member.displayName}`)
					.setColor("#FF0000")
					.setDescription(
						`${restriction.value.message}\nAuto-deletes if ${member.displayName} shuts up for 10 seconds`
					)
			]
		})
	}
})
