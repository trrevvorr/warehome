// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Item, Container, Area, Location } = initSchema(schema);

export {
  Item,
  Container,
  Area,
  Location
};