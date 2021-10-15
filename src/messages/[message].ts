import { MessageEmbed } from "discord.js"
import { iMessageFile } from "../utilities/BotSetupHelper"

module.exports = {
	condition: helper =>
		!!helper.cache.getRestrictions().find(r => r.value.user_id === helper.message.author.id),
	execute: async helper => {
		const restriction = helper.cache.getRestrictions().find(r => r.value.user_id === helper.message.author.id)!
		helper.message.delete()

		const alert = helper.cache.alerts.find(alert => alert.user_id)
		if (alert) {
			clearTimeout(alert.timeout)
			alert.timeout = setTimeout(() => {
				const alert = helper.cache.alerts.find(alert => alert.user_id)
				alert?.message.delete().catch(() => {})
				helper.cache.alerts = helper.cache.alerts.filter(alert_ => alert_.user_id !== alert?.user_id)
			}, 10000)
		} else {
			const member = await helper.cache.guild.members.fetch(restriction.value.user_id)

			helper.cache.alerts.push({
				user_id: restriction.value.user_id,
				message: await helper.message.channel.send({
					embeds: [
						new MessageEmbed()
							.setTitle(`Shut Up, ${member.displayName}`)
							.setColor("#FF0000")
							.setDescription(`${restriction.value.message}\nAuto-deletes if ${member.displayName} shuts up for 10 seconds`)
					],
					content: `Shut up, ${member.displayName}`
				}),
				timeout: setTimeout(() => {
					const alert = helper.cache.alerts.find(alert => alert.user_id)
					alert?.message.delete().catch(() => {})
					helper.cache.alerts = helper.cache.alerts.filter(alert_ => alert_.user_id !== alert?.user_id)
				}, 10000)
			})
		}
	}
} as iMessageFile
