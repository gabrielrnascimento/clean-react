import React from 'react';
import Styles from './spinner-styles.scss';
import PropTypes from 'prop-types';

type Props = React.HTMLAttributes<HTMLElement>

const Spinner: React.FC<Props> = (props: Props) => {
	return (
		<div {...props} className={[Styles.spinner, props.className].join(' ')}>
			<div /><div /><div /><div />
		</div>
	);
};

Spinner.propTypes = {
	className: PropTypes.string
};

export default Spinner;
