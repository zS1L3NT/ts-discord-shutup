import Entry from "./Entity"
import GuildCache from "./GuildCache"
import { BaseBotCache } from "nova-bot"

export default class BotCache extends BaseBotCache<Entry, GuildCache> {
	public onConstruct(): void {}
	public onSetGuildCache(cache: GuildCache): void {}

	public async registerGuildCache(guildId: string) {
		const doc = await this.ref.doc(guildId).get()
		if (!doc.exists) {
			await this.ref.doc(guildId).set(this.getEmptyEntry())
		}
	}

	public async eraseGuildCache(guildId: string) {
		const doc = await this.ref.doc(guildId).get()
		if (doc.exists) {
			const doc = this.ref.doc(guildId)
			const restrictions = await doc.collection("restrictions").get()
			await Promise.all(
				restrictions.docs.map(r => doc.collection("restrictions").doc(doc.id).delete())
			)
		}
	}

	public getEmptyEntry(): Entry {
		return {
			permitted: []
		}
	}
}
