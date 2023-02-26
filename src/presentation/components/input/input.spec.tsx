import React from 'react';
import faker from 'faker';
import { fireEvent, render, type RenderResult } from '@testing-library/react';
import Input from './input';
import { FormContext as Context } from '@/presentation/contexts';

const makeSut = (fieldName: string): RenderResult => {
	return render(
		<Context.Provider value={ { state: {} } }>
			<Input name={fieldName} />
		</Context.Provider>
	);
};

describe('Input Component', () => {
	test('Should begin with readonly', () => {
		const fieldName = faker.database.column();
		const sut = makeSut(fieldName);
		const input = sut.getByTestId(fieldName) as HTMLInputElement;
		expect(input.readOnly).toBe(true);
	});

	test('Should remove readonly on focus', () => {
		const fieldName = faker.database.column();
		const sut = makeSut(fieldName);
		const input = sut.getByTestId(fieldName) as HTMLInputElement;
		fireEvent.focus(input);
		expect(input.readOnly).toBe(false);
	});

	test('Should focus input on label click', () => {
		const fieldName = faker.database.column();
		const sut = makeSut(fieldName);
		const input = sut.getByTestId(fieldName);
		const label = sut.getByTestId(`${fieldName}-label`);
		fireEvent.click(label);
		expect(document.activeElement).toBe(input);
	});
});
