import admin from "firebase-admin"
import config from "../config.json"
import Entry from "./Entity"
import Restriction from "./Restriction"
import { BaseGuildCache } from "nova-bot"
import { Message } from "discord.js"

interface Alert {
	user_id: string
	message: Message
	timeout: NodeJS.Timeout
}

export default class GuildCache extends BaseGuildCache<Entry, GuildCache> {
	private restrictions: Restriction[] = []
	public alerts: Alert[] = []

	public onConstruct(): void {
		this.ref.collection("restrictions").onSnapshot(snaps => {
			this.restrictions = snaps.docs.map(doc => doc.data() as Restriction)
		})
	}

	public resolve(resolve: (cache: GuildCache) => void): void {
		this.ref.onSnapshot(snap => {
			if (snap.exists) {
				this.entry = snap.data() as Entry
				resolve(this)
			}
		})
	}

	public updateMinutely(debug: number): void {}

	public getRestrictionDoc(
		restriction_id?: string
	): FirebaseFirestore.DocumentReference<Restriction> {
		const restrictions = this.ref.collection(
			"restrictions"
		) as FirebaseFirestore.CollectionReference<Restriction>
		return restriction_id ? restrictions.doc(restriction_id) : restrictions.doc()
	}

	public getRestrictions() {
		return this.restrictions.filter(restriction => {
			if (restriction.expires && Date.now() > restriction.expires) {
				this.getRestrictionDoc(restriction.id).delete()
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
			//@ts-ignore
			{ permitted: admin.firestore.FieldValue.arrayUnion(userId) },
			{ merge: true }
		)
	}

	public async removePermitted(userId: string) {
		this.entry.permitted = this.entry.permitted.filter(p => p !== userId)
		await this.ref.set(
			//@ts-ignore
			{ permitted: admin.firestore.FieldValue.arrayRemove(userId) },
			{ merge: true }
		)
	}
}
