import { Emoji, iInteractionSubcommandFile, ResponseBuilder } from "discordjs-nova"
import Entry from "../../models/Entry"
import GuildCache from "../../models/GuildCache"

const config = require("../../../config.json")

const file: iInteractionSubcommandFile<Entry, GuildCache> = {
	data: new SlashCommandSubcommandBuilder()
		.setName("add")
		.setDescription("Adds a user to the list of permitted users")
		.addUserOption(option =>
			option.setName("user").setDescription("User to add").setRequired(true)
		),
	execute: async helper => {
		if (helper.interaction.user.id !== config.discord.dev_id) {
			return helper.respond(
				new ResponseBuilder(Emoji.BAD, "Only the developer can change permitted users")
			)
		}

		const user = helper.user("user")!
		if (helper.cache.getPermitted().includes(user.id)) {
			return helper.respond(
				new ResponseBuilder(Emoji.BAD, "This user is already permitted")
			)
		}

		await helper.cache.addPermitted(user.id)
		helper.respond(new ResponseBuilder(Emoji.GOOD, "Added permissions for user to allow and deny messaging"))
	}
}

export default file
