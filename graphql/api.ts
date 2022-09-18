import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';
import { GraphQLClient } from 'graphql-request';

export const client = new GraphQLClient(
  'https://superb-lynx-33.hasura.app/v1/graphql'
);

export const api = createApi({
  reducerPath: 'api',
  baseQuery: graphqlRequestBaseQuery({ client }),
  endpoints: () => ({})
});
