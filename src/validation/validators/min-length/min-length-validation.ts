import { InvalidFieldError } from '@/validation/errors';
import { fieldValidation } from '@/validation/protocols/field-validation';

export class MinLengthValidation implements fieldValidation {
	constructor (readonly field: string, private readonly minLength: number) {}

	validate (value: string): Error {
		return new InvalidFieldError();
	}
}
