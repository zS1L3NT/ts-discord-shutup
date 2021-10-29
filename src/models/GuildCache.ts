import { Client, Guild, Message } from "discord.js"
import admin from "firebase-admin"
import Document, { iDocument } from "./Document"
import Restriction, { iRestriction } from "./Restriction"

const config = require("../../config.json")

interface Alert {
	user_id: string
	message: Message
	timeout: NodeJS.Timeout
}

export default class GuildCache {
	public bot: Client
	public guild: Guild
	public ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
	private restrictions: Restriction[] = []
	public alerts: Alert[] = []
	private document: Document = Document.getEmpty()

	public constructor(
		bot: Client,
		guild: Guild,
		ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
		resolve: (localCache: GuildCache) => void
	) {
		this.bot = bot
		this.guild = guild
		this.ref = ref
		this.ref.onSnapshot(snap => {
			if (snap.exists) {
				this.document = new Document(snap.data() as iDocument)
				resolve(this)
			}
		})
		this.ref.collection("restrictions").onSnapshot(snaps => {
			this.restrictions = snaps.docs.map(doc => new Restriction(doc.data() as iRestriction))
		})
	}

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
		return [config.discord.dev_id, ...this.document.value.permitted]
	}

	public async addPermitted(userId: string) {
		this.document.value.permitted = [userId, ...this.document.value.permitted]
		await this.ref.set(
			{ permitted: admin.firestore.FieldValue.arrayUnion(userId) },
			{ merge: true }
		)
	}

	public async removePermitted(userId: string) {
		this.document.value.permitted = this.document.value.permitted.filter(p => p !== userId)
		await this.ref.set(
			{ permitted: admin.firestore.FieldValue.arrayRemove(userId) },
			{ merge: true }
		)
	}
}
