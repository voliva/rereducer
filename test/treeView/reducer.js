import { switchReducers, innerReducer, fromAction, outerReducer, createReducer, getState, reject, concat } from "../../src";
import { INCREMENT, CREATE_NODE, DELETE_NODE, ADD_CHILD, REMOVE_CHILD } from "./actions";
import { compose, flatten, prop, flip, contains, equals, inc } from 'ramda';

const getNodeId = fromAction(['nodeId']);
const getChildId = fromAction(['childId']);
const childIdsPath = [getNodeId, 'childIds'];
const newNodeTemplate = {
    id: getNodeId,
    counter: 0,
    childIds: []
};
const incrementCounter = innerReducer([getNodeId, 'counter'], inc);
const getNode = createReducer([getNodeId, getState], prop);
const isChildId = compose(equals, getChildId);

const getAllTreeIds = (byId, node) => flatten([
    node.id,
    node.childIds.reduce((t, id) => [
        t,
        getAllTreeIds(byId, byId[id])
    ], [])
]);
const getAllTargetTreeIds = createReducer([getState, getNode], getAllTreeIds);
const isInTargetId = compose(
    ids => compose(
        flip(contains)(ids),
        prop('id')
    ),
    getAllTargetTreeIds
);

const createNode = outerReducer([getNodeId], newNodeTemplate);
const deleteNode = reject(isInTargetId);
const concatChildId = concat(getChildId);
const rejectChildId = reject(isChildId);
const addChild = innerReducer(childIdsPath, concatChildId);
const removeChild = innerReducer(childIdsPath, rejectChildId);

export default switchReducers(
    {},
    [INCREMENT, incrementCounter],
    [CREATE_NODE, createNode],
    [DELETE_NODE, deleteNode],
    [ADD_CHILD, addChild],
    [REMOVE_CHILD, removeChild],
);
