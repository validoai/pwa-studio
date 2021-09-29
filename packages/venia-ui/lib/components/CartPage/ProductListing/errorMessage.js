import React from 'react';
import { FormattedMessage } from 'react-intl';
import { shape, string } from 'prop-types';
import { useStyle } from '../../../classify';
import defaultClasses from './errorMessage.css';

const acceptedErrors = ['The requested qty is not available'];

const ErrorMessage = props => {
    const { error } = props;
    const classes = useStyle(defaultClasses, props.classes);

    if (!error || !error.message) {
        return null;
    }

    if (acceptedErrors.includes(error.message)) {
        return null;
    }

    return <div className={classes.root}>{error.message}</div>;
};

ErrorMessage.defaultProps = {
    classes: null,
    error: null
};

ErrorMessage.propTypes = {
    classes: shape({
        root: string
    }),
    error: shape({
        message: string
    })
};

export default ErrorMessage;
