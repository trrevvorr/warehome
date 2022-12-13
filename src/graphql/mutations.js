/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createItem = /* GraphQL */ `
  mutation CreateItem(
    $input: CreateItemInput!
    $condition: ModelItemConditionInput
  ) {
    createItem(input: $input, condition: $condition) {
      id
      name
      locationID
      containerID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;
export const updateItem = /* GraphQL */ `
  mutation UpdateItem(
    $input: UpdateItemInput!
    $condition: ModelItemConditionInput
  ) {
    updateItem(input: $input, condition: $condition) {
      id
      name
      locationID
      containerID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;
export const deleteItem = /* GraphQL */ `
  mutation DeleteItem(
    $input: DeleteItemInput!
    $condition: ModelItemConditionInput
  ) {
    deleteItem(input: $input, condition: $condition) {
      id
      name
      locationID
      containerID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;
export const createContainer = /* GraphQL */ `
  mutation CreateContainer(
    $input: CreateContainerInput!
    $condition: ModelContainerConditionInput
  ) {
    createContainer(input: $input, condition: $condition) {
      id
      name
      Items {
        items {
          id
          name
          locationID
          containerID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          owner
        }
        nextToken
        startedAt
      }
      locationID
      parentContainerID
      Containers {
        items {
          id
          name
          Items {
            nextToken
            startedAt
          }
          locationID
          parentContainerID
          Containers {
            nextToken
            startedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          owner
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;
export const updateContainer = /* GraphQL */ `
  mutation UpdateContainer(
    $input: UpdateContainerInput!
    $condition: ModelContainerConditionInput
  ) {
    updateContainer(input: $input, condition: $condition) {
      id
      name
      Items {
        items {
          id
          name
          locationID
          containerID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          owner
        }
        nextToken
        startedAt
      }
      locationID
      parentContainerID
      Containers {
        items {
          id
          name
          Items {
            nextToken
            startedAt
          }
          locationID
          parentContainerID
          Containers {
            nextToken
            startedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          owner
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;
export const deleteContainer = /* GraphQL */ `
  mutation DeleteContainer(
    $input: DeleteContainerInput!
    $condition: ModelContainerConditionInput
  ) {
    deleteContainer(input: $input, condition: $condition) {
      id
      name
      Items {
        items {
          id
          name
          locationID
          containerID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          owner
        }
        nextToken
        startedAt
      }
      locationID
      parentContainerID
      Containers {
        items {
          id
          name
          Items {
            nextToken
            startedAt
          }
          locationID
          parentContainerID
          Containers {
            nextToken
            startedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          owner
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;
export const createLocation = /* GraphQL */ `
  mutation CreateLocation(
    $input: CreateLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    createLocation(input: $input, condition: $condition) {
      id
      name
      Containers {
        items {
          id
          name
          Items {
            nextToken
            startedAt
          }
          locationID
          parentContainerID
          Containers {
            nextToken
            startedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          owner
        }
        nextToken
        startedAt
      }
      Items {
        items {
          id
          name
          locationID
          containerID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          owner
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;
export const updateLocation = /* GraphQL */ `
  mutation UpdateLocation(
    $input: UpdateLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    updateLocation(input: $input, condition: $condition) {
      id
      name
      Containers {
        items {
          id
          name
          Items {
            nextToken
            startedAt
          }
          locationID
          parentContainerID
          Containers {
            nextToken
            startedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          owner
        }
        nextToken
        startedAt
      }
      Items {
        items {
          id
          name
          locationID
          containerID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          owner
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;
export const deleteLocation = /* GraphQL */ `
  mutation DeleteLocation(
    $input: DeleteLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    deleteLocation(input: $input, condition: $condition) {
      id
      name
      Containers {
        items {
          id
          name
          Items {
            nextToken
            startedAt
          }
          locationID
          parentContainerID
          Containers {
            nextToken
            startedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          owner
        }
        nextToken
        startedAt
      }
      Items {
        items {
          id
          name
          locationID
          containerID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          owner
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;
