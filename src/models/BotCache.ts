import Entry from "./Entry"
import GuildCache from "./GuildCache"
import { BaseBotCache } from "discordjs-nova"

export default class BotCache extends BaseBotCache<Entry, GuildCache> {
	public onConstruct() {}
	public onSetGuildCache(cache: GuildCache) {}

	public async registerGuildCache(guildId: string) {
		const doc = await this.ref.doc(guildId).get()
		if (!doc.exists) {
			await this.ref.doc(guildId).set(this.getEmptyEntry())
		}
	}

	public async eraseGuildCache(guildId: string) {
		const promises: Promise<any>[] = []

		const doc = await this.ref.doc(guildId).get()
		if (doc.exists) {
			const doc = this.ref.doc(guildId)
			;(await doc.collection("restrictions").get()).forEach(snap => {
				promises.push(doc.collection("restrictions").doc(snap.id).delete())
			})
			promises.push(doc.delete())

			await Promise.allSettled(promises)
		}
	}

	public getEmptyEntry(): Entry {
		return {
			permitted: []
		}
	}
}
