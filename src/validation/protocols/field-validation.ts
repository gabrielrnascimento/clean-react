export interface fieldValidation {
	field: string
	validate (value: string): Error
}
