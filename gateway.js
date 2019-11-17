const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");
const buildContext = require('./buildContext');

const gateway = new ApolloGateway({
  serviceList: [
    { name: "accounts", url: "http://localhost:4001/graphql" },
    { name: "reviews", url: "http://localhost:4002/graphql" },
    { name: "products", url: "http://localhost:4003/graphql" },
    { name: "inventory", url: "http://localhost:4004/graphql" }
  ]
});

(async () => {
  const { schema, executor } = await gateway.load();

  const server = new ApolloServer({
    schema,
    executor,
    context: buildContext
  });

  const {url} = await server.listen();
  console.log(`🚀 Server ready at ${url}`);
})();
