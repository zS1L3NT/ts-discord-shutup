import { Message } from "discord.js"
import { BaseGuildCache } from "discordjs-nova"
import admin from "firebase-admin"
import Entry from "./Entry"
import Restriction, { iRestriction } from "./Restriction"

const config = require("../../config.json")

interface Alert {
	user_id: string
	message: Message
	timeout: NodeJS.Timeout
}

export default class GuildCache extends BaseGuildCache<Entry, GuildCache> {
	private restrictions: Restriction[] = []
	public alerts: Alert[] = []

	public resolve(resolve: (cache: GuildCache) => void) {
		this.ref.onSnapshot(snap => {
			if (snap.exists) {
				this.entry = snap.data() as Entry
				resolve(this)
			}
		})
		this.ref.collection("restrictions").onSnapshot(snaps => {
			this.restrictions = snaps.docs.map(doc => new Restriction(doc.data() as iRestriction))
		})
	}

	public onConstruct() {}
	public updateMinutely(debug: number) {}

	public getRestrictionDoc(
		restriction_id?: string
	): FirebaseFirestore.DocumentReference<iRestriction> {
		const restrictions = this.ref.collection(
			"restrictions"
		) as FirebaseFirestore.CollectionReference<iRestriction>
		return restriction_id ? restrictions.doc(restriction_id) : restrictions.doc()
	}

	public getRestrictions() {
		return this.restrictions.filter(restriction => {
			if (restriction.value.expires && Date.now() > restriction.value.expires) {
				this.getRestrictionDoc(restriction.value.id).delete()
				return false
			}
			return true
		})
	}

	public getPermitted(): string[] {
		return [config.discord.dev_id, ...this.entry.permitted]
	}

	public async addPermitted(userId: string) {
		this.entry.permitted = [userId, ...this.entry.permitted]
		await this.ref.set(
			{
				// @ts-ignore
				permitted: admin.firestore.FieldValue.arrayUnion(userId)
			},
			{ merge: true }
		)
	}

	public async removePermitted(userId: string) {
		this.entry.permitted = this.entry.permitted.filter(p => p !== userId)
		await this.ref.set(
			{
				// @ts-ignore
				permitted: admin.firestore.FieldValue.arrayRemove(userId)
			},
			{ merge: true }
		)
	}
}
