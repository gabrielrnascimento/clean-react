import React, { useContext, useEffect, useState } from 'react';
import Styles from './signup-styles.scss';
import { Footer, Input, LoginHeader, FormStatus, SubmitButton } from '@/presentation/components';
import { ApiContext, FormContext } from '@/presentation/contexts';
import { type Validation } from '@/presentation/protocols/validation';
import { type AddAccount } from '@/domain/usecases';
import { Link, useHistory } from 'react-router-dom';

type Props = {
	validation: Validation
	addAccount: AddAccount
};

const SignUp: React.FC<Props> = ({ validation, addAccount }: Props) => {
	const { setCurrentAccount } = useContext(ApiContext);
	const history = useHistory();
	const [state, setState] = useState({
		isLoading: false,
		isFormInvalid: true,
		name: '',
		email: '',
		password: '',
		passwordConfirmation: '',
		nameError: '',
		emailError: '',
		passwordError: '',
		passwordConfirmationError: '',
		mainError: ''
	});

	useEffect(() => {
		const { name, email, password, passwordConfirmation } = state;
		const formData = { name, email, password, passwordConfirmation };
		const nameError = validation.validate('name', formData);
		const emailError = validation.validate('email', formData);
		const passwordError = validation.validate('password', formData);
		const passwordConfirmationError = validation.validate('passwordConfirmation', formData);

		setState({
			...state,
			nameError,
			emailError,
			passwordError,
			passwordConfirmationError,
			isFormInvalid: !!nameError || !!emailError || !!passwordError || !!passwordConfirmationError
		});
	}, [
		state.name,
		state.email,
		state.password,
		state.passwordConfirmation
	]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
		try {
			if (state.isLoading || state.isFormInvalid) {
				return;
			}
			setState({ ...state, isLoading: true });
			const account = await addAccount.add({
				name: state.name,
				email: state.email,
				password: state.password,
				passwordConfirmation: state.passwordConfirmation
			});
			setCurrentAccount(account);
			history.replace('/');
		} catch (error) {
			setState({
				...state,
				isLoading: false,
				mainError: error.message
			});
		}
	};

	return (
		<div className={Styles.signUpWrap}>
			<LoginHeader />
			<FormContext.Provider value={ { state, setState } }>
				{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
				<form data-testid='form' className={Styles.form} onSubmit={handleSubmit}>
					<h2>Criar Conta</h2>
					<Input type='text' name='name' placeholder='Digite seu nome'/>
					<Input type='email' name='email' placeholder='Digite seu e-mail'/>
					<Input type='password' name='password' placeholder='Digite sua senha'/>
					<Input type='password' name='passwordConfirmation' placeholder='Repita sua senha'/>
					<SubmitButton text="Cadastrar" />
					<Link data-testid="login-link" replace to="/login" className={Styles.link}>Voltar para Login</Link>
					<FormStatus />
				</form>
			</FormContext.Provider>
			<Footer />
		</div>
	);
};

export default SignUp;
