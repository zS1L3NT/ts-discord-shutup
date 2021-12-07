import { BaseEntry } from "discordjs-nova"

export default interface Entry extends BaseEntry {
	permitted: string[]
}
