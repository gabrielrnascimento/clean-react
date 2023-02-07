import { fieldValidation } from '@/validation/protocols/field-validation';
import { InvalidFieldError } from '@/validation/errors';

export class EmailValidation implements fieldValidation {
	constructor (readonly field: string) {}

	validate (value: string): Error {
		return new InvalidFieldError();
	}
}
