import BotCache from "./models/BotCache"
import GuildCache from "./models/GuildCache"
import NovaBot from "discordjs-nova"
import { Intents } from "discord.js"

const config = require("../config.json")

new NovaBot({
	name: "ShutUp#2300",
	intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS],
	cwd: __dirname,
	config,
	updatesMinutely: false,

	help: {
		message: cache =>
			[
				"Welcome to ShutUp!",
				"ShutUp is a bot to stop a user from texting or joining voice calls",
				"",
				"Users who are `permitted` can allow and deny messaging from users",
				"To be `permitted`, the developer will need to permit you",
				"Use `allow` and `deny` to allow or deny a user from messaging and voice calls"
			].join("\n"),
		icon: "https://cdn.discordapp.com/avatars/898590939231166535/45016839c50b5d5f6b48f5e9aa47bc2c.webp?size=128"
	},

	GuildCache,
	BotCache,

	onSetup: botCache => {
		botCache.bot.user!.setPresence({
			activities: [
				{
					name: "/help",
					type: "LISTENING"
				}
			]
		})
	}
})
