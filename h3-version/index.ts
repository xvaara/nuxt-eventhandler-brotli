import { createApp, defineEventHandler, toNodeListener } from "h3";
import { createServer } from "node:http";
import { grafserv } from 'grafserv/h3/v1'
import { lambda, makeGrafastSchema } from "grafast"; 

export const app = createApp();

const typeDefs = /* GraphQL */ `
  type Query {
    addTwoNumbers(a: Int!, b: Int!): Int
  }
`;

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

const schema = makeGrafastSchema({
  typeDefs,
  objects,
});


const preset = {
  grafserv: {
    port: 5678,
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


const serv = grafserv({ schema, preset });


app.use(
  "/ruru",
  defineEventHandler(event => serv.handleGraphiqlEvent(event))
);

createServer(toNodeListener(app)).listen(process.env.PORT || 3002);
