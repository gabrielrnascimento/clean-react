import React from 'react';
import Styles from './spinner-styles.scss';
import PropTypes from 'prop-types';

type Props = React.HTMLAttributes<HTMLElement> & {
	negative?: boolean
};

const Spinner: React.FC<Props> = ({ negative, ...props }: Props) => {
	const negativeClass = negative ? Styles.negative : '';
	return (
		<div {...props} data-testid="spinner" className={[Styles.spinner, negativeClass, props.className].join(' ')}>
			<div /><div /><div /><div />
		</div>
	);
};

Spinner.propTypes = {
	className: PropTypes.string,
	negative: PropTypes.bool
};

export default Spinner;
