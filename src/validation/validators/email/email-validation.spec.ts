import faker from 'faker';
import { InvalidFieldError } from '@/validation/errors';
import { EmailValidation } from './email-validation';

const makeSut = (field): EmailValidation => new EmailValidation(field);

describe('EmaiLValidation', () => {
	test('Should return error if email is invalid', () => {
		const field = faker.database.column();
		const sut = makeSut(field);
		const error = sut.validate({ [field]: faker.random.word() });
		expect(error).toEqual(new InvalidFieldError());
	});

	test('Should return falsy if email is valid', () => {
		const field = faker.database.column();
		const sut = makeSut(field);
		const error = sut.validate({ [field]: faker.internet.email() });
		expect(error).toBeFalsy();
	});

	test('Should return falsy if email is empty', () => {
		const field = faker.database.column();
		const sut = makeSut(field);
		const error = sut.validate({ [field]: '' });
		expect(error).toBeFalsy();
	});
});
