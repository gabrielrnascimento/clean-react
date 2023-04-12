import faker from 'faker';
import { InvalidFieldError } from '@/validation/errors';
import { CompareFieldsValidation } from './compare-fields-validation';

const makeSut = (field: string, fieldToCompare: string): CompareFieldsValidation => {
	return new CompareFieldsValidation(
		field,
		fieldToCompare
	);
};

describe('CompareFieldsValidation', () => {
	test('Should return error if compare is invalid', () => {
		const firstField = faker.database.column();
		let secondField = faker.database.column();

		while (firstField === secondField) {
			secondField = faker.database.column();
		}

		const field = firstField;
		const fieldToCompare = secondField;
		const sut = makeSut(field, fieldToCompare);
		const error = sut.validate({
			[field]: 'any_value',
			[fieldToCompare]: 'other_value'
		});
		expect(error).toEqual(new InvalidFieldError());
	});

	test('Should return falsy if compare is valid', () => {
		const field = faker.database.column();
		const fieldToCompare = faker.database.column();
		const value = faker.random.word();
		const sut = makeSut(field, fieldToCompare);
		const error = sut.validate({
			[field]: value,
			[fieldToCompare]: value
		});
		expect(error).toBeFalsy();
	});
});
