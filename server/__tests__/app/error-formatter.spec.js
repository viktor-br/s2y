const {createErrorFormatter} = require('../../src/app/error-formatter');

describe('createErrorFormatter', () => {
    test('stringify', () => {
        const error = {message: 'Test', code: 123};
        const loggerMock = jest.fn();
        const errorFormatter = createErrorFormatter({error: loggerMock});

        const formattedError = errorFormatter(error);

        expect(loggerMock).toHaveBeenCalledWith(JSON.stringify(error));

        expect(formattedError).toEqual(error);
    });
});