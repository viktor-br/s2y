const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime',
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    // issue with serialisation in graphql-redis-subscriptions, needs to use timestamp in pubsub.
    if (typeof value === 'number') {
      return value;
    }
    return value.getTime();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }
    return null;
  },
});

module.exports = DateTime;
