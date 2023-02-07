import { fieldValidation } from '@/validation/protocols/field-validation';
import { InvalidFieldError } from '@/validation/errors';

export class EmailValidation implements fieldValidation {
	constructor (readonly field: string) {}

	validate (value: string): Error {
		const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
		return (!value || emailRegex.test(value)) ? null : new InvalidFieldError();
	}
}
