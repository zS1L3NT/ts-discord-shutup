import Entry from "../../data/Entity"
import GuildCache from "../../data/GuildCache"
import { iMessageFile } from "nova-bot"
import { MessageEmbed } from "discord.js"

const file: iMessageFile<Entry, GuildCache> = {
	condition: helper =>
		!!helper.cache.getRestrictions().find(r => r.user_id === helper.message.author.id),
	execute: async helper => {
		const restriction = helper.cache
			.getRestrictions()
			.find(r => r.user_id === helper.message.author.id)!
		helper.message.delete()

		const alert = helper.cache.alerts.find(a => a.user_id === helper.message.author.id)
		if (alert) {
			clearTimeout(alert.timeout)
			alert.timeout = setTimeout(() => {
				const alert = helper.cache.alerts.find(a => a.user_id === helper.message.author.id)
				alert?.message.delete().catch(() => {})
				helper.cache.alerts = helper.cache.alerts.filter(a => a.user_id !== alert?.user_id)
			}, 10000)
		} else {
			const member = await helper.cache.guild.members.fetch(restriction.user_id)

			helper.cache.alerts.push({
				user_id: restriction.user_id,
				message: await helper.message.channel.send({
					embeds: [
						new MessageEmbed()
							.setTitle(`Shut Up, ${member.displayName}`)
							.setColor("#FF0000")
							.setDescription(
								`${restriction.message}\nAuto-deletes if ${member.displayName} shuts up for 10 seconds`
							)
					],
					content: `Shut up, ${member.displayName}`
				}),
				timeout: setTimeout(() => {
					const alert = helper.cache.alerts.find(
						a => a.user_id === helper.message.author.id
					)
					alert?.message.delete().catch(() => {})
					helper.cache.alerts = helper.cache.alerts.filter(
						a => a.user_id !== alert?.user_id
					)
				}, 10000)
			})
		}
	}
}

export default file
