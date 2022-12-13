/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateItem = /* GraphQL */ `
  subscription OnCreateItem(
    $filter: ModelSubscriptionItemFilterInput
    $owner: String
  ) {
    onCreateItem(filter: $filter, owner: $owner) {
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
export const onUpdateItem = /* GraphQL */ `
  subscription OnUpdateItem(
    $filter: ModelSubscriptionItemFilterInput
    $owner: String
  ) {
    onUpdateItem(filter: $filter, owner: $owner) {
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
export const onDeleteItem = /* GraphQL */ `
  subscription OnDeleteItem(
    $filter: ModelSubscriptionItemFilterInput
    $owner: String
  ) {
    onDeleteItem(filter: $filter, owner: $owner) {
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
export const onCreateContainer = /* GraphQL */ `
  subscription OnCreateContainer(
    $filter: ModelSubscriptionContainerFilterInput
    $owner: String
  ) {
    onCreateContainer(filter: $filter, owner: $owner) {
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
export const onUpdateContainer = /* GraphQL */ `
  subscription OnUpdateContainer(
    $filter: ModelSubscriptionContainerFilterInput
    $owner: String
  ) {
    onUpdateContainer(filter: $filter, owner: $owner) {
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
export const onDeleteContainer = /* GraphQL */ `
  subscription OnDeleteContainer(
    $filter: ModelSubscriptionContainerFilterInput
    $owner: String
  ) {
    onDeleteContainer(filter: $filter, owner: $owner) {
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
export const onCreateLocation = /* GraphQL */ `
  subscription OnCreateLocation(
    $filter: ModelSubscriptionLocationFilterInput
    $owner: String
  ) {
    onCreateLocation(filter: $filter, owner: $owner) {
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
export const onUpdateLocation = /* GraphQL */ `
  subscription OnUpdateLocation(
    $filter: ModelSubscriptionLocationFilterInput
    $owner: String
  ) {
    onUpdateLocation(filter: $filter, owner: $owner) {
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
export const onDeleteLocation = /* GraphQL */ `
  subscription OnDeleteLocation(
    $filter: ModelSubscriptionLocationFilterInput
    $owner: String
  ) {
    onDeleteLocation(filter: $filter, owner: $owner) {
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
