const { gql } = require("apollo-server-lambda");

const { getArticleById, getArticleBySlug } = require("./resolvers/article");

const typeDefs = gql`
  type Image {
    source: String # Url scalar
    description: String
    thumbnailSource(width: Int, height: Int): String # Url scalar
  }

  enum Currency {
    EUR
    CHF
    USD
  }

  type Price {
    amount: Int
    currency: Currency
  }

  type StockItem {
    productId: String!
    size: String
    quantity: Int
  }

  type Product @cacheControl(maxAge: 300) {
    id: ID!
    name: String
    descriptionLong: String
    descriptionShort: String
    imageUrl: String
    brand: String
    price: Price
    price_rrp: Price
    slug: String
    stockItems: [StockItem!]!
  }

  type Query {
    product(id: ID!): Product
    productBySlug(slug: String!): Product
  }
`;

const resolvers = {
  Query: {
    product(obj, args, context, info) {
      return getArticleById(args.id);
    },
    productBySlug(obj, args, context, info) {
      return getArticleBySlug(args.slug);
    }
  }
};

const mocks = {
  StockItem: () => ({
    productId: "abc",
    size: "M",
    quantity: 12
  }),
  Price: () => ({
    amount: 123,
    currency: "EUR"
  }),
  Image: () => ({
    source: "http://placekitten.com/g/200/300"
  })
};

module.exports = {
  typeDefs,
  resolvers,
  mocks,
  mockEntireSchema: false,
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context
  })
};
