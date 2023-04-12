import React from 'react';
import { useRecoilState } from 'recoil';
import { SubmitButtonBase } from '@/presentation/components';
import { signUpState } from './atoms';

type Props = {
	text: string
};

const SubmitButton: React.FC<Props> = ({ text }: Props) => {
	const [state] = useRecoilState(signUpState);
	return (
		<SubmitButtonBase text={text} state={state} />
	);
};

export default SubmitButton;
