import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import faker from 'faker';
import { cleanup, fireEvent, render, type RenderResult, waitFor } from '@testing-library/react';
import { Login } from '@/presentation/pages';
import { ValidationStub, AuthenticationSpy, Helper } from '@/presentation/test';
import { InvalidCredentialsError } from '@/domain/errors';
import { ApiContext } from '@/presentation/contexts';
import { type AccountModel } from '@/domain/models';

type SutTypes = {
	sut: RenderResult
	authenticationSpy: AuthenticationSpy
	setCurrentAccountMock: (account: AccountModel) => void
};

type SutParams = {
	validationError: string
};

const history = createMemoryHistory({ initialEntries: ['/login'] });

const makeSut = (params?: SutParams): SutTypes => {
	const validationStub = new ValidationStub();
	validationStub.errorMessage = params?.validationError;
	const authenticationSpy = new AuthenticationSpy();
	const setCurrentAccountMock = jest.fn();
	const sut = render(
		<ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
			<Router history={history}>
				<Login
					validation={validationStub}
					authentication={authenticationSpy}
				/>
			</Router>
		</ApiContext.Provider>
	);
	return {
		sut,
		authenticationSpy,
		setCurrentAccountMock
	};
};

const simulateValidSubmit = (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): void => {
	Helper.populateField(sut, 'email', email);
	Helper.populateField(sut, 'password', password);
	const submitButton = sut.getByTestId('submit');
	fireEvent.click(submitButton);
};

describe('Login Component', () => {
	afterEach(cleanup);

	test('Should start with initial state', () => {
		const validationError = faker.random.words();
		const { sut } = makeSut({ validationError });
		Helper.testChildCount(sut, 'error-wrap', 0);
		Helper.testButtonisDisabled(sut, 'submit', true);
		Helper.testStatusForField(sut, 'email', validationError);
		Helper.testStatusForField(sut, 'password', validationError);
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

	test('Should enable submit button if form is valid', () => {
		const { sut } = makeSut();
		Helper.populateField(sut, 'email');
		Helper.populateField(sut, 'password');
		Helper.testButtonisDisabled(sut, 'submit', false);
	});

	test('Should show spinner on submit', () => {
		const { sut } = makeSut();
		simulateValidSubmit(sut);
		Helper.testElementExists(sut, 'spinner');
	});

	test('Should call Authentication with correct values', () => {
		const { sut, authenticationSpy } = makeSut();
		const email = faker.internet.email();
		const password = faker.internet.password();
		simulateValidSubmit(sut, email, password);
		expect(authenticationSpy.params).toEqual({ email, password });
	});

	test('Should call Authentication only once', () => {
		const { sut, authenticationSpy } = makeSut();
		simulateValidSubmit(sut);
		simulateValidSubmit(sut);
		expect(authenticationSpy.callsCount).toBe(1);
	});

	test('Should not call Authentication if form is invalid', () => {
		const validationError = faker.random.words();
		const { sut, authenticationSpy } = makeSut({ validationError });
		Helper.populateField(sut, 'email');
		fireEvent.submit(sut.getByTestId('form'));
		expect(authenticationSpy.callsCount).toBe(0);
	});

	test('Should present error if Authentication fails', async () => {
		const { sut, authenticationSpy } = makeSut();
		const error = new InvalidCredentialsError();
		jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error);
		simulateValidSubmit(sut);
		await waitFor(() => {
			Helper.testChildCount(sut, 'error-wrap', 1);
			Helper.testElementText(sut, 'main-error', error.message);
		});
	});

	test('Should call UpdateCurrentAccount on success', async () => {
		const { sut, authenticationSpy, setCurrentAccountMock } = makeSut();
		simulateValidSubmit(sut);
		await waitFor(() => {
			expect(setCurrentAccountMock).toHaveBeenCalledWith(authenticationSpy.account);
			expect(history.length).toBe(1);
			expect(history.location.pathname).toBe('/');
		});
	});

	test('Should go to signup page', () => {
		const { sut } = makeSut();
		const registerLink = sut.getByTestId('signup-link');
		fireEvent.click(registerLink);
		expect(history.length).toBe(2);
		expect(history.location.pathname).toBe('/signup');
	});
});
