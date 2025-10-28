import { grafserv } from 'grafserv/h3/v1'


const typeDefs = /* GraphQL */ `
  type Query {
    addTwoNumbers(a: Int!, b: Int!): Int
  }
`;

const { lambda } = require("grafast");

const objects = {
  Query: {
    plans: {
      addTwoNumbers(_, fieldArgs) {
        const { $a, $b } = fieldArgs;
        return lambda([$a, $b], ([a, b]) => a + b);
      },
    },
  },
};

const { makeGrafastSchema } = require("grafast");

const schema = makeGrafastSchema({
  typeDefs,
  objects,
});


const preset = {
  grafserv: {
    port: 3001,
    host: "0.0.0.0",
    dangerouslyAllowAllCORSRequests: false,
    graphqlPath: "/graphql",
    eventStreamPath: "/graphql/stream",
    graphqlOverGET: true,
    graphiql: true,
    graphiqlPath: "/",
    websockets: true,
    maxRequestLength: 100000,
  },
};


export const serv = grafserv({ schema, preset });
