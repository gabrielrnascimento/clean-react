import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import faker from 'faker';
import { cleanup, fireEvent, render, type RenderResult, waitFor } from '@testing-library/react';
import { Login } from '@/presentation/pages';
import { ValidationStub, AuthenticationSpy, SaveAccessTokenMock, Helper } from '@/presentation/test';
import { InvalidCredentialsError } from '@/domain/errors';

type SutTypes = {
	sut: RenderResult
	authenticationSpy: AuthenticationSpy
	saveAccessTokenMock: SaveAccessTokenMock
};

type SutParams = {
	validationError: string
};

const history = createMemoryHistory({ initialEntries: ['/login'] });

const makeSut = (params?: SutParams): SutTypes => {
	const validationStub = new ValidationStub();
	validationStub.errorMessage = params?.validationError;
	const authenticationSpy = new AuthenticationSpy();
	const saveAccessTokenMock = new SaveAccessTokenMock();
	const sut = render(
		<Router history={history}>
			<Login
				validation={validationStub}
				authentication={authenticationSpy}
				saveAccessToken={saveAccessTokenMock}
			/>
		</Router>
	);
	return {
		sut,
		authenticationSpy,
		saveAccessTokenMock
	};
};

const simulateValidSubmit = (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): void => {
	Helper.populateField(sut, 'email', email);
	Helper.populateField(sut, 'password', password);
	const submitButton = sut.getByTestId('submit');
	fireEvent.click(submitButton);
};

const testElementExists = (sut: RenderResult, fieldName: string): void => {
	const element = sut.getByTestId(fieldName);
	expect(element).toBeTruthy();
};

const testElementText = (sut: RenderResult, fieldName: string, text: string): void => {
	const element = sut.getByTestId(fieldName);
	expect(element.textContent).toBe(text);
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
		testElementExists(sut, 'spinner');
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
		jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error));
		simulateValidSubmit(sut);
		await waitFor(() => {
			Helper.testChildCount(sut, 'error-wrap', 1);
			testElementText(sut, 'main-error', error.message);
		});
	});

	test('Should call SaveAccessToken on success', async () => {
		const { sut, authenticationSpy, saveAccessTokenMock } = makeSut();
		simulateValidSubmit(sut);
		await waitFor(() => {
			expect(saveAccessTokenMock.accessToken).toBe(authenticationSpy.account.accessToken);
			expect(history.length).toBe(1);
			expect(history.location.pathname).toBe('/');
		});
	});

	test('Should present error if SaveAccessToken fails', async () => {
		const { sut, saveAccessTokenMock } = makeSut();
		const error = new InvalidCredentialsError();
		jest.spyOn(saveAccessTokenMock, 'save').mockReturnValueOnce(Promise.reject(error));
		simulateValidSubmit(sut);
		await waitFor(() => {
			Helper.testChildCount(sut, 'error-wrap', 1);
			testElementText(sut, 'main-error', error.message);
		});
	});

	test('Should go to signup page', () => {
		const { sut } = makeSut();
		const register = sut.getByTestId('signup');
		fireEvent.click(register);
		expect(history.length).toBe(2);
		expect(history.location.pathname).toBe('/signup');
	});
});
