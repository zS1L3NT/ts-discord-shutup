import BotCache from "./data/BotCache"
import colors from "colors"
import config from "./config.json"
import GuildCache from "./data/GuildCache"
import NovaBot from "nova-bot"
import path from "path"
import Tracer from "tracer"
import { Intents } from "discord.js"

global.logger = Tracer.colorConsole({
	level: process.env.LOG_LEVEL || "log",
	format: [
		"[{{timestamp}}] <{{path}}> {{message}}",
		{
			//@ts-ignore
			alert: "[{{timestamp}}] <{{path}}, Line {{line}}> {{message}}",
			warn: "[{{timestamp}}] <{{path}}, Line {{line}}> {{message}}",
			error: "[{{timestamp}}] <{{path}}, Line {{line}} at {{pos}}> {{message}}"
		}
	],
	methods: ["log", "discord", "debug", "info", "alert", "warn", "error"],
	dateformat: "dd mmm yyyy, hh:MM:sstt",
	filters: {
		log: colors.grey,
		//@ts-ignore
		discord: colors.cyan,
		debug: colors.blue,
		info: colors.green,
		//@ts-ignore
		alert: colors.yellow,
		warn: colors.yellow.bold.italic,
		error: colors.red.bold.italic
	},
	preprocess: data => {
		data.path = data.path
			.split("nova-bot")
			.at(-1)!
			.replace(/^(\/|\\)dist/, "nova-bot")
			.replaceAll("\\", "/")
		data.path = data.path
			.split("ts-discord-shutup")
			.at(-1)!
			.replace(/^(\/|\\)(dist|src)/, "src")
			.replaceAll("\\", "/")
	}
})

new NovaBot({
	name: "ShutUp#2300",
	intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS],
	directory: path.join(__dirname, "interactions"),
	config,
	updatesMinutely: false,
	//@ts-ignore
	logger,

	help: {
		message: () =>
			[
				"Welcome to ShutUp!",
				"ShutUp is a bot meant to prevent people from messaging or joining voice channels"
			].join("\n"),
		icon: "https://i.ibb.co/jTVKQCn/mute.png"
	},

	GuildCache,
	BotCache
})
