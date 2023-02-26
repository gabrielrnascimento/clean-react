import React from 'react';
import SignUp from './signup';
import { type RenderResult, render, cleanup, fireEvent, waitFor } from '@testing-library/react';
import faker from 'faker';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { AddAccountSpy, Helper, ValidationStub } from '@/presentation/test';
import { EmailInUseError } from '@/domain/errors';
import { ApiContext } from '@/presentation/contexts';
import { type AccountModel } from '@/domain/models';

type SutTypes = {
	sut: RenderResult
	addAccountSpy: AddAccountSpy
	setCurrentAccountMock: (account: AccountModel) => void
};

type SutParams = {
	validationError: string
};

const history = createMemoryHistory({ initialEntries: ['/signup'] });

const makeSut = (params?: SutParams): SutTypes => {
	const validationStub = new ValidationStub();
	validationStub.errorMessage = params?.validationError;
	const addAccountSpy = new AddAccountSpy();
	const setCurrentAccountMock = jest.fn();
	const sut = render(
		<ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
			<Router history={history}>
				<SignUp
					validation={validationStub}
					addAccount={addAccountSpy}
				/>
			</Router>
		</ApiContext.Provider>
	);
	return {
		sut,
		addAccountSpy,
		setCurrentAccountMock
	};
};

const simulateValidSubmit = (sut: RenderResult, name = faker.name.findName(), email = faker.internet.email(), password = faker.internet.password()): void => {
	Helper.populateField(sut, 'name', name);
	Helper.populateField(sut, 'email', email);
	Helper.populateField(sut, 'password', password);
	Helper.populateField(sut, 'passwordConfirmation', password);
	const submitButton = sut.getByTestId('submit');
	fireEvent.click(submitButton);
};

describe('SignUp Component', () => {
	afterEach(cleanup);

	test('Should start with initial state', () => {
		const validationError = faker.random.words();
		const { sut } = makeSut({ validationError });
		Helper.testChildCount(sut, 'error-wrap', 0);
		Helper.testButtonisDisabled(sut, 'submit', true);
		Helper.testStatusForField(sut, 'name', validationError);
		Helper.testStatusForField(sut, 'email', validationError);
		Helper.testStatusForField(sut, 'password', validationError);
		Helper.testStatusForField(sut, 'passwordConfirmation', validationError);
	});

	test('Should show name error if Validation fails', () => {
		const validationError = faker.random.words();
		const { sut } = makeSut({ validationError });
		Helper.populateField(sut, 'name');
		Helper.testStatusForField(sut, 'name', validationError);
	});

	test('Should show email error if Validation fails', () => {
		const validationError = faker.random.words();
		const { sut } = makeSut({ validationError });
		Helper.populateField(sut, 'email');
		Helper.testStatusForField(sut, 'email', validationError);
	});

	test('Should show password error if Validation fails', () => {
		const validationError = faker.random.words();
		const { sut } = makeSut({ validationError });
		Helper.populateField(sut, 'password');
		Helper.testStatusForField(sut, 'password', validationError);
	});

	test('Should show passwordConfirmation error if Validation fails', () => {
		const validationError = faker.random.words();
		const { sut } = makeSut({ validationError });
		Helper.populateField(sut, 'passwordConfirmation');
		Helper.testStatusForField(sut, 'passwordConfirmation', validationError);
	});

	test('Should show valid name state if Validation succeeds', () => {
		const { sut } = makeSut();
		Helper.populateField(sut, 'name');
		Helper.testStatusForField(sut, 'name');
	});

	test('Should show valid email state if Validation succeeds', () => {
		const { sut } = makeSut();
		Helper.populateField(sut, 'email');
		Helper.testStatusForField(sut, 'email');
	});

	test('Should show valid password state if Validation succeeds', () => {
		const { sut } = makeSut();
		Helper.populateField(sut, 'password');
		Helper.testStatusForField(sut, 'password');
	});

	test('Should show valid passwordConfirmation state if Validation succeeds', () => {
		const { sut } = makeSut();
		Helper.populateField(sut, 'passwordConfirmation');
		Helper.testStatusForField(sut, 'passwordConfirmation');
	});

	test('Should enable submit button if form is valid', () => {
		const { sut } = makeSut();
		Helper.populateField(sut, 'name');
		Helper.populateField(sut, 'email');
		Helper.populateField(sut, 'password');
		Helper.populateField(sut, 'passwordConfirmation');
		Helper.testButtonisDisabled(sut, 'submit', false);
	});

	test('Should show spinner on submit', () => {
		const { sut } = makeSut();
		simulateValidSubmit(sut);
		Helper.testElementExists(sut, 'spinner');
	});

	test('Should call AddAccount with correct values', () => {
		const { sut, addAccountSpy } = makeSut();
		const name = faker.name.findName();
		const email = faker.internet.email();
		const password = faker.internet.password();
		simulateValidSubmit(sut, name, email, password);
		expect(addAccountSpy.params).toEqual({
			name,
			email,
			password,
			passwordConfirmation: password
		});
	});

	test('Should call AddAccount only once', () => {
		const { sut, addAccountSpy } = makeSut();
		simulateValidSubmit(sut);
		simulateValidSubmit(sut);
		expect(addAccountSpy.callsCount).toBe(1);
	});

	test('Should not call AddAccount if form is invalid', () => {
		const validationError = faker.random.words();
		const { sut, addAccountSpy } = makeSut({ validationError });
		Helper.populateField(sut, 'email');
		fireEvent.submit(sut.getByTestId('form'));
		expect(addAccountSpy.callsCount).toBe(0);
	});

	test('Should present error if AddAccount fails', async () => {
		const { sut, addAccountSpy } = makeSut();
		const error = new EmailInUseError();
		jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error);
		simulateValidSubmit(sut);
		await waitFor(() => {
			Helper.testChildCount(sut, 'error-wrap', 1);
			Helper.testElementText(sut, 'main-error', error.message);
		});
	});

	test('Should call UpdateCurrentAccount on success', async () => {
		const { sut, addAccountSpy, setCurrentAccountMock } = makeSut();
		simulateValidSubmit(sut);
		await waitFor(() => {
			expect(setCurrentAccountMock).toHaveBeenCalledWith(addAccountSpy.account);
			expect(history.length).toBe(1);
			expect(history.location.pathname).toBe('/');
		});
	});

	test('Should go to login page', () => {
		const { sut } = makeSut();
		const loginLink = sut.getByTestId('login-link');
		fireEvent.click(loginLink);
		expect(history.length).toBe(1);
		expect(history.location.pathname).toBe('/login');
	});
});
