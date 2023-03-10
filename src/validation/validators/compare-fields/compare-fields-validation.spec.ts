import { CompareFieldsValidation } from './compare-fields-validation';
import { InvalidFieldError } from '@/validation/errors';
import faker from 'faker';

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
			[field]: faker.random.words(3),
			[fieldToCompare]: faker.random.words(4)
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
