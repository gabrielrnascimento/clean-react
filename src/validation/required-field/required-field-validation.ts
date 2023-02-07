import { fieldValidation } from '../protocols/field-validation';
import { RequiredFieldError } from '@/validation/errors';

export class RequiredFieldValidation implements fieldValidation {
	constructor (readonly field: string) {}

	validate (value: string): Error {
		return value ? null : new RequiredFieldError();
	}
}
