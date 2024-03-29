import { fireEvent, screen, waitFor } from '@testing-library/react';
import faker from 'faker';
import { createMemoryHistory } from 'history';
import { InvalidCredentialsError } from '@/domain/errors';
import { AuthenticationSpy } from '@/domain/test';
import { type Authentication } from '@/domain/usecases';
import { Login } from '@/presentation/pages';
import { Helper, ValidationStub, renderWithHistory } from '@/presentation/test';

type SutTypes = {
	authenticationSpy: AuthenticationSpy
	setCurrentAccountMock: (account: Authentication.Model) => void
};

type SutParams = {
	validationError: string
};

const history = createMemoryHistory({ initialEntries: ['/login'] });

const makeSut = (params?: SutParams): SutTypes => {
	const validationStub = new ValidationStub();
	validationStub.errorMessage = params?.validationError;
	const authenticationSpy = new AuthenticationSpy();
	const { setCurrentAccountMock } = renderWithHistory({
		history,
		Page: () => Login({ validation: validationStub, authentication: authenticationSpy })
	});
	return {
		authenticationSpy,
		setCurrentAccountMock
	};
};

const simulateValidSubmit = (email = faker.internet.email(), password = faker.internet.password()): void => {
	Helper.populateField('email', email);
	Helper.populateField('password', password);
	const submitButton = screen.getByTestId('submit');
	fireEvent.click(submitButton);
};

describe('Login Component', () => {
	test('Should start with initial state', () => {
		const validationError = faker.random.words();
		makeSut({ validationError });
		expect(screen.getByTestId('error-wrap').children).toHaveLength(0);
		expect(screen.getByTestId('submit')).toBeDisabled();
		Helper.testStatusForField('email', validationError);
		Helper.testStatusForField('password', validationError);
	});

	test('Should show email error if Validation fails', () => {
		const validationError = faker.random.words();
		makeSut({ validationError });
		Helper.populateField('email');
		Helper.testStatusForField('email', validationError);
	});

	test('Should show password error if Validation fails', () => {
		const validationError = faker.random.words();
		makeSut({ validationError });
		Helper.populateField('password');
		Helper.testStatusForField('password', validationError);
	});

	test('Should show valid email state if Validation succeeds', () => {
		makeSut();
		Helper.populateField('email');
		Helper.testStatusForField('email');
	});

	test('Should show valid password state if Validation succeeds', () => {
		makeSut();
		Helper.populateField('password');
		Helper.testStatusForField('password');
	});

	test('Should enable submit button if form is valid', () => {
		makeSut();
		Helper.populateField('email');
		Helper.populateField('password');
		expect(screen.getByTestId('submit')).toBeEnabled();
	});

	test('Should show spinner on submit', () => {
		makeSut();
		simulateValidSubmit();
		expect(screen.queryByTestId('spinner')).toBeInTheDocument();
	});

	test('Should call Authentication with correct values', () => {
		const { authenticationSpy } = makeSut();
		const email = faker.internet.email();
		const password = faker.internet.password();
		simulateValidSubmit(email, password);
		expect(authenticationSpy.params).toEqual({ email, password });
	});

	test('Should call Authentication only once', () => {
		const { authenticationSpy } = makeSut();
		simulateValidSubmit();
		simulateValidSubmit();
		expect(authenticationSpy.callsCount).toBe(1);
	});

	test('Should not call Authentication if form is invalid', () => {
		const validationError = faker.random.words();
		const { authenticationSpy } = makeSut({ validationError });
		Helper.populateField('email');
		fireEvent.submit(screen.getByTestId('form'));
		expect(authenticationSpy.callsCount).toBe(0);
	});

	test('Should present error if Authentication fails', async () => {
		const { authenticationSpy } = makeSut();
		const error = new InvalidCredentialsError();
		jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error);
		simulateValidSubmit();
		await waitFor(() => {
			expect(screen.getByTestId('main-error')).toHaveTextContent(error.message);
			expect(screen.getByTestId('error-wrap').children).toHaveLength(1);
		});
	});

	test('Should call UpdateCurrentAccount on success', async () => {
		const { authenticationSpy, setCurrentAccountMock } = makeSut();
		simulateValidSubmit();
		await waitFor(() => {
			expect(setCurrentAccountMock).toHaveBeenCalledWith(authenticationSpy.account);
			expect(history.length).toBe(1);
			expect(history.location.pathname).toBe('/');
		});
	});

	test('Should go to signup page', () => {
		makeSut();
		const registerLink = screen.getByTestId('signup-link');
		fireEvent.click(registerLink);
		expect(history.length).toBe(2);
		expect(history.location.pathname).toBe('/signup');
	});
});
