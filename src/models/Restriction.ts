export interface iRestriction {
	id: string
	user_id: string
	message: string
}

export default class Restriction {
	public value: iRestriction

	public constructor(value: iRestriction) {
		this.value = value
	}
}