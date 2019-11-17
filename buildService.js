const { RemoteGraphQLDataSource } = require('@apollo/gateway');

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
    willSendRequest({ request, context }) {
        request.http.headers.set('Authorization', `Bearer ${context.token}`);
    }
}

module.exports = function buildService(config) {
    return new AuthenticatedDataSource(config);
};