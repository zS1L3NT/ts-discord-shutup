import { BaseEntry } from "nova-bot"

export default interface Entry extends BaseEntry {
	permitted: string[]
}
