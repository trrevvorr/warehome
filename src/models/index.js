// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Item, Container, Location } = initSchema(schema);

export {
  Item,
  Container,
  Location
};