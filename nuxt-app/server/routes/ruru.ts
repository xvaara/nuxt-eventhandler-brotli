
import { grafserv } from 'grafserv/h3/v1'
import { eventHandler } from "h3"
import { lambda, makeGrafastSchema } from "grafast"; 

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


const serv = grafserv({ schema, preset });


export default eventHandler((event) => serv.handleGraphiqlEvent(event));

//works:

//set accept encoding with bt:
// export default eventHandler((event) => {
//   event.node.req.headers['accept-encoding'] = 'gzip, deflate, zstd'
//   return serv.handleGraphiqlStaticEvent(event)
// })


// just plain ruru html
// export default eventHandler((event) => {
//     event.node.res.setHeader('Content-Type', 'text/html')
//   return serv.ruruHTML(event)
// });
